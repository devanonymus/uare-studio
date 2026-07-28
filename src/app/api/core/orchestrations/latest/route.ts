import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/core/database/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  businessId: z.string().uuid().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const query = QuerySchema.parse({
      businessId:
        request.nextUrl.searchParams.get("businessId") ||
        undefined,
    });

    const supabase = getSupabaseAdmin();

    let runQuery = supabase
      .from("orchestration_runs")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(1);

    if (query.businessId) {
      runQuery = runQuery.eq(
        "business_id",
        query.businessId,
      );
    }

    const { data: runs, error: runError } =
      await runQuery;

    if (runError) {
      throw new Error(
        `Lettura orchestration run fallita: ${runError.message}`,
      );
    }

    const run = runs?.[0];

    if (!run) {
      return NextResponse.json(
        {
          status: "empty",
          message:
            "Nessuna orchestrazione presente.",
        },
        {
          status: 404,
        },
      );
    }

    const [
      businessResult,
      missionsResult,
      automationsResult,
      approvalsResult,
      evidenceResult,
      sourcesResult,
    ] = await Promise.all([
      supabase
        .from("businesses")
        .select(
          "id, organisation_id, name, sector, city, website_url, primary_goal",
        )
        .eq("id", run.business_id)
        .single(),

      supabase
        .from("missions")
        .select("*")
        .eq("business_id", run.business_id)
        .order("priority", {
          ascending: false,
        })
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("automation_blueprints")
        .select("*")
        .eq("business_id", run.business_id)
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("approval_requests")
        .select("*")
        .eq("business_id", run.business_id)
        .order("requested_at", {
          ascending: false,
        }),

      supabase
        .from("evidence_claims")
        .select("*")
        .eq("business_id", run.business_id)
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("evidence_sources")
        .select("*")
        .eq("business_id", run.business_id)
        .order("created_at", {
          ascending: false,
        }),
    ]);

    const results = [
      businessResult,
      missionsResult,
      automationsResult,
      approvalsResult,
      evidenceResult,
      sourcesResult,
    ];

    const failedResult = results.find(
      (result) => result.error,
    );

    if (failedResult?.error) {
      throw new Error(
        failedResult.error.message,
      );
    }

    return NextResponse.json({
      status: "completed",
      fetchedAt: new Date().toISOString(),

      business: businessResult.data,

      run: {
        id: run.id,
        businessId: run.business_id,
        organisationId:
          run.organisation_id,
        status: run.status,
        confidence: run.confidence,
        missionCount: run.mission_count,
        automationCount:
          run.automation_count,
        evidenceCount:
          run.evidence_count,
        approvalCount:
          run.approval_count,
        errorCode: run.error_code,
        errorMessage:
          run.error_message,
        startedAt: run.started_at,
        finishedAt: run.finished_at,
        createdAt: run.created_at,
        outputPayload:
          run.output_payload,
      },

      missions:
        missionsResult.data ?? [],

      automations:
        automationsResult.data ?? [],

      approvals:
        approvalsResult.data ?? [],

      evidence:
        evidenceResult.data ?? [],

      sources:
        sourcesResult.data ?? [],
    });
  } catch (error) {
    console.error(
      "Latest orchestration API error:",
      error,
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Business ID non valido.",
          issues: error.issues,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        status: "failed",
        error:
          error instanceof Error
            ? error.message
            : "Errore sconosciuto.",
      },
      {
        status: 500,
      },
    );
  }
}

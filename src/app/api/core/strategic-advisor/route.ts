import {
  NextRequest,
  NextResponse,
} from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/core/database/supabase-admin";
import { writeAuditEvent } from "@/core/audit-log/logger";
import { buildStrategicBrief } from "@/core/strategic-advisor/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BusinessIdSchema =
  z.string().uuid();

async function loadBusinessData(
  businessId: string,
) {
  const supabase =
    getSupabaseAdmin();

  const [
    businessResult,
    opportunitiesResult,
    missionsResult,
    plansResult,
    approvalsResult,
    blueprintsResult,
    runsResult,
    artifactsResult,
    integrationsResult,
    memoryResult,
    graphSnapshotsResult,
    nodesResult,
    edgesResult,
  ] = await Promise.all([
    supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .single(),

    supabase
      .from("business_opportunities")
      .select("*")
      .eq("business_id", businessId),

    supabase
      .from("missions")
      .select("*")
      .eq("business_id", businessId),

    supabase
      .from("mission_plans")
      .select("*")
      .eq("business_id", businessId),

    supabase
      .from("approval_requests")
      .select("*")
      .eq("business_id", businessId),

    supabase
      .from("automation_blueprints")
      .select("*")
      .eq("business_id", businessId),

    supabase
      .from("automation_runs")
      .select("*")
      .eq("business_id", businessId),

    supabase
      .from("automation_artifacts")
      .select("*")
      .eq("business_id", businessId),

    supabase
      .from("integration_connections")
      .select("*")
      .eq("business_id", businessId),

    supabase
      .from("business_memory_entries")
      .select("*")
      .eq("business_id", businessId),

    supabase
      .from("knowledge_graph_snapshots")
      .select("*")
      .eq("business_id", businessId),

    supabase
      .from("knowledge_nodes")
      .select("*")
      .eq("business_id", businessId),

    supabase
      .from("knowledge_edges")
      .select("*")
      .eq("business_id", businessId),
  ]);

  const results = [
    businessResult,
    opportunitiesResult,
    missionsResult,
    plansResult,
    approvalsResult,
    blueprintsResult,
    runsResult,
    artifactsResult,
    integrationsResult,
    memoryResult,
    graphSnapshotsResult,
    nodesResult,
    edgesResult,
  ];

  const errorResult =
    results.find(
      (result) => result.error,
    );

  if (errorResult?.error) {
    throw new Error(
      errorResult.error.message,
    );
  }

  return {
    business:
      businessResult.data,

    opportunities:
      opportunitiesResult.data ?? [],

    missions:
      missionsResult.data ?? [],

    missionPlans:
      plansResult.data ?? [],

    approvals:
      approvalsResult.data ?? [],

    automationBlueprints:
      blueprintsResult.data ?? [],

    automationRuns:
      runsResult.data ?? [],

    automationArtifacts:
      artifactsResult.data ?? [],

    integrations:
      integrationsResult.data ?? [],

    memoryEntries:
      memoryResult.data ?? [],

    graphSnapshots:
      graphSnapshotsResult.data ?? [],

    knowledgeNodes:
      nodesResult.data ?? [],

    knowledgeEdges:
      edgesResult.data ?? [],
  };
}

export async function GET(
  request: NextRequest,
) {
  try {
    const businessId =
      BusinessIdSchema.parse(
        request.nextUrl.searchParams.get(
          "businessId",
        ),
      );

    const supabase =
      getSupabaseAdmin();

    const {
      data: brief,
      error,
    } = await supabase
      .from("strategic_briefs")
      .select("*")
      .eq(
        "business_id",
        businessId,
      )
      .order("brief_date", {
        ascending: false,
      })
      .order("generated_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      status: "completed",
      brief,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Business ID non valido.",
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

export async function POST(
  request: NextRequest,
) {
  const requestId =
    crypto.randomUUID();

  const startedAt =
    Date.now();

  try {
    const payload =
      await request.json();

    const businessId =
      BusinessIdSchema.parse(
        payload.businessId,
      );

    const sourceData =
      await loadBusinessData(
        businessId,
      );

    if (!sourceData.business) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Business non trovato.",
        },
        {
          status: 404,
        },
      );
    }

    const brief =
      buildStrategicBrief(
        sourceData,
      );

    const supabase =
      getSupabaseAdmin();

    const {
      data: savedBrief,
      error,
    } = await supabase
      .from("strategic_briefs")
      .upsert(
        {
          organisation_id:
            brief.organisationId,

          business_id:
            brief.businessId,

          brief_date:
            brief.briefDate,

          status: "completed",

          executive_summary:
            brief.executiveSummary,

          business_health_score:
            brief.businessHealthScore,

          confidence:
            brief.confidence,

          priorities:
            brief.priorities,

          alerts:
            brief.alerts,

          recommendations:
            brief.recommendations,

          missing_information:
            brief.missingInformation,

          metrics:
            brief.metrics,

          source_snapshot:
            brief.sourceSnapshot,

          generated_by:
            "uviq-strategic-advisor",

          generated_at:
            new Date().toISOString(),

          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict:
            "business_id,brief_date",
        },
      )
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    await writeAuditEvent({
      organisationId:
        brief.organisationId,

      businessId:
        brief.businessId,

      actorType: "agent",

      actorId:
        "uviq-strategic-advisor",

      eventType:
        "strategic_brief_generated",

      resourceType:
        "strategic_brief",

      resourceId:
        savedBrief.id,

      action:
        "Generazione del brief strategico giornaliero",

      previousState: null,

      nextState: {
        healthScore:
          brief.businessHealthScore,

        confidence:
          brief.confidence,

        priorities:
          brief.priorities.length,

        alerts:
          brief.alerts.length,

        durationMs:
          Date.now() - startedAt,
      },

      requestId,
      traceId: savedBrief.id,
    });

    return NextResponse.json({
      status: "completed",

      brief: savedBrief,

      durationMs:
        Date.now() - startedAt,
    });
  } catch (error) {
    console.error(
      "Strategic Advisor error:",
      error,
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Dati non validi.",
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

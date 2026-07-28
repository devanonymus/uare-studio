import {
  NextRequest,
  NextResponse,
} from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/core/database/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  businessId: z.string().uuid(),
});

type RawArtifact = {
  id?: string;
  type?: string;
  title?: string;
  description?: string;
  content?: string;
  channel?: string;
  status?: string;
  externalExecutionBlocked?: boolean;
  approvalRequired?: boolean;
};

async function materialiseArtifacts(
  businessId: string,
) {
  const supabase = getSupabaseAdmin();

  const { data: runs, error: runError } =
    await supabase
      .from("automation_runs")
      .select(
        `
        *,
        automation_blueprints (
          id,
          name,
          objective,
          risk_level,
          status
        )
      `,
      )
      .eq("business_id", businessId)
      .eq("status", "completed")
      .order("created_at", {
        ascending: false,
      });

  if (runError) {
    throw new Error(
      `Lettura automation runs fallita: ${runError.message}`,
    );
  }

  for (const run of runs ?? []) {
    const result =
      run.output_payload?.result;

    const artifacts: RawArtifact[] =
      Array.isArray(result?.artifacts)
        ? result.artifacts
        : [];

    for (
      let index = 0;
      index < artifacts.length;
      index += 1
    ) {
      const artifact = artifacts[index];

      const artifactKey =
        artifact.id ||
        `${artifact.type ?? "artifact"}-${index + 1}`;

      const { error } = await supabase
        .from("automation_artifacts")
        .upsert(
          {
            run_id: run.id,
            automation_id:
              run.automation_id,
            business_id:
              businessId,

            artifact_key:
              artifactKey,

            artifact_type:
              artifact.type ??
              "task",

            title:
              artifact.title ??
              `Artefatto ${index + 1}`,

            description:
              artifact.description ??
              "Descrizione non disponibile.",

            content:
              artifact.content ??
              "",

            channel:
              artifact.channel ??
              "workspace",

            approval_required:
              artifact.approvalRequired ??
              true,

            external_execution_blocked:
              artifact.externalExecutionBlocked ??
              true,
          },
          {
            onConflict:
              "run_id,artifact_key",

            ignoreDuplicates: true,
          },
        );

      if (error) {
        throw new Error(
          `Materializzazione artefatto fallita: ${error.message}`,
        );
      }
    }
  }

  return runs ?? [];
}

export async function GET(
  request: NextRequest,
) {
  try {
    const { businessId } =
      QuerySchema.parse({
        businessId:
          request.nextUrl.searchParams.get(
            "businessId",
          ),
      });

    const supabase =
      getSupabaseAdmin();

    const runs =
      await materialiseArtifacts(
        businessId,
      );

    const [
      businessResult,
      artifactsResult,
      queueResult,
    ] = await Promise.all([
      supabase
        .from("businesses")
        .select(
          "id, name, sector, city, website_url, primary_goal",
        )
        .eq("id", businessId)
        .single(),

      supabase
        .from("automation_artifacts")
        .select(
          `
          *,
          automation_blueprints (
            id,
            name,
            objective,
            risk_level,
            status
          )
        `,
        )
        .eq("business_id", businessId)
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("execution_queue")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", {
          ascending: false,
        }),
    ]);

    const error =
      businessResult.error ||
      artifactsResult.error ||
      queueResult.error;

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      status: "completed",

      fetchedAt:
        new Date().toISOString(),

      business:
        businessResult.data,

      runs,

      artifacts:
        artifactsResult.data ?? [],

      queue:
        queueResult.data ?? [],
    });
  } catch (error) {
    console.error(
      "Automation center error:",
      error,
    );

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

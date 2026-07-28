import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/core/database/supabase-admin";
import { writeAuditEvent } from "@/core/audit-log/logger";
import { evaluateAutomationExecutionPolicy } from "@/core/automations/execution-policy";
import { executeAutomationInSandbox } from "@/core/automations/sandbox-executor";

export const runtime = "nodejs";
export const maxDuration = 120;

const BodySchema = z.object({
  businessId: z.string().uuid(),

  dryRun: z.literal(true).default(true),

  requestedBy: z
    .string()
    .trim()
    .min(2)
    .max(160)
    .default("workspace-owner"),

  idempotencyKey: z
    .string()
    .trim()
    .min(8)
    .max(220)
    .optional(),

  context: z
    .record(z.string(), z.unknown())
    .default({}),
});

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const startedAt = Date.now();

  try {
    const { id } = await context.params;

    const automationId =
      z.string().uuid().parse(id);

    const body = BodySchema.parse(
      await request.json(),
    );

    const idempotencyKey =
      body.idempotencyKey ||
      request.headers.get(
        "Idempotency-Key",
      ) ||
      `automation-${automationId}-${crypto.randomUUID()}`;

    const supabase =
      getSupabaseAdmin();

    const {
      data: existingRun,
      error: existingError,
    } = await supabase
      .from("automation_runs")
      .select("*")
      .eq(
        "idempotency_key",
        idempotencyKey,
      )
      .maybeSingle();

    if (existingError) {
      throw new Error(
        `Controllo idempotenza fallito: ${existingError.message}`,
      );
    }

    if (existingRun) {
      return NextResponse.json({
        status: existingRun.status,
        cached: true,
        run: existingRun,
        durationMs:
          Date.now() - startedAt,
      });
    }

    const {
      data: blueprint,
      error: blueprintError,
    } = await supabase
      .from("automation_blueprints")
      .select("*")
      .eq("id", automationId)
      .eq(
        "business_id",
        body.businessId,
      )
      .single();

    if (blueprintError || !blueprint) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Automazione non trovata.",
        },
        {
          status: 404,
        },
      );
    }

    const policy =
      evaluateAutomationExecutionPolicy({
        blueprintStatus:
          blueprint.status,
        approvalRequired:
          blueprint.approval_required,
        dryRun: body.dryRun,
      });

    if (!policy.allowed) {
      return NextResponse.json(
        {
          status: "blocked",
          error: policy.reason,
          policy,
        },
        {
          status: 403,
        },
      );
    }

    const {
      data: business,
      error: businessError,
    } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", body.businessId)
      .single();

    if (businessError || !business) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Azienda non trovata.",
        },
        {
          status: 404,
        },
      );
    }

    const {
      data: businessMemory,
      error: memoryError,
    } = await supabase
      .from("business_memory_entries")
      .select(
        "category, memory_key, value, status, confidence, source_type, source_reference",
      )
      .eq(
        "business_id",
        body.businessId,
      )
      .eq("is_current", true)
      .order("category");

    if (memoryError) {
      throw new Error(
        `Lettura Business Memory fallita: ${memoryError.message}`,
      );
    }

    const {
      data: run,
      error: runError,
    } = await supabase
      .from("automation_runs")
      .insert({
        automation_id:
          automationId,

        business_id:
          body.businessId,

        idempotency_key:
          idempotencyKey,

        status: "running",

        triggered_by:
          body.requestedBy,

        input_payload: {
          dryRun: true,
          context: body.context,
          policy,
        },

        attempt_count: 1,

        started_at:
          new Date().toISOString(),
      })
      .select("*")
      .single();

    if (runError) {
      throw new Error(
        `Creazione automation run fallita: ${runError.message}`,
      );
    }

    try {
      const output =
        await executeAutomationInSandbox({
          blueprint,
          business,
          businessMemory:
            businessMemory ?? [],
          context: body.context,
        });

      const finishedAt =
        new Date().toISOString();

      const {
        data: completedRun,
        error: updateError,
      } = await supabase
        .from("automation_runs")
        .update({
          status: "completed",

          output_payload: {
            mode: "sandbox",
            result: output,
          },

          finished_at: finishedAt,
        })
        .eq("id", run.id)
        .select("*")
        .single();

      if (updateError) {
        throw new Error(
          `Salvataggio output fallito: ${updateError.message}`,
        );
      }

      await writeAuditEvent({
        organisationId:
          business.organisation_id,

        businessId:
          body.businessId,

        actorType: "automation",

        actorId:
          "uviq-sandbox-executor",

        eventType:
          "automation_sandbox_completed",

        resourceType:
          "automation",

        resourceId:
          automationId,

        action:
          "Esecuzione sandbox completata senza effetti esterni.",

        nextState: {
          runId: run.id,
          status: "completed",
          artifactsCreated:
            output.artifacts.length,
          blockedExternalActions:
            output
              .blockedExternalActions
              .length,
          confidence:
            output.confidence,
        },

        requestId:
          idempotencyKey,

        traceId:
          run.id,
      });

      return NextResponse.json(
        {
          status: "completed",
          cached: false,
          mode: "sandbox",
          run: completedRun,
          result: output,
          durationMs:
            Date.now() -
            startedAt,
        },
        {
          status: 201,
        },
      );
    } catch (executionError) {
      await supabase
        .from("automation_runs")
        .update({
          status: "failed",

          error_code:
            "SANDBOX_EXECUTION_FAILED",

          error_message:
            executionError instanceof Error
              ? executionError.message
              : "Errore sconosciuto",

          finished_at:
            new Date().toISOString(),
        })
        .eq("id", run.id);

      throw executionError;
    }
  } catch (error) {
    console.error(
      "Automation execution error:",
      error,
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Dati di esecuzione non validi.",
          issues: error.issues,
          durationMs:
            Date.now() -
            startedAt,
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
        durationMs:
          Date.now() -
          startedAt,
      },
      {
        status: 500,
      },
    );
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { runUviqOrchestrator } from "@/ai/orchestrator/run-uviq-orchestrator";
import { SupabaseBusinessMemoryRepository } from "@/core/business-memory/supabase-repository";
import { getSupabaseAdmin } from "@/core/database/supabase-admin";
import { persistOrchestration } from "@/core/orchestrator/persist-orchestration";

export const runtime = "nodejs";
export const maxDuration = 120;

const RequestSchema = z.object({
  businessId: z.string().uuid(),

  primaryGoal: z
    .string()
    .trim()
    .min(5)
    .max(500)
    .optional(),

  notes: z
    .string()
    .trim()
    .max(4000)
    .default(""),

  idempotencyKey: z
    .string()
    .trim()
    .min(8)
    .max(180)
    .optional(),
});

export async function POST(
  request: Request,
) {
  const startedAt = Date.now();

  try {
    const body = RequestSchema.parse(
      await request.json(),
    );

    const idempotencyKey =
      body.idempotencyKey ||
      request.headers.get(
        "Idempotency-Key",
      ) ||
      crypto.randomUUID();

    const supabase =
      getSupabaseAdmin();

    const { data: existingRun } =
      await supabase
        .from("orchestration_runs")
        .select("*")
        .eq(
          "idempotency_key",
          idempotencyKey,
        )
        .maybeSingle();

    if (
      existingRun?.status === "completed"
    ) {
      return NextResponse.json({
        status: "completed",
        cached: true,
        run: existingRun,
        durationMs:
          Date.now() - startedAt,
      });
    }

    if (
      existingRun &&
      existingRun.status !== "failed"
    ) {
      return NextResponse.json(
        {
          status:
            existingRun.status,
          cached: true,
          run: existingRun,
          message:
            "Esiste già un’esecuzione con questa chiave di idempotenza.",
        },
        {
          status: 202,
        },
      );
    }

    const repository =
      new SupabaseBusinessMemoryRepository();

    const business =
      await repository.getBusiness(
        body.businessId,
      );

    if (!business) {
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

    const currentMemory =
      await repository.getCurrentMemory(
        body.businessId,
      );

    const { data: businessDatabaseRow, error } =
      await supabase
        .from("businesses")
        .select(
          "organisation_id",
        )
        .eq("id", body.businessId)
        .single();

    if (error) {
      throw new Error(
        `Lettura organizzazione fallita: ${error.message}`,
      );
    }

    const orchestration =
      await runUviqOrchestrator({
        businessName: business.name,
        sector: business.sector,
        city: business.city ?? "",
        website:
          business.websiteUrl ?? "",
        primaryGoal:
          body.primaryGoal ||
          business.primaryGoal ||
          "Individuare opportunità concrete di crescita.",
        notes: body.notes,
        discovery: {
          businessMemory:
            currentMemory.map(
              (entry) => ({
                category:
                  entry.category,
                key:
                  entry.memoryKey,
                value:
                  entry.value,
                status:
                  entry.status,
                confidence:
                  entry.confidence,
                source:
                  entry.sourceReference,
              }),
            ),
        },
      });

    const persistence =
      await persistOrchestration({
        organisationId:
          businessDatabaseRow.organisation_id,
        businessId:
          body.businessId,
        idempotencyKey,
        result:
          orchestration.result,
        inputPayload: {
          business,
          primaryGoal:
            body.primaryGoal,
          notes: body.notes,
          memoryEntriesRead:
            currentMemory.length,
        },
      });

    return NextResponse.json(
      {
        status: "completed",
        cached:
          persistence.alreadyExists,
        orchestration:
          orchestration.result,
        persistence:
          persistence.persisted,
        durationMs:
          Date.now() -
          startedAt,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "UVIQ persistent orchestration error:",
      error,
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Input non valido.",
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

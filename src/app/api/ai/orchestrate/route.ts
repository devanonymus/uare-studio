import { NextResponse } from "next/server";
import { z } from "zod";
import { runUviqOrchestrator } from "@/ai/orchestrator/run-uviq-orchestrator";

export const runtime = "nodejs";
export const maxDuration = 90;

const OrchestratorInputSchema = z.object({
  businessName: z.string().trim().min(2).max(180),
  sector: z.string().trim().min(2).max(120),
  city: z.string().trim().max(120).default(""),
  website: z.string().trim().max(500).default(""),
  primaryGoal: z.string().trim().min(5).max(500),
  notes: z.string().trim().max(4000).default(""),

  discovery: z
    .record(
      z.string(),
      z.unknown(),
    )
    .default({}),
});

export async function POST(
  request: Request,
) {
  const startedAt = Date.now();

  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Motore AI non configurato: OPENAI_API_KEY assente.",
          status: "failed",
        },
        {
          status: 503,
        },
      );
    }

    const body = await request.json();

    const input =
      OrchestratorInputSchema.parse(body);

    const orchestration =
      await runUviqOrchestrator(input);

    return NextResponse.json({
      ...orchestration,
      status: "completed",
      durationMs:
        Date.now() - startedAt,
      mode: "ai_orchestration",
    });
  } catch (error) {
    console.error(
      "UVIQ Orchestrator error:",
      error,
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error:
            "Input non valido.",
          issues: error.issues,
          status: "failed",
          durationMs:
            Date.now() - startedAt,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Errore sconosciuto durante l'orchestrazione UVIQ.",
        status: "failed",
        durationMs:
          Date.now() - startedAt,
      },
      {
        status: 500,
      },
    );
  }
}

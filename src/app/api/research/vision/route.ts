import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeWebsiteVision } from "@/agents/vision/vision-agent";

export const runtime = "nodejs";
export const maxDuration = 90;

const RequestSchema = z.object({
  runId: z
    .string()
    .min(3)
    .max(160)
    .regex(/^[a-zA-Z0-9_-]+$/),

  restaurantName: z.string().min(2).max(180),
});

export async function POST(request: Request) {
  try {
    const input = RequestSchema.parse(await request.json());

    const result = await analyzeWebsiteVision(
      input.runId,
      input.restaurantName,
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("UAE Vision Agent:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Errore durante l'analisi visuale.",
      },
      {
        status: 500,
      },
    );
  }
}

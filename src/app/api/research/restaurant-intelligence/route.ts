import { NextResponse } from "next/server";
import { z } from "zod";
import { generateRestaurantIntelligence } from "@/agents/restaurant/restaurant-intelligence-agent";

export const runtime = "nodejs";
export const maxDuration = 120;

const RequestSchema = z.object({
  runId: z
    .string()
    .min(3)
    .max(180)
    .regex(/^[a-zA-Z0-9_-]+$/),

  restaurantName: z.string().min(2).max(180),
  city: z.string().max(120).optional(),
  website: z.string().max(1000).optional(),
});

export async function POST(request: Request) {
  try {
    const input = RequestSchema.parse(await request.json());

    const intelligence =
      await generateRestaurantIntelligence(input);

    return NextResponse.json({
      success: true,
      intelligence,
    });
  } catch (error) {
    console.error("Sector Intelligence Engine:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Errore nel Sector Intelligence Engine.",
      },
      {
        status: 500,
      },
    );
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { captureWebsiteScreenshots } from "@/research/browser/screenshot-engine";

export const runtime = "nodejs";
export const maxDuration = 60;

const RequestSchema = z.object({
  url: z.string().min(3).max(1000),
  projectName: z.string().max(160).optional(),
});

export async function POST(request: Request) {
  try {
    const body = RequestSchema.parse(await request.json());

    const evidence = await captureWebsiteScreenshots(
      body.url,
      body.projectName,
    );

    if (evidence.viewportArtifacts.length === 0) {
      return NextResponse.json(
        {
          error:
            "Il sito è stato raggiunto, ma non è stato possibile produrre gli screenshot.",
          evidence,
        },
        {
          status: 422,
        },
      );
    }

    return NextResponse.json({
      success: true,
      evidence,
    });
  } catch (error) {
    console.error("Screenshot Research Engine:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Errore durante l’analisi visuale del sito.",
      },
      {
        status: 500,
      },
    );
  }
}

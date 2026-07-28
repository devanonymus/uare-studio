import {
  NextRequest,
  NextResponse,
} from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/core/database/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
) {
  try {
    const businessId =
      z.string().uuid().parse(
        request.nextUrl.searchParams.get(
          "businessId",
        ),
      );

    const supabase =
      getSupabaseAdmin();

    const { data, error } =
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
        .eq(
          "business_id",
          businessId,
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(20);

    if (error) {
      throw new Error(
        error.message,
      );
    }

    return NextResponse.json({
      status: "completed",
      runs: data ?? [],
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

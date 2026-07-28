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
    const businessId = z
      .string()
      .uuid()
      .parse(
        request.nextUrl.searchParams.get(
          "businessId",
        ),
      );

    const supabase = getSupabaseAdmin();

    const [
      businessResult,
      opportunitiesResult,
      runsResult,
    ] = await Promise.all([
      supabase
        .from("businesses")
        .select(
          "id, name, sector, city, primary_goal",
        )
        .eq("id", businessId)
        .single(),

      supabase
        .from("business_opportunities")
        .select("*")
        .eq("business_id", businessId)
        .order("priority", {
          ascending: false,
        })
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("opportunity_runs")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", {
          ascending: false,
        })
        .limit(10),
    ]);

    const error =
      businessResult.error ||
      opportunitiesResult.error ||
      runsResult.error;

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      status: "completed",
      business: businessResult.data,
      opportunities:
        opportunitiesResult.data ?? [],
      runs: runsResult.data ?? [],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "failed",
          error: "Business ID non valido.",
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

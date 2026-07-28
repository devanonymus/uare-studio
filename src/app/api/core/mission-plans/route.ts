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
      plansResult,
      blueprintsResult,
      approvalsResult,
    ] = await Promise.all([
      supabase
        .from("businesses")
        .select(
          "id, name, sector, city, primary_goal",
        )
        .eq("id", businessId)
        .single(),

      supabase
        .from("mission_plans")
        .select(
          `
          *,
          missions (
            id,
            title,
            objective,
            rationale,
            status,
            priority,
            impact,
            effort,
            risk_level,
            owner_agent,
            approval_required
          )
        `,
        )
        .eq("business_id", businessId)
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("automation_blueprints")
        .select("*")
        .eq("business_id", businessId)
        .eq(
          "created_by",
          "uviq-mission-planner",
        )
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("approval_requests")
        .select("*")
        .eq("business_id", businessId)
        .order("requested_at", {
          ascending: false,
        }),
    ]);

    const error =
      businessResult.error ||
      plansResult.error ||
      blueprintsResult.error ||
      approvalsResult.error;

    if (error) {
      throw new Error(error.message);
    }

    const plans = (plansResult.data ?? []).map(
      (plan) => {
        const blueprintMarker =
          `Mission Plan ID: ${plan.id}`;

        const blueprints =
          (blueprintsResult.data ?? []).filter(
            (blueprint) =>
              Array.isArray(
                blueprint.safeguards,
              ) &&
              blueprint.safeguards.includes(
                blueprintMarker,
              ),
          );

        const planApprovals =
          (approvalsResult.data ?? []).filter(
            (approval) =>
              approval.metadata
                ?.missionPlanId === plan.id,
          );

        return {
          ...plan,
          blueprints,
          approvals: planApprovals,
        };
      },
    );

    return NextResponse.json({
      status: "completed",
      business: businessResult.data,
      plans,
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

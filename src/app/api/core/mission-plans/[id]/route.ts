import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/core/database/supabase-admin";
import { writeAuditEvent } from "@/core/audit-log/logger";

export const runtime = "nodejs";

const ActionSchema = z.object({
  action: z.enum([
    "approve",
    "reject",
    "restore",
  ]),

  actorId: z
    .string()
    .trim()
    .min(2)
    .max(160)
    .default("workspace-owner"),

  note: z
    .string()
    .trim()
    .max(1800)
    .default(""),
});

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const requestId = crypto.randomUUID();

  try {
    const { id } = await context.params;

    const planId =
      z.string().uuid().parse(id);

    const input = ActionSchema.parse(
      await request.json(),
    );

    const supabase =
      getSupabaseAdmin();

    const {
      data: plan,
      error: planError,
    } = await supabase
      .from("mission_plans")
      .select(
        `
        *,
        missions (
          id,
          title,
          status,
          risk_level
        ),
        businesses (
          organisation_id
        )
      `,
      )
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Piano operativo non trovato.",
        },
        {
          status: 404,
        },
      );
    }

    const now =
      new Date().toISOString();

    let nextPlanStatus = plan.status;
    let nextMissionStatus =
      plan.missions?.status ?? null;

    if (input.action === "approve") {
      if (
        ![
          "awaiting_approval",
          "generated",
          "draft",
        ].includes(plan.status)
      ) {
        return NextResponse.json(
          {
            status: "blocked",
            error:
              `Il piano non può essere approvato dallo stato "${plan.status}".`,
          },
          {
            status: 409,
          },
        );
      }

      nextPlanStatus = "approved";
      nextMissionStatus = "approved";

      const { error } = await supabase
        .from("mission_plans")
        .update({
          status: "approved",
          approved_at: now,
          approved_by: input.actorId,
        })
        .eq("id", planId);

      if (error) {
        throw new Error(error.message);
      }

      const { error: missionError } =
        await supabase
          .from("missions")
          .update({
            status: "approved",
            result_summary:
              `Piano operativo ${plan.id} approvato.`,
          })
          .eq("id", plan.mission_id);

      if (missionError) {
        throw new Error(
          missionError.message,
        );
      }
    }

    if (input.action === "reject") {
      if (
        [
          "completed",
          "executing",
          "archived",
        ].includes(plan.status)
      ) {
        return NextResponse.json(
          {
            status: "blocked",
            error:
              "Il piano non può essere rifiutato nello stato attuale.",
          },
          {
            status: 409,
          },
        );
      }

      nextPlanStatus = "rejected";
      nextMissionStatus = "approved";

      const { error } = await supabase
        .from("mission_plans")
        .update({
          status: "rejected",
          approved_at: null,
          approved_by: null,
        })
        .eq("id", planId);

      if (error) {
        throw new Error(error.message);
      }

      const { error: missionError } =
        await supabase
          .from("missions")
          .update({
            status: "approved",
            result_summary:
              input.note ||
              `Piano operativo ${plan.id} rifiutato. Missione da ripianificare.`,
          })
          .eq("id", plan.mission_id);

      if (missionError) {
        throw new Error(
          missionError.message,
        );
      }
    }

    if (input.action === "restore") {
      if (plan.status !== "rejected") {
        return NextResponse.json(
          {
            status: "blocked",
            error:
              "Soltanto un piano rifiutato può essere ripristinato.",
          },
          {
            status: 409,
          },
        );
      }

      nextPlanStatus =
        "awaiting_approval";

      nextMissionStatus =
        "awaiting_approval";

      const { error } = await supabase
        .from("mission_plans")
        .update({
          status:
            "awaiting_approval",
          approved_at: null,
          approved_by: null,
        })
        .eq("id", planId);

      if (error) {
        throw new Error(error.message);
      }

      const { error: missionError } =
        await supabase
          .from("missions")
          .update({
            status:
              "awaiting_approval",
            result_summary:
              `Piano operativo ${plan.id} ripristinato per una nuova revisione.`,
          })
          .eq("id", plan.mission_id);

      if (missionError) {
        throw new Error(
          missionError.message,
        );
      }
    }

    const approvalDecision =
      input.action === "approve"
        ? "approved"
        : input.action === "reject"
          ? "rejected"
          : "pending";

    if (input.action !== "restore") {
      const {
        data: approvalRows,
        error: approvalReadError,
      } = await supabase
        .from("approval_requests")
        .select("id")
        .eq(
          "business_id",
          plan.business_id,
        )
        .eq(
          "resource_type",
          "mission",
        )
        .eq(
          "resource_id",
          plan.mission_id,
        )
        .eq("status", "pending")
        .contains("metadata", {
          missionPlanId: plan.id,
        });

      if (approvalReadError) {
        throw new Error(
          approvalReadError.message,
        );
      }

      const ids = (
        approvalRows ?? []
      ).map((row) => row.id);

      if (ids.length > 0) {
        const { error } = await supabase
          .from("approval_requests")
          .update({
            status:
              approvalDecision,
            decision_note:
              input.note || null,
            decided_at: now,
          })
          .in("id", ids);

        if (error) {
          throw new Error(
            error.message,
          );
        }
      }
    }

    if (input.action === "restore") {
      const {
        data: existingApproval,
        error: approvalError,
      } = await supabase
        .from("approval_requests")
        .select("id")
        .eq(
          "business_id",
          plan.business_id,
        )
        .eq(
          "resource_type",
          "mission",
        )
        .eq(
          "resource_id",
          plan.mission_id,
        )
        .eq("status", "pending")
        .contains("metadata", {
          missionPlanId: plan.id,
        })
        .maybeSingle();

      if (approvalError) {
        throw new Error(
          approvalError.message,
        );
      }

      if (!existingApproval) {
        const { error } = await supabase
          .from("approval_requests")
          .insert({
            organisation_id:
              plan.businesses
                ?.organisation_id,

            business_id:
              plan.business_id,

            resource_type:
              "mission",

            resource_id:
              plan.mission_id,

            action:
              `Approvare piano operativo della missione: ${plan.missions?.title ?? plan.mission_id}`,

            reason:
              plan.executive_summary,

            risk_level:
              plan.missions
                ?.risk_level ??
              "medium",

            status: "pending",

            requested_by:
              "uviq-mission-planner",

            assigned_role:
              [
                "high",
                "critical",
              ].includes(
                plan.missions
                  ?.risk_level,
              )
                ? "owner"
                : "manager",

            metadata: {
              missionPlanId:
                plan.id,

              approvalSubtype:
                "mission_plan",
            },
          });

        if (error) {
          throw new Error(
            error.message,
          );
        }
      }
    }

    await writeAuditEvent({
      organisationId:
        plan.businesses
          ?.organisation_id,

      businessId:
        plan.business_id,

      actorType: "user",

      actorId:
        input.actorId,

      eventType:
        `mission_plan_${input.action}`,

      resourceType:
        "mission_plan",

      resourceId:
        plan.id,

      action:
        `${input.action}: piano della missione ${plan.missions?.title ?? plan.mission_id}`,

      previousState: {
        planStatus:
          plan.status,

        missionStatus:
          plan.missions?.status,
      },

      nextState: {
        planStatus:
          nextPlanStatus,

        missionStatus:
          nextMissionStatus,

        decisionNote:
          input.note || null,
      },

      requestId,
      traceId: plan.id,
    });

    return NextResponse.json({
      status: "completed",

      action: input.action,

      plan: {
        id: plan.id,
        status: nextPlanStatus,
      },

      mission: {
        id: plan.mission_id,
        status: nextMissionStatus,
      },
    });
  } catch (error) {
    console.error(
      "Mission plan decision error:",
      error,
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Dati non validi.",
          issues: error.issues,
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

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
    "convert_to_mission",
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
    .max(1500)
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

    const opportunityId =
      z.string().uuid().parse(id);

    const input = ActionSchema.parse(
      await request.json(),
    );

    const supabase =
      getSupabaseAdmin();

    const {
      data: opportunity,
      error: opportunityError,
    } = await supabase
      .from("business_opportunities")
      .select("*")
      .eq("id", opportunityId)
      .single();

    if (
      opportunityError ||
      !opportunity
    ) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Opportunità non trovata.",
        },
        {
          status: 404,
        },
      );
    }

    const {
      data: business,
      error: businessError,
    } = await supabase
      .from("businesses")
      .select(
        "id, organisation_id, name",
      )
      .eq(
        "id",
        opportunity.business_id,
      )
      .single();

    if (
      businessError ||
      !business
    ) {
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

    const now =
      new Date().toISOString();

    let nextStatus =
      opportunity.status;

    let missionId:
      | string
      | null = null;

    if (input.action === "approve") {
      if (
        opportunity.status ===
        "converted_to_mission"
      ) {
        return NextResponse.json(
          {
            status: "blocked",
            error:
              "L’opportunità è già stata trasformata in missione.",
          },
          {
            status: 409,
          },
        );
      }

      nextStatus = "approved";

      const { error } =
        await supabase
          .from(
            "business_opportunities",
          )
          .update({
            status: nextStatus,
            approved_at: now,
            approved_by:
              input.actorId,
            rejected_at: null,
            rejected_by: null,
            decision_note:
              input.note || null,
          })
          .eq("id", opportunityId);

      if (error) {
        throw new Error(
          error.message,
        );
      }
    }

    if (input.action === "reject") {
      if (
        opportunity.status ===
        "converted_to_mission"
      ) {
        return NextResponse.json(
          {
            status: "blocked",
            error:
              "Non puoi rifiutare un’opportunità già convertita.",
          },
          {
            status: 409,
          },
        );
      }

      nextStatus = "rejected";

      const { error } =
        await supabase
          .from(
            "business_opportunities",
          )
          .update({
            status: nextStatus,
            rejected_at: now,
            rejected_by:
              input.actorId,
            approved_at: null,
            approved_by: null,
            decision_note:
              input.note || null,
          })
          .eq("id", opportunityId);

      if (error) {
        throw new Error(
          error.message,
        );
      }
    }

    if (input.action === "restore") {
      if (
        opportunity.status ===
        "converted_to_mission"
      ) {
        return NextResponse.json(
          {
            status: "blocked",
            error:
              "La missione è già stata creata e non può essere annullata da questa schermata.",
          },
          {
            status: 409,
          },
        );
      }

      nextStatus = "proposed";

      const { error } =
        await supabase
          .from(
            "business_opportunities",
          )
          .update({
            status: nextStatus,
            approved_at: null,
            approved_by: null,
            rejected_at: null,
            rejected_by: null,
            decision_note: null,
          })
          .eq("id", opportunityId);

      if (error) {
        throw new Error(
          error.message,
        );
      }
    }

    if (
      input.action ===
      "convert_to_mission"
    ) {
      if (
        opportunity.status !==
        "approved"
      ) {
        return NextResponse.json(
          {
            status: "blocked",
            error:
              "Approva prima l’opportunità.",
          },
          {
            status: 409,
          },
        );
      }

      const {
        data: existingMission,
        error: existingMissionError,
      } = await supabase
        .from("missions")
        .select("id")
        .eq(
          "business_id",
          opportunity.business_id,
        )
        .contains("dependencies", [
          `opportunity:${opportunity.id}`,
        ])
        .maybeSingle();

      if (existingMissionError) {
        throw new Error(
          existingMissionError.message,
        );
      }

      if (existingMission) {
        return NextResponse.json(
          {
            status: "blocked",
            error:
              "Questa opportunità è già collegata a una missione.",
            missionId:
              existingMission.id,
          },
          {
            status: 409,
          },
        );
      }

      const proposedActions =
        Array.isArray(
          opportunity.proposed_actions,
        )
          ? opportunity.proposed_actions
          : [];

      const expectedKpis =
        Array.isArray(
          opportunity.expected_kpis,
        )
          ? opportunity.expected_kpis
          : [];

      const ownerAgent =
        proposedActions[0]
          ?.ownerAgent ||
        "uviq-strategy-agent";

      const approvalRequired =
        proposedActions.some(
          (
            action: {
              approvalRequired?: boolean;
            },
          ) =>
            action.approvalRequired ===
            true,
        ) || true;

      const {
        data: mission,
        error: missionError,
      } = await supabase
        .from("missions")
        .insert({
          business_id:
            opportunity.business_id,

          title:
            opportunity.title,

          objective:
            opportunity.summary,

          rationale:
            opportunity.rationale,

          status:
            approvalRequired
              ? "awaiting_approval"
              : "ready",

          priority:
            opportunity.priority,

          impact:
            opportunity.impact,

          effort:
            opportunity.effort,

          risk_level:
            opportunity.risk_level,

          owner_agent:
            ownerAgent,

          approval_required:
            approvalRequired,

          estimated_cost:
            opportunity
              .estimated_cost_min,

          currency:
            opportunity.currency ||
            "EUR",

          dependencies: [
            `opportunity:${opportunity.id}`,
          ],

          kpis:
            expectedKpis,

          evidence_claim_ids:
            opportunity
              .supporting_evidence_ids ??
            [],

          created_by:
            "uviq-opportunity-engine",
        })
        .select("*")
        .single();

      if (missionError) {
        throw new Error(
          `Creazione missione fallita: ${missionError.message}`,
        );
      }

      missionId = mission.id;

      if (approvalRequired) {
        const {
          error: approvalError,
        } = await supabase
          .from(
            "approval_requests",
          )
          .insert({
            organisation_id:
              business.organisation_id,

            business_id:
              opportunity.business_id,

            resource_type:
              "mission",

            resource_id:
              mission.id,

            action:
              `Approvare missione: ${mission.title}`,

            reason:
              opportunity.rationale,

            risk_level:
              opportunity.risk_level,

            status: "pending",

            requested_by:
              "uviq-opportunity-engine",

            assigned_role:
              [
                "high",
                "critical",
              ].includes(
                opportunity.risk_level,
              )
                ? "owner"
                : "manager",

            metadata: {
              opportunityId:
                opportunity.id,
              source:
                "business_opportunity_engine",
            },
          });

        if (approvalError) {
          throw new Error(
            `Creazione approvazione fallita: ${approvalError.message}`,
          );
        }
      }

      nextStatus =
        "converted_to_mission";

      const {
        error: opportunityUpdateError,
      } = await supabase
        .from(
          "business_opportunities",
        )
        .update({
          status: nextStatus,

          decision_note:
            input.note ||
            `Convertita nella missione ${mission.id}`,
        })
        .eq("id", opportunityId);

      if (opportunityUpdateError) {
        throw new Error(
          opportunityUpdateError.message,
        );
      }
    }

    await writeAuditEvent({
      organisationId:
        business.organisation_id,

      businessId:
        opportunity.business_id,

      actorType: "user",

      actorId:
        input.actorId,

      eventType:
        `opportunity_${input.action}`,

      resourceType:
        "business_opportunity",

      resourceId:
        opportunity.id,

      action:
        `${input.action}: ${opportunity.title}`,

      previousState: {
        status:
          opportunity.status,
      },

      nextState: {
        status:
          nextStatus,

        missionId,

        decisionNote:
          input.note || null,
      },

      requestId,

      traceId:
        opportunity.snapshot_id ??
        opportunity.id,
    });

    return NextResponse.json({
      status: "completed",

      action:
        input.action,

      opportunity: {
        id:
          opportunity.id,

        status:
          nextStatus,
      },

      missionId,
    });
  } catch (error) {
    console.error(
      "Opportunity decision error:",
      error,
    );

    if (
      error instanceof z.ZodError
    ) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Dati non validi.",
          issues:
            error.issues,
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

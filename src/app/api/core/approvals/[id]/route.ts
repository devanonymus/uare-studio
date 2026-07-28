import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/core/database/supabase-admin";
import { writeAuditEvent } from "@/core/audit-log/logger";

export const runtime = "nodejs";

const DecisionSchema = z.object({
  decision: z.enum([
    "approved",
    "rejected",
  ]),

  note: z
    .string()
    .trim()
    .max(1200)
    .default(""),

  actorId: z
    .string()
    .trim()
    .min(2)
    .max(160)
    .default("workspace-owner"),
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

    const approvalId =
      z.string().uuid().parse(id);

    const input =
      DecisionSchema.parse(
        await request.json(),
      );

    const supabase =
      getSupabaseAdmin();

    const {
      data: approval,
      error: approvalError,
    } = await supabase
      .from("approval_requests")
      .select("*")
      .eq("id", approvalId)
      .single();

    if (approvalError || !approval) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Richiesta di approvazione non trovata.",
        },
        {
          status: 404,
        },
      );
    }

    if (approval.status !== "pending") {
      return NextResponse.json(
        {
          status: "failed",
          error:
            `La richiesta è già nello stato "${approval.status}".`,
        },
        {
          status: 409,
        },
      );
    }

    const decidedAt =
      new Date().toISOString();

    const {
      error: decisionError,
    } = await supabase
      .from("approval_requests")
      .update({
        status: input.decision,
        decision_note:
          input.note || null,
        decided_at: decidedAt,
      })
      .eq("id", approvalId)
      .eq("status", "pending");

    if (decisionError) {
      throw new Error(
        `Aggiornamento approvazione fallito: ${decisionError.message}`,
      );
    }

    let resourceStatus:
      | string
      | null = null;

    if (
      approval.resource_type ===
      "mission"
    ) {
      resourceStatus =
        input.decision === "approved"
          ? "approved"
          : "rejected";

      const { error } =
        await supabase
          .from("missions")
          .update({
            status: resourceStatus,
          })
          .eq(
            "id",
            approval.resource_id,
          );

      if (error) {
        throw new Error(
          `Aggiornamento missione fallito: ${error.message}`,
        );
      }
    }

    if (
      approval.resource_type ===
      "automation"
    ) {
      resourceStatus =
        input.decision === "approved"
          ? "approved"
          : "cancelled";

      const { error } =
        await supabase
          .from(
            "automation_blueprints",
          )
          .update({
            status: resourceStatus,
          })
          .eq(
            "id",
            approval.resource_id,
          );

      if (error) {
        throw new Error(
          `Aggiornamento automazione fallito: ${error.message}`,
        );
      }
    }

    await writeAuditEvent({
      organisationId:
        approval.organisation_id,
      businessId:
        approval.business_id,
      actorType: "user",
      actorId: input.actorId,

      eventType:
        input.decision === "approved"
          ? "approval_granted"
          : "approval_rejected",

      resourceType:
        approval.resource_type,

      resourceId:
        approval.resource_id,

      action:
        input.decision === "approved"
          ? `Approvata azione: ${approval.action}`
          : `Rifiutata azione: ${approval.action}`,

      previousState: {
        approvalStatus:
          approval.status,
      },

      nextState: {
        approvalStatus:
          input.decision,
        resourceStatus,
        decisionNote:
          input.note || null,
      },

      requestId,

      traceId:
        approval.metadata
          ?.orchestratorRunId ??
        null,
    });

    return NextResponse.json({
      status: "completed",

      approval: {
        id: approvalId,
        decision:
          input.decision,
        decidedAt,
      },

      resource: {
        type:
          approval.resource_type,
        id: approval.resource_id,
        status: resourceStatus,
      },
    });
  } catch (error) {
    console.error(
      "Approval decision error:",
      error,
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Dati approvazione non validi.",
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

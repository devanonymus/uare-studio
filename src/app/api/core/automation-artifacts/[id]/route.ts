import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/core/database/supabase-admin";
import { writeAuditEvent } from "@/core/audit-log/logger";

export const runtime = "nodejs";

const DecisionSchema = z.object({
  action: z.enum([
    "approve",
    "reject",
    "queue",
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
  const requestId =
    crypto.randomUUID();

  try {
    const { id } =
      await context.params;

    const artifactId =
      z.string().uuid().parse(id);

    const input =
      DecisionSchema.parse(
        await request.json(),
      );

    const supabase =
      getSupabaseAdmin();

    const {
      data: artifact,
      error: artifactError,
    } = await supabase
      .from("automation_artifacts")
      .select(
        `
        *,
        businesses (
          organisation_id
        )
      `,
      )
      .eq("id", artifactId)
      .single();

    if (
      artifactError ||
      !artifact
    ) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Artefatto non trovato.",
        },
        {
          status: 404,
        },
      );
    }

    const now =
      new Date().toISOString();

    if (input.action === "approve") {
      const { error } =
        await supabase
          .from(
            "automation_artifacts",
          )
          .update({
            status: "approved",
            approved_at: now,
            approved_by:
              input.actorId,
            rejected_at: null,
            rejected_by: null,
            decision_note:
              input.note || null,
          })
          .eq("id", artifactId);

      if (error) {
        throw new Error(
          error.message,
        );
      }
    }

    if (input.action === "reject") {
      const { error } =
        await supabase
          .from(
            "automation_artifacts",
          )
          .update({
            status: "rejected",
            rejected_at: now,
            rejected_by:
              input.actorId,
            approved_at: null,
            approved_by: null,
            decision_note:
              input.note || null,
          })
          .eq("id", artifactId);

      if (error) {
        throw new Error(
          error.message,
        );
      }
    }

    if (input.action === "restore") {
      const { error } =
        await supabase
          .from(
            "automation_artifacts",
          )
          .update({
            status: "draft",
            approved_at: null,
            approved_by: null,
            rejected_at: null,
            rejected_by: null,
            decision_note: null,
          })
          .eq("id", artifactId);

      if (error) {
        throw new Error(
          error.message,
        );
      }

      await supabase
        .from("execution_queue")
        .delete()
        .eq(
          "artifact_id",
          artifactId,
        );
    }

    if (input.action === "queue") {
      if (
        artifact.status !==
        "approved"
      ) {
        return NextResponse.json(
          {
            status: "blocked",
            error:
              "L’artefatto deve essere approvato prima di entrare in coda.",
          },
          {
            status: 409,
          },
        );
      }

      const idempotencyKey =
        `queue-${artifactId}`;

      const { error: queueError } =
        await supabase
          .from("execution_queue")
          .upsert(
            {
              artifact_id:
                artifactId,

              business_id:
                artifact.business_id,

              target_channel:
                artifact.channel,

              status: "blocked",

              external_execution_allowed:
                false,

              block_reason:
                "Integrazione esterna non ancora configurata o autorizzata.",

              idempotency_key:
                idempotencyKey,

              requested_by:
                input.actorId,
            },
            {
              onConflict:
                "artifact_id",
            },
          );

      if (queueError) {
        throw new Error(
          queueError.message,
        );
      }

      const { error } =
        await supabase
          .from(
            "automation_artifacts",
          )
          .update({
            status: "queued",
            decision_note:
              input.note || null,
          })
          .eq("id", artifactId);

      if (error) {
        throw new Error(
          error.message,
        );
      }
    }

    await writeAuditEvent({
      organisationId:
        artifact.businesses
          ?.organisation_id,

      businessId:
        artifact.business_id,

      actorType: "user",

      actorId:
        input.actorId,

      eventType:
        `artifact_${input.action}`,

      resourceType:
        "automation_artifact",

      resourceId:
        artifactId,

      action:
        `${input.action}: ${artifact.title}`,

      previousState: {
        status:
          artifact.status,
      },

      nextState: {
        action:
          input.action,
        note:
          input.note || null,
      },

      requestId,

      traceId:
        artifact.run_id,
    });

    return NextResponse.json({
      status: "completed",
      artifactId,
      action: input.action,
    });
  } catch (error) {
    console.error(
      "Artifact decision error:",
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

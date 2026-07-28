import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/core/database/supabase-admin";
import { writeAuditEvent } from "@/core/audit-log/logger";
import { generateMissionPlan } from "@/core/mission-planner/engine";

export const runtime = "nodejs";
export const maxDuration = 180;

const BodySchema = z.object({
  requestedBy: z
    .string()
    .trim()
    .min(2)
    .max(160)
    .default("workspace-owner"),

  idempotencyKey: z
    .string()
    .trim()
    .min(8)
    .max(220)
    .optional(),
});

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const startedAt = Date.now();

  try {
    const { id } = await context.params;

    const missionId =
      z.string().uuid().parse(id);

    const body = BodySchema.parse(
      await request.json(),
    );

    const idempotencyKey =
      body.idempotencyKey ||
      `mission-plan-${missionId}`;

    const supabase =
      getSupabaseAdmin();

    const {
      data: existingPlan,
      error: existingPlanError,
    } = await supabase
      .from("mission_plans")
      .select("*")
      .eq("mission_id", missionId)
      .maybeSingle();

    if (existingPlanError) {
      throw new Error(
        existingPlanError.message,
      );
    }

    if (existingPlan) {
      return NextResponse.json({
        status: existingPlan.status,
        cached: true,
        plan: existingPlan,
        message:
          "La missione possiede già un piano operativo.",
      });
    }

    const {
      data: mission,
      error: missionError,
    } = await supabase
      .from("missions")
      .select("*")
      .eq("id", missionId)
      .single();

    if (missionError || !mission) {
      return NextResponse.json(
        {
          status: "failed",
          error: "Missione non trovata.",
        },
        {
          status: 404,
        },
      );
    }

    if (mission.status !== "approved") {
      return NextResponse.json(
        {
          status: "blocked",
          error:
            `La missione deve essere approvata. Stato attuale: ${mission.status}.`,
        },
        {
          status: 409,
        },
      );
    }

    const [
      businessResult,
      memoryResult,
      nodesResult,
      evidenceResult,
      integrationsResult,
      automationsResult,
    ] = await Promise.all([
      supabase
        .from("businesses")
        .select("*")
        .eq("id", mission.business_id)
        .single(),

      supabase
        .from("business_memory_entries")
        .select("*")
        .eq("business_id", mission.business_id)
        .eq("is_current", true),

      supabase
        .from("knowledge_nodes")
        .select("*")
        .eq("business_id", mission.business_id),

      supabase
        .from("evidence_claims")
        .select("*")
        .eq("business_id", mission.business_id),

      supabase
        .from("integration_connections")
        .select(
          "provider, display_name, status, enabled, capabilities, granted_scopes",
        )
        .eq("business_id", mission.business_id),

      supabase
        .from("automation_blueprints")
        .select(
          "id, name, objective, status, risk_level",
        )
        .eq("business_id", mission.business_id),
    ]);

    const sourceError =
      businessResult.error ||
      memoryResult.error ||
      nodesResult.error ||
      evidenceResult.error ||
      integrationsResult.error ||
      automationsResult.error;

    if (sourceError) {
      throw new Error(
        sourceError.message,
      );
    }

    if (!businessResult.data) {
      return NextResponse.json(
        {
          status: "failed",
          error: "Azienda non trovata.",
        },
        {
          status: 404,
        },
      );
    }

    const output =
      await generateMissionPlan({
        business:
          businessResult.data,

        mission,

        businessMemory:
          memoryResult.data ?? [],

        knowledgeNodes:
          nodesResult.data ?? [],

        evidence:
          evidenceResult.data ?? [],

        integrations:
          integrationsResult.data ?? [],

        existingAutomations:
          automationsResult.data ?? [],
      });

    const {
      data: plan,
      error: planError,
    } = await supabase
      .from("mission_plans")
      .insert({
        organisation_id:
          businessResult.data
            .organisation_id,

        business_id:
          mission.business_id,

        mission_id:
          mission.id,

        idempotency_key:
          idempotencyKey,

        status:
          "awaiting_approval",

        executive_summary:
          output.executiveSummary,

        operating_model:
          output.operatingModel,

        phases:
          output.phases,

        required_inputs:
          output.requiredInputs,

        risks:
          output.risks,

        verification_checks:
          output.verificationChecks,

        expected_kpis:
          output.expectedKpis,

        limitations:
          output.limitations,

        confidence:
          output.confidence,
      })
      .select("*")
      .single();

    if (planError) {
      throw new Error(
        `Salvataggio piano fallito: ${planError.message}`,
      );
    }

    const blueprintRecords =
      output.automationBlueprints.map(
        (blueprint) => ({
          business_id:
            mission.business_id,

          name:
            blueprint.name,

          objective:
            blueprint.objective,

          status:
            blueprint.approvalRequired
              ? "awaiting_approval"
              : "ready",

          risk_level:
            blueprint.riskLevel,

          approval_required:
            blueprint.approvalRequired,

          trigger_definition:
            blueprint.trigger,

          action_definition:
            blueprint.actions,

          safeguards:
            blueprint.safeguards,

          created_by:
            "uviq-mission-planner",

          metadata: {
            missionId:
              mission.id,

            missionPlanId:
              plan.id,
          },
        }),
      );

    /*
      La tabella esistente potrebbe non avere una colonna metadata.
      Rimuoviamola prima dell'insert mantenendo missionId dentro safeguards.
    */
    const compatibleRecords =
      blueprintRecords.map(
        ({
          metadata,
          safeguards,
          ...record
        }) => ({
          ...record,

          safeguards: [
            ...safeguards,
            `Mission ID: ${metadata.missionId}`,
            `Mission Plan ID: ${metadata.missionPlanId}`,
          ],
        }),
      );

    const {
      data: blueprints,
      error: blueprintError,
    } = await supabase
      .from("automation_blueprints")
      .insert(compatibleRecords)
      .select("*");

    if (blueprintError) {
      throw new Error(
        `Creazione blueprint fallita: ${blueprintError.message}`,
      );
    }

    const approvalRecords = [
      {
        organisation_id:
          businessResult.data
            .organisation_id,

        business_id:
          mission.business_id,

        resource_type:
          "mission",

        resource_id:
          mission.id,

        action:
          `Approvare piano operativo della missione: ${mission.title}`,

        reason:
          output.executiveSummary,

        risk_level:
          mission.risk_level,

        status:
          "pending",

        requested_by:
          "uviq-mission-planner",

        assigned_role:
          [
            "high",
            "critical",
          ].includes(
            mission.risk_level,
          )
            ? "owner"
            : "manager",

        metadata: {
          missionPlanId:
            plan.id,

          approvalSubtype:
            "mission_plan",
        },
      },

      ...(blueprints ?? [])
        .filter(
          (blueprint) =>
            blueprint.approval_required,
        )
        .map((blueprint) => ({
          organisation_id:
            businessResult.data
              .organisation_id,

          business_id:
            mission.business_id,

          resource_type:
            "automation",

          resource_id:
            blueprint.id,

          action:
            `Approvare automazione: ${blueprint.name}`,

          reason:
            blueprint.objective,

          risk_level:
            blueprint.risk_level,

          status:
            "pending",

          requested_by:
            "uviq-mission-planner",

          assigned_role:
            [
              "high",
              "critical",
            ].includes(
              blueprint.risk_level,
            )
              ? "owner"
              : "manager",

          metadata: {
            missionId:
              mission.id,

            missionPlanId:
              plan.id,
          },
        })),
    ];

    const {
      error: approvalError,
    } = await supabase
      .from("approval_requests")
      .insert(approvalRecords);

    if (approvalError) {
      throw new Error(
        `Creazione approvazioni fallita: ${approvalError.message}`,
      );
    }

    await supabase
      .from("missions")
      .update({
        status:
          "awaiting_approval",

        result_summary:
          `Piano operativo ${plan.id} generato con ${blueprints?.length ?? 0} blueprint.`,
      })
      .eq("id", mission.id);

    await writeAuditEvent({
      organisationId:
        businessResult.data
          .organisation_id,

      businessId:
        mission.business_id,

      actorType: "agent",

      actorId:
        "uviq-mission-planner",

      eventType:
        "mission_plan_generated",

      resourceType:
        "mission_plan",

      resourceId:
        plan.id,

      action:
        "Generazione del piano operativo e dei blueprint di automazione.",

      nextState: {
        missionId:
          mission.id,

        planId:
          plan.id,

        blueprintCount:
          blueprints?.length ?? 0,

        approvalCount:
          approvalRecords.length,

        confidence:
          output.confidence,
      },

      requestId:
        idempotencyKey,

      traceId:
        plan.id,
    });

    return NextResponse.json(
      {
        status:
          "completed",

        cached:
          false,

        plan,

        blueprints:
          blueprints ?? [],

        approvalsCreated:
          approvalRecords.length,

        durationMs:
          Date.now() -
          startedAt,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Mission Planner error:",
      error,
    );

    if (error instanceof z.ZodError) {
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

        durationMs:
          Date.now() -
          startedAt,
      },
      {
        status: 500,
      },
    );
  }
}

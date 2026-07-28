import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/core/database/supabase-admin";
import { generateBusinessOpportunities } from "@/core/opportunities/engine";
import { writeAuditEvent } from "@/core/audit-log/logger";

export const runtime = "nodejs";
export const maxDuration = 180;

const BodySchema = z.object({
  businessId: z.string().uuid(),

  idempotencyKey: z
    .string()
    .trim()
    .min(8)
    .max(220)
    .optional(),
});

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const body = BodySchema.parse(
      await request.json(),
    );

    const idempotencyKey =
      body.idempotencyKey ||
      `opportunities-${body.businessId}-${crypto.randomUUID()}`;

    const supabase = getSupabaseAdmin();

    const { data: existingRun, error: existingRunError } =
      await supabase
        .from("opportunity_runs")
        .select("*")
        .eq("idempotency_key", idempotencyKey)
        .maybeSingle();

    if (existingRunError) {
      throw new Error(existingRunError.message);
    }

    if (existingRun) {
      return NextResponse.json({
        status: existingRun.status,
        cached: true,
        run: existingRun,
      });
    }

    const [
      businessResult,
      snapshotResult,
      nodesResult,
      edgesResult,
      evidenceResult,
      missionsResult,
      opportunitiesResult,
    ] = await Promise.all([
      supabase
        .from("businesses")
        .select("*")
        .eq("id", body.businessId)
        .single(),

      supabase
        .from("knowledge_graph_snapshots")
        .select("*")
        .eq("business_id", body.businessId)
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),

      supabase
        .from("knowledge_nodes")
        .select("*")
        .eq("business_id", body.businessId),

      supabase
        .from("knowledge_edges")
        .select("*")
        .eq("business_id", body.businessId),

      supabase
        .from("evidence_claims")
        .select("*")
        .eq("business_id", body.businessId),

      supabase
        .from("missions")
        .select("*")
        .eq("business_id", body.businessId),

      supabase
        .from("business_opportunities")
        .select("title, summary, opportunity_type, status")
        .eq("business_id", body.businessId)
        .neq("status", "archived"),
    ]);

    const error =
      businessResult.error ||
      snapshotResult.error ||
      nodesResult.error ||
      edgesResult.error ||
      evidenceResult.error ||
      missionsResult.error ||
      opportunitiesResult.error;

    if (error) {
      throw new Error(error.message);
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

    if (!snapshotResult.data || !nodesResult.data?.length) {
      return NextResponse.json(
        {
          status: "blocked",
          error:
            "Knowledge Graph assente. Ricostruisci prima il grafo aziendale.",
        },
        {
          status: 409,
        },
      );
    }

    const { data: run, error: runError } = await supabase
      .from("opportunity_runs")
      .insert({
        organisation_id:
          businessResult.data.organisation_id,

        business_id: body.businessId,

        snapshot_id: snapshotResult.data.id,

        idempotency_key: idempotencyKey,

        status: "analysing",

        input_payload: {
          nodeCount: nodesResult.data.length,
          edgeCount: edgesResult.data?.length ?? 0,
          evidenceCount: evidenceResult.data?.length ?? 0,
          missionCount: missionsResult.data?.length ?? 0,
        },

        started_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (runError) {
      throw new Error(runError.message);
    }

    try {
      const output =
        await generateBusinessOpportunities({
          business: businessResult.data,
          nodes: nodesResult.data ?? [],
          edges: edgesResult.data ?? [],
          evidence: evidenceResult.data ?? [],
          existingMissions: missionsResult.data ?? [],
          existingOpportunities:
            opportunitiesResult.data ?? [],
        });

      await supabase
        .from("opportunity_runs")
        .update({
          status: "persisting",
        })
        .eq("id", run.id);

      const records = output.opportunities.map(
        (opportunity) => ({
          organisation_id:
            businessResult.data.organisation_id,

          business_id: body.businessId,

          snapshot_id: snapshotResult.data.id,

          title: opportunity.title,
          summary: opportunity.summary,
          rationale: opportunity.rationale,

          opportunity_type:
            opportunity.opportunityType,

          priority: opportunity.priority,
          impact: opportunity.impact,
          effort: opportunity.effort,

          risk_level:
            opportunity.riskLevel,

          confidence:
            opportunity.confidence,

          estimated_cost_min:
            opportunity.estimatedCostMin,

          estimated_cost_max:
            opportunity.estimatedCostMax,

          estimated_time:
            opportunity.estimatedTime,

          supporting_node_ids:
            opportunity.supportingNodeIds,

          supporting_evidence_ids:
            opportunity.supportingEvidenceIds,

          missing_data:
            opportunity.missingData,

          proposed_actions:
            opportunity.proposedActions,

          expected_kpis:
            opportunity.expectedKpis,

          limitations:
            opportunity.limitations,
        }),
      );

      const { data: created, error: insertError } =
        await supabase
          .from("business_opportunities")
          .insert(records)
          .select("*");

      if (insertError) {
        throw new Error(insertError.message);
      }

      const finishedAt = new Date().toISOString();

      await supabase
        .from("opportunity_runs")
        .update({
          status: "completed",

          opportunity_count:
            created?.length ?? 0,

          output_payload: output,

          finished_at: finishedAt,
        })
        .eq("id", run.id);

      await writeAuditEvent({
        organisationId:
          businessResult.data.organisation_id,

        businessId: body.businessId,

        actorType: "agent",

        actorId:
          "uviq-opportunity-engine",

        eventType:
          "business_opportunities_generated",

        resourceType:
          "opportunity_run",

        resourceId: run.id,

        action:
          "Generazione di opportunità aziendali dal Knowledge Graph.",

        nextState: {
          opportunitiesCreated:
            created?.length ?? 0,

          analysisConfidence:
            output.analysisConfidence,

          globalMissingData:
            output.globalMissingData,
        },

        requestId: idempotencyKey,
        traceId: run.id,
      });

      return NextResponse.json(
        {
          status: "completed",
          runId: run.id,
          opportunities: created ?? [],
          analysis: output,
          durationMs: Date.now() - startedAt,
        },
        {
          status: 201,
        },
      );
    } catch (executionError) {
      await supabase
        .from("opportunity_runs")
        .update({
          status: "failed",

          error_message:
            executionError instanceof Error
              ? executionError.message
              : "Errore sconosciuto",

          finished_at:
            new Date().toISOString(),
        })
        .eq("id", run.id);

      throw executionError;
    }
  } catch (error) {
    console.error(
      "Opportunity Engine error:",
      error,
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "failed",
          error: "Dati non validi.",
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

        durationMs: Date.now() - startedAt,
      },
      {
        status: 500,
      },
    );
  }
}

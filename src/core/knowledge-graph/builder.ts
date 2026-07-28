import { getSupabaseAdmin } from "@/core/database/supabase-admin";
import { writeAuditEvent } from "@/core/audit-log/logger";
import type {
  KnowledgeEdgeInput,
  KnowledgeNodeInput,
} from "@/core/knowledge-graph/types";

type BuildResult = {
  snapshotId: string;
  nodeCount: number;
  edgeCount: number;
  sourceCounts: Record<string, number>;
};

function safeLabel(
  value: unknown,
  fallback: string,
): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim().slice(0, 240);
  }

  return fallback;
}

function memoryStatus(status: string): string {
  const valid = [
    "verified",
    "inferred",
    "missing",
    "archived",
  ];

  return valid.includes(status)
    ? status
    : "draft";
}

function graphStatus(status: unknown): string {
  const normalized =
    typeof status === "string"
      ? status.trim().toLowerCase()
      : "";

  const statusMap: Record<string, string> = {
    active: "active",
    connected: "active",
    enabled: "active",

    verified: "verified",

    inferred: "inferred",
    hypothesis: "inferred",
    conflicted: "inferred",

    missing: "missing",
    insufficient_data: "missing",

    approved: "approved",

    rejected: "rejected",

    completed: "completed",

    archived: "archived",
    cancelled: "archived",
    disabled: "archived",

    created: "draft",
    draft: "draft",
    ready: "draft",
    queued: "draft",
    collecting: "draft",
    analysing: "draft",
    validating: "draft",
    persisting: "draft",
    awaiting_approval: "draft",
    executing: "draft",
    running: "draft",
    measuring: "draft",
    optimising: "draft",
    paused: "draft",
    blocked: "draft",
    configuration_detected: "draft",
    not_configured: "draft",
    testing: "draft",
    degraded: "draft",
    error: "draft",
    failed: "draft",
  };

  return statusMap[normalized] ?? "draft";
}

async function upsertNode(
  input: KnowledgeNodeInput,
): Promise<string> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("knowledge_nodes")
    .upsert(
      {
        organisation_id:
          input.organisationId,

        business_id:
          input.businessId,

        node_type:
          input.nodeType,

        external_key:
          input.externalKey,

        label:
          input.label,

        description:
          input.description ?? null,

        status:
          input.status ?? "active",

        confidence:
          input.confidence ?? null,

        source_table:
          input.sourceTable ?? null,

        source_record_id:
          input.sourceRecordId ?? null,

        attributes:
          input.attributes ?? {},

        last_seen_at:
          new Date().toISOString(),
      },
      {
        onConflict:
          "business_id,node_type,external_key",
      },
    )
    .select("id")
    .single();

  if (error) {
    throw new Error(
      `Creazione nodo "${input.externalKey}" fallita: ${error.message}`,
    );
  }

  return data.id;
}

async function upsertEdge(
  input: KnowledgeEdgeInput,
): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("knowledge_edges")
    .upsert(
      {
        organisation_id:
          input.organisationId,

        business_id:
          input.businessId,

        source_node_id:
          input.sourceNodeId,

        target_node_id:
          input.targetNodeId,

        relation_type:
          input.relationType,

        confidence:
          input.confidence ?? 1,

        evidence:
          input.evidence ?? [],

        attributes:
          input.attributes ?? {},
      },
      {
        onConflict:
          "business_id,source_node_id,target_node_id,relation_type",
      },
    );

  if (error) {
    throw new Error(
      `Creazione relazione "${input.relationType}" fallita: ${error.message}`,
    );
  }
}

export async function buildKnowledgeGraph(
  businessId: string,
): Promise<BuildResult> {
  const supabase = getSupabaseAdmin();

  const {
    data: business,
    error: businessError,
  } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .single();

  if (businessError || !business) {
    throw new Error(
      "Azienda non trovata.",
    );
  }

  const {
    data: snapshot,
    error: snapshotError,
  } = await supabase
    .from("knowledge_graph_snapshots")
    .insert({
      organisation_id:
        business.organisation_id,

      business_id:
        businessId,

      status: "building",

      build_version:
        "1.0.0",
    })
    .select("id")
    .single();

  if (snapshotError) {
    throw new Error(
      snapshotError.message,
    );
  }

  try {
    const [
      memoryResult,
      evidenceResult,
      missionsResult,
      automationsResult,
      artifactsResult,
      integrationsResult,
    ] = await Promise.all([
      supabase
        .from("business_memory_entries")
        .select("*")
        .eq("business_id", businessId)
        .eq("is_current", true),

      supabase
        .from("evidence_claims")
        .select("*")
        .eq("business_id", businessId),

      supabase
        .from("missions")
        .select("*")
        .eq("business_id", businessId),

      supabase
        .from("automation_blueprints")
        .select("*")
        .eq("business_id", businessId),

      supabase
        .from("automation_artifacts")
        .select("*")
        .eq("business_id", businessId),

      supabase
        .from("integration_connections")
        .select("*")
        .eq("business_id", businessId),
    ]);

    const results = [
      memoryResult,
      evidenceResult,
      missionsResult,
      automationsResult,
      artifactsResult,
      integrationsResult,
    ];

    const failed =
      results.find(
        (result) => result.error,
      );

    if (failed?.error) {
      throw new Error(
        failed.error.message,
      );
    }

    const nodeIds =
      new Map<string, string>();

    const businessNodeId =
      await upsertNode({
        organisationId:
          business.organisation_id,

        businessId,

        nodeType: "business",

        externalKey:
          `business:${business.id}`,

        label:
          business.name,

        description:
          business.primary_goal,

        status:
          business.status === "active"
            ? "active"
            : "archived",

        confidence: 1,

        sourceTable:
          "businesses",

        sourceRecordId:
          business.id,

        attributes: {
          sector:
            business.sector,

          city:
            business.city,

          websiteUrl:
            business.website_url,

          lifecycleStage:
            business.lifecycle_stage,
        },
      });

    nodeIds.set(
      `business:${business.id}`,
      businessNodeId,
    );

    let edgeCount = 0;

    for (
      const entry of
      memoryResult.data ?? []
    ) {
      const key =
        `memory:${entry.id}`;

      const nodeId =
        await upsertNode({
          organisationId:
            business.organisation_id,

          businessId,

          nodeType: "memory",

          externalKey: key,

          label:
            `${entry.category} · ${entry.memory_key}`,

          description:
            JSON.stringify(
              entry.value,
            ).slice(0, 1200),

          status:
            memoryStatus(
              entry.status,
            ),

          confidence:
            Number(
              entry.confidence,
            ),

          sourceTable:
            "business_memory_entries",

          sourceRecordId:
            entry.id,

          attributes: {
            category:
              entry.category,

            memoryKey:
              entry.memory_key,

            value:
              entry.value,

            sourceType:
              entry.source_type,

            sourceReference:
              entry.source_reference,

            version:
              entry.version,
          },
        });

      nodeIds.set(key, nodeId);

      await upsertEdge({
        organisationId:
          business.organisation_id,

        businessId,

        sourceNodeId:
          businessNodeId,

        targetNodeId:
          nodeId,

        relationType:
          "has_memory",

        confidence:
          Number(
            entry.confidence,
          ),
      });

      edgeCount += 1;
    }

    for (
      const claim of
      evidenceResult.data ?? []
    ) {
      const key =
        `evidence:${claim.id}`;

      const nodeId =
        await upsertNode({
          organisationId:
            business.organisation_id,

          businessId,

          nodeType:
            "evidence",

          externalKey:
            key,

          label:
            safeLabel(
              claim.claim,
              "Evidenza",
            ),

          description:
            claim.verification_note,

          status:
            memoryStatus(
              claim.classification,
            ),

          confidence:
            Number(
              claim.confidence,
            ),

          sourceTable:
            "evidence_claims",

          sourceRecordId:
            claim.id,

          attributes: {
            classification:
              claim.classification,

            verificationMethod:
              claim.verification_method,

            conflictStatus:
              claim.conflict_status,
          },
        });

      nodeIds.set(key, nodeId);

      await upsertEdge({
        organisationId:
          business.organisation_id,

        businessId,

        sourceNodeId:
          businessNodeId,

        targetNodeId:
          nodeId,

        relationType:
          "supported_by",

        confidence:
          Number(
            claim.confidence,
          ),
      });

      edgeCount += 1;
    }

    for (
      const mission of
      missionsResult.data ?? []
    ) {
      const key =
        `mission:${mission.id}`;

      const nodeId =
        await upsertNode({
          organisationId:
            business.organisation_id,

          businessId,

          nodeType:
            "mission",

          externalKey:
            key,

          label:
            mission.title,

          description:
            mission.objective,

          status:
            graphStatus(
              mission.status,
            ),

          sourceTable:
            "missions",

          sourceRecordId:
            mission.id,

          attributes: {
            priority:
              mission.priority,

            impact:
              mission.impact,

            effort:
              mission.effort,

            riskLevel:
              mission.risk_level,

            ownerAgent:
              mission.owner_agent,

            kpis:
              mission.kpis,
          },
        });

      nodeIds.set(key, nodeId);

      await upsertEdge({
        organisationId:
          business.organisation_id,

        businessId,

        sourceNodeId:
          businessNodeId,

        targetNodeId:
          nodeId,

        relationType:
          "generates",
      });

      edgeCount += 1;
    }

    for (
      const automation of
      automationsResult.data ?? []
    ) {
      const key =
        `automation:${automation.id}`;

      const nodeId =
        await upsertNode({
          organisationId:
            business.organisation_id,

          businessId,

          nodeType:
            "automation",

          externalKey:
            key,

          label:
            automation.name,

          description:
            automation.objective,

          status:
            graphStatus(
              automation.status,
            ),

          sourceTable:
            "automation_blueprints",

          sourceRecordId:
            automation.id,

          attributes: {
            riskLevel:
              automation.risk_level,

            approvalRequired:
              automation.approval_required,

            trigger:
              automation.trigger_definition,

            actions:
              automation.action_definition,

            safeguards:
              automation.safeguards,
          },
        });

      nodeIds.set(key, nodeId);

      await upsertEdge({
        organisationId:
          business.organisation_id,

        businessId,

        sourceNodeId:
          businessNodeId,

        targetNodeId:
          nodeId,

        relationType:
          "generates",
      });

      edgeCount += 1;
    }

    for (
      const artifact of
      artifactsResult.data ?? []
    ) {
      const key =
        `artifact:${artifact.id}`;

      const nodeId =
        await upsertNode({
          organisationId:
            business.organisation_id,

          businessId,

          nodeType:
            "artifact",

          externalKey:
            key,

          label:
            artifact.title,

          description:
            artifact.description,

          status:
            graphStatus(
              artifact.status,
            ),

          sourceTable:
            "automation_artifacts",

          sourceRecordId:
            artifact.id,

          attributes: {
            artifactType:
              artifact.artifact_type,

            channel:
              artifact.channel,

            externalExecutionBlocked:
              artifact.external_execution_blocked,

            approvalRequired:
              artifact.approval_required,
          },
        });

      nodeIds.set(key, nodeId);

      const automationNodeId =
        nodeIds.get(
          `automation:${artifact.automation_id}`,
        );

      if (automationNodeId) {
        await upsertEdge({
          organisationId:
            business.organisation_id,

          businessId,

          sourceNodeId:
            automationNodeId,

          targetNodeId:
            nodeId,

          relationType:
            "produces",
        });

        edgeCount += 1;
      }
    }

    for (
      const integration of
      integrationsResult.data ?? []
    ) {
      const key =
        `integration:${integration.id}`;

      const nodeId =
        await upsertNode({
          organisationId:
            business.organisation_id,

          businessId,

          nodeType:
            "integration",

          externalKey:
            key,

          label:
            integration.display_name,

          description:
            `Provider ${integration.provider}`,

          status:
            graphStatus(
              integration.status,
            ),

          sourceTable:
            "integration_connections",

          sourceRecordId:
            integration.id,

          attributes: {
            provider:
              integration.provider,

            connectionStatus:
              integration.status,

            capabilities:
              integration.capabilities,

            grantedScopes:
              integration.granted_scopes,

            enabled:
              integration.enabled,
          },
        });

      nodeIds.set(key, nodeId);

      await upsertEdge({
        organisationId:
          business.organisation_id,

        businessId,

        sourceNodeId:
          businessNodeId,

        targetNodeId:
          nodeId,

        relationType:
          "connected_to",
      });

      edgeCount += 1;
    }

    const {
      count: nodeCount,
      error: nodeCountError,
    } = await supabase
      .from("knowledge_nodes")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("business_id", businessId);

    if (nodeCountError) {
      throw new Error(
        nodeCountError.message,
      );
    }

    const {
      count: storedEdgeCount,
      error: edgeCountError,
    } = await supabase
      .from("knowledge_edges")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("business_id", businessId);

    if (edgeCountError) {
      throw new Error(
        edgeCountError.message,
      );
    }

    const sourceCounts = {
      memory:
        memoryResult.data?.length ?? 0,

      evidence:
        evidenceResult.data?.length ?? 0,

      missions:
        missionsResult.data?.length ?? 0,

      automations:
        automationsResult.data?.length ?? 0,

      artifacts:
        artifactsResult.data?.length ?? 0,

      integrations:
        integrationsResult.data?.length ?? 0,
    };

    await supabase
      .from("knowledge_graph_snapshots")
      .update({
        status: "completed",

        node_count:
          nodeCount ?? 0,

        edge_count:
          storedEdgeCount ?? edgeCount,

        source_counts:
          sourceCounts,

        finished_at:
          new Date().toISOString(),
      })
      .eq("id", snapshot.id);

    await writeAuditEvent({
      organisationId:
        business.organisation_id,

      businessId,

      actorType: "system",

      actorId:
        "uviq-knowledge-graph",

      eventType:
        "knowledge_graph_built",

      resourceType:
        "knowledge_graph_snapshot",

      resourceId:
        snapshot.id,

      action:
        "Ricostruzione deterministica del Knowledge Graph aziendale.",

      nextState: {
        nodeCount:
          nodeCount ?? 0,

        edgeCount:
          storedEdgeCount ?? edgeCount,

        sourceCounts,
      },

      traceId:
        snapshot.id,
    });

    return {
      snapshotId:
        snapshot.id,

      nodeCount:
        nodeCount ?? 0,

      edgeCount:
        storedEdgeCount ?? edgeCount,

      sourceCounts,
    };
  } catch (error) {
    await supabase
      .from("knowledge_graph_snapshots")
      .update({
        status: "failed",

        error_message:
          error instanceof Error
            ? error.message
            : "Errore sconosciuto",

        finished_at:
          new Date().toISOString(),
      })
      .eq("id", snapshot.id);

    throw error;
  }
}

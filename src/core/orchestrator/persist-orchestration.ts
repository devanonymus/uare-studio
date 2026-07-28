import type { SupabaseClient } from "@supabase/supabase-js";
import type { UviqOrchestratorResult } from "@/ai/orchestrator/orchestrator-schema";
import { SupabaseBusinessMemoryRepository } from "@/core/business-memory/supabase-repository";
import { getSupabaseAdmin } from "@/core/database/supabase-admin";
import { writeAuditEvent } from "@/core/audit-log/logger";

type PersistInput = {
  organisationId: string;
  businessId: string;
  idempotencyKey: string;
  result: UviqOrchestratorResult;
  inputPayload: Record<string, unknown>;
};

type PersistedOrchestration = {
  runId: string;
  memoryEntriesCreated: number;
  evidenceSourcesCreated: number;
  evidenceClaimsCreated: number;
  missionsCreated: number;
  automationsCreated: number;
  approvalsCreated: number;
};

function mapEvidenceClassification(
  classification:
    | "verified_fact"
    | "inference"
    | "hypothesis"
    | "missing_data",
) {
  const mapping = {
    verified_fact: "verified",
    inference: "inferred",
    hypothesis: "hypothesis",
    missing_data: "missing",
  } as const;

  return mapping[classification];
}

function mapSourceType(sourceId: string) {
  const normalized = sourceId.toLowerCase();

  if (normalized.includes("website")) {
    return "website";
  }

  if (
    normalized.includes("web-search") ||
    normalized.includes("public-web")
  ) {
    return "web_search";
  }

  if (
    normalized.includes("user") ||
    normalized.includes("discovery")
  ) {
    return "user_input";
  }

  if (normalized.includes("document")) {
    return "document";
  }

  if (normalized.includes("image")) {
    return "image";
  }

  if (normalized.includes("video")) {
    return "video";
  }

  if (normalized.includes("analytics")) {
    return "analytics";
  }

  if (normalized.includes("search-console")) {
    return "search_console";
  }

  if (normalized.includes("meta")) {
    return "meta";
  }

  if (normalized.includes("crm")) {
    return "crm";
  }

  return "other";
}

async function updateRun(
  supabase: SupabaseClient,
  runId: string,
  patch: Record<string, unknown>,
) {
  const { error } = await supabase
    .from("orchestration_runs")
    .update(patch)
    .eq("id", runId);

  if (error) {
    throw new Error(
      `Aggiornamento orchestration run fallito: ${error.message}`,
    );
  }
}

async function createRun(
  supabase: SupabaseClient,
  input: PersistInput,
) {
  const { data, error } = await supabase
    .from("orchestration_runs")
    .insert({
      organisation_id: input.organisationId,
      business_id: input.businessId,
      idempotency_key: input.idempotencyKey,
      status: "persisting",
      input_payload: input.inputPayload,
      started_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (!error) {
    return {
      run: data,
      alreadyExists: false,
    };
  }

  if (error.code !== "23505") {
    throw new Error(
      `Creazione orchestration run fallita: ${error.message}`,
    );
  }

  const { data: existing, error: existingError } =
    await supabase
      .from("orchestration_runs")
      .select("*")
      .eq("idempotency_key", input.idempotencyKey)
      .single();

  if (existingError) {
    throw new Error(
      `Recupero orchestration run esistente fallito: ${existingError.message}`,
    );
  }

  return {
    run: existing,
    alreadyExists: true,
  };
}

export async function persistOrchestration(
  input: PersistInput,
): Promise<{
  persisted: PersistedOrchestration;
  alreadyExists: boolean;
  previousOutput?: unknown;
}> {
  const supabase = getSupabaseAdmin();

  const { run, alreadyExists } =
    await createRun(supabase, input);

  if (
    alreadyExists &&
    run.status === "completed"
  ) {
    return {
      alreadyExists: true,
      previousOutput: run.output_payload,
      persisted: {
        runId: run.id,
        memoryEntriesCreated: 0,
        evidenceSourcesCreated: 0,
        evidenceClaimsCreated:
          run.evidence_count ?? 0,
        missionsCreated:
          run.mission_count ?? 0,
        automationsCreated:
          run.automation_count ?? 0,
        approvalsCreated:
          run.approval_count ?? 0,
      },
    };
  }

  if (alreadyExists) {
    throw new Error(
      `Esiste già un’esecuzione con stato "${run.status}" per questa chiave di idempotenza.`,
    );
  }

  const repository =
    new SupabaseBusinessMemoryRepository();

  let memoryEntriesCreated = 0;
  let evidenceSourcesCreated = 0;
  let evidenceClaimsCreated = 0;
  let missionsCreated = 0;
  let automationsCreated = 0;
  let approvalsCreated = 0;

  try {
    const memorySections = [
      {
        category: "identity",
        memoryKey: "business_identity",
        value: input.result.businessMemory.identity,
      },
      {
        category: "positioning",
        memoryKey: "strategic_positioning",
        value: input.result.businessMemory.positioning,
      },
      {
        category: "audiences",
        memoryKey: "target_audiences",
        value: input.result.businessMemory.audiences,
      },
      {
        category: "goals",
        memoryKey: "business_goals",
        value: input.result.businessMemory.goals,
      },
      {
        category: "channels",
        memoryKey: "marketing_channels",
        value: input.result.businessMemory.channels,
      },
      {
        category: "offers",
        memoryKey: "commercial_offers",
        value: input.result.businessMemory.offers,
      },
      {
        category: "brand",
        memoryKey: "brand_profile",
        value: input.result.businessMemory.brand,
      },
      {
        category: "constraints",
        memoryKey: "operational_constraints",
        value: input.result.businessMemory.constraints,
      },
      {
        category: "unknowns",
        memoryKey: "missing_information",
        value: input.result.businessMemory.unknowns,
      },
      {
        category: "strategy",
        memoryKey: "latest_strategic_diagnosis",
        value: {
          executiveSummary:
            input.result.executiveSummary,
          strategicDiagnosis:
            input.result.strategicDiagnosis,
          mainCommercialGap:
            input.result.mainCommercialGap,
          immediateDecisions:
            input.result.immediateDecisions,
          limitations:
            input.result.limitations,
          generatedAt:
            input.result.generatedAt,
          aiRunId:
            input.result.runId,
        },
      },
    ];

    for (const section of memorySections) {
      await repository.addMemoryEntry({
        businessId: input.businessId,
        category: section.category,
        memoryKey: section.memoryKey,
        value: section.value,
        status: "inferred",
        confidence: input.result.confidence,
        sourceType: "ai_inference",
        sourceReference: input.result.runId,
        createdBy: "uviq-orchestrator",
      });

      memoryEntriesCreated += 1;
    }

    const uniqueSourceIds = Array.from(
      new Set(
        input.result.evidence.flatMap(
          (claim) => claim.sourceIds,
        ),
      ),
    );

    const sourceDatabaseIds =
      new Map<string, string>();

    for (const sourceId of uniqueSourceIds) {
      const { data, error } = await supabase
        .from("evidence_sources")
        .insert({
          business_id: input.businessId,
          source_type: mapSourceType(sourceId),
          name: sourceId,
          retrieval_status:
            sourceId.startsWith("missing-")
              ? "unavailable"
              : "available",
          trust_score:
            sourceId.startsWith("missing-")
              ? 0
              : 0.6,
          metadata: {
            orchestratorRunId:
              input.result.runId,
          },
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(
          `Creazione fonte "${sourceId}" fallita: ${error.message}`,
        );
      }

      sourceDatabaseIds.set(
        sourceId,
        data.id,
      );

      evidenceSourcesCreated += 1;
    }

    const claimDatabaseIds =
      new Map<string, string>();

    for (const claim of input.result.evidence) {
      const classification =
        mapEvidenceClassification(
          claim.classification,
        );

      const { data, error } = await supabase
        .from("evidence_claims")
        .insert({
          business_id: input.businessId,
          claim: claim.claim,
          classification,
          confidence: claim.confidence,
          verification_note:
            claim.verificationNote,
          conflict_status: "none",
          verification_method:
            claim.sourceIds.length >= 2
              ? "multi_source"
              : claim.sourceIds.length === 1
                ? "single_source"
                : "ai_review",
          verified_by:
            claim.classification ===
            "verified_fact"
              ? "uviq-evidence-firewall"
              : null,
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(
          `Creazione evidenza "${claim.id}" fallita: ${error.message}`,
        );
      }

      claimDatabaseIds.set(
        claim.id,
        data.id,
      );

      evidenceClaimsCreated += 1;

      const links = claim.sourceIds
        .map((sourceId) => {
          const sourceDatabaseId =
            sourceDatabaseIds.get(sourceId);

          if (!sourceDatabaseId) {
            return null;
          }

          return {
            claim_id: data.id,
            source_id: sourceDatabaseId,
            relevance_score: 1,
          };
        })
        .filter(
          (
            link,
          ): link is {
            claim_id: string;
            source_id: string;
            relevance_score: number;
          } => Boolean(link),
        );

      if (links.length > 0) {
        const { error: linksError } =
          await supabase
            .from("evidence_claim_sources")
            .insert(links);

        if (linksError) {
          throw new Error(
            `Collegamento fonti/evidenze fallito: ${linksError.message}`,
          );
        }
      }
    }

    for (const mission of input.result.missions) {
      const evidenceClaimIds =
        mission.supportingEvidenceIds
          .map((claimId) =>
            claimDatabaseIds.get(claimId),
          )
          .filter(
            (claimId): claimId is string =>
              Boolean(claimId),
          );

      const { data, error } = await supabase
        .from("missions")
        .insert({
          business_id: input.businessId,
          title: mission.title,
          objective: mission.objective,
          rationale: mission.rationale,
          status: mission.approvalRequired
            ? "awaiting_approval"
            : "ready",
          priority: mission.priority,
          impact: mission.impact,
          effort: mission.effort,
          risk_level: mission.riskLevel,
          owner_agent: mission.ownerAgent,
          approval_required:
            mission.approvalRequired,
          dependencies:
            mission.dependencies,
          kpis: mission.kpis,
          evidence_claim_ids:
            evidenceClaimIds,
          created_by:
            "uviq-orchestrator",
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(
          `Creazione missione "${mission.title}" fallita: ${error.message}`,
        );
      }

      missionsCreated += 1;

      if (mission.approvalRequired) {
        const { error: approvalError } =
          await supabase
            .from("approval_requests")
            .insert({
              organisation_id:
                input.organisationId,
              business_id:
                input.businessId,
              resource_type: "mission",
              resource_id: data.id,
              action:
                `Approvare missione: ${mission.title}`,
              reason: mission.rationale,
              risk_level:
                mission.riskLevel,
              status: "pending",
              requested_by:
                "uviq-orchestrator",
              assigned_role:
                mission.riskLevel ===
                  "high"
                  ? "owner"
                  : "manager",
              metadata: {
                orchestratorRunId:
                  input.result.runId,
              },
            });

        if (approvalError) {
          throw new Error(
            `Richiesta approvazione missione fallita: ${approvalError.message}`,
          );
        }

        approvalsCreated += 1;
      }
    }

    for (
      const automation of
      input.result.automationProposals
    ) {
      const { data, error } = await supabase
        .from("automation_blueprints")
        .insert({
          business_id: input.businessId,
          name: automation.name,
          objective: automation.objective,
          status:
            automation.approvalRequired
              ? "awaiting_approval"
              : "ready",
          risk_level:
            automation.riskLevel,
          approval_required:
            automation.approvalRequired,
          trigger_definition:
            automation.trigger,
          action_definition:
            automation.actions,
          safeguards:
            automation.safeguards,
          created_by:
            "uviq-automation-architect",
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(
          `Creazione automazione "${automation.name}" fallita: ${error.message}`,
        );
      }

      automationsCreated += 1;

      if (automation.approvalRequired) {
        const { error: approvalError } =
          await supabase
            .from("approval_requests")
            .insert({
              organisation_id:
                input.organisationId,
              business_id:
                input.businessId,
              resource_type:
                "automation",
              resource_id: data.id,
              action:
                `Approvare automazione: ${automation.name}`,
              reason:
                automation.objective,
              risk_level:
                automation.riskLevel,
              status: "pending",
              requested_by:
                "uviq-automation-architect",
              assigned_role:
                automation.riskLevel ===
                  "high"
                  ? "owner"
                  : "manager",
              metadata: {
                orchestratorRunId:
                  input.result.runId,
              },
            });

        if (approvalError) {
          throw new Error(
            `Richiesta approvazione automazione fallita: ${approvalError.message}`,
          );
        }

        approvalsCreated += 1;
      }
    }

    const outputPayload = {
      orchestratorResult: input.result,
      persistence: {
        memoryEntriesCreated,
        evidenceSourcesCreated,
        evidenceClaimsCreated,
        missionsCreated,
        automationsCreated,
        approvalsCreated,
      },
    };

    await updateRun(
      supabase,
      run.id,
      {
        status: "completed",
        output_payload: outputPayload,
        confidence:
          input.result.confidence,
        mission_count:
          missionsCreated,
        automation_count:
          automationsCreated,
        evidence_count:
          evidenceClaimsCreated,
        approval_count:
          approvalsCreated,
        finished_at:
          new Date().toISOString(),
      },
    );

    await writeAuditEvent({
      organisationId:
        input.organisationId,
      businessId: input.businessId,
      actorType: "agent",
      actorId: "uviq-orchestrator",
      eventType:
        "orchestration_completed",
      resourceType:
        "orchestration_run",
      resourceId: run.id,
      action:
        "Persistenza di Business Memory, evidenze, missioni, automazioni e approvazioni.",
      nextState: {
        memoryEntriesCreated,
        evidenceSourcesCreated,
        evidenceClaimsCreated,
        missionsCreated,
        automationsCreated,
        approvalsCreated,
      },
      evidence:
        input.result.evidence.map(
          (claim) => ({
            id: claim.id,
            classification:
              claim.classification,
            confidence:
              claim.confidence,
          }),
        ),
      requestId:
        input.idempotencyKey,
      traceId:
        input.result.runId,
    });

    return {
      alreadyExists: false,
      persisted: {
        runId: run.id,
        memoryEntriesCreated,
        evidenceSourcesCreated,
        evidenceClaimsCreated,
        missionsCreated,
        automationsCreated,
        approvalsCreated,
      },
    };
  } catch (error) {
    await updateRun(
      supabase,
      run.id,
      {
        status: "failed",
        error_code:
          "PERSISTENCE_FAILED",
        error_message:
          error instanceof Error
            ? error.message
            : "Errore sconosciuto",
        finished_at:
          new Date().toISOString(),
      },
    );

    throw error;
  }
}

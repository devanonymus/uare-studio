import type {
  MissingInformation,
  StrategicAlert,
  StrategicBrief,
  StrategicMetrics,
  StrategicPriority,
  StrategicRecommendation,
} from "./types";

type DatabaseRecord = Record<
  string,
  unknown
>;

export type StrategicAdvisorInput = {
  business: DatabaseRecord;
  opportunities: DatabaseRecord[];
  missions: DatabaseRecord[];
  missionPlans: DatabaseRecord[];
  approvals: DatabaseRecord[];
  automationBlueprints: DatabaseRecord[];
  automationRuns: DatabaseRecord[];
  automationArtifacts: DatabaseRecord[];
  integrations: DatabaseRecord[];
  memoryEntries: DatabaseRecord[];
  graphSnapshots: DatabaseRecord[];
  knowledgeNodes: DatabaseRecord[];
  knowledgeEdges: DatabaseRecord[];
};

function text(
  value: unknown,
  fallback = "",
): string {
  return typeof value === "string"
    ? value
    : fallback;
}

function numberValue(
  value: unknown,
  fallback = 0,
): number {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

function isOneOf(
  value: unknown,
  allowed: string[],
): boolean {
  return allowed.includes(
    text(value).toLowerCase(),
  );
}

function dateOnly(): string {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

function calculateMetrics(
  input: StrategicAdvisorInput,
): StrategicMetrics {
  return {
    opportunitiesOpen:
      input.opportunities.filter(
        (item) =>
          !isOneOf(item.status, [
            "rejected",
            "dismissed",
            "completed",
            "archived",
          ]),
      ).length,

    missionsActive:
      input.missions.filter(
        (item) =>
          !isOneOf(item.status, [
            "completed",
            "rejected",
            "cancelled",
            "archived",
          ]),
      ).length,

    plansAwaitingApproval:
      input.missionPlans.filter(
        (item) =>
          text(item.status) ===
          "awaiting_approval",
      ).length,

    approvalsPending:
      input.approvals.filter(
        (item) =>
          text(item.status) ===
          "pending",
      ).length,

    automationsReady:
      input.automationBlueprints.filter(
        (item) =>
          isOneOf(item.status, [
            "ready",
            "approved",
          ]),
      ).length,

    automationsCompleted:
      input.automationRuns.filter(
        (item) =>
          text(item.status) ===
          "completed",
      ).length,

    artifactsProduced:
      input.automationArtifacts.length,

    integrationsConnected:
      input.integrations.filter(
        (item) =>
          isOneOf(item.status, [
            "connected",
            "active",
            "verified",
          ]),
      ).length,

    integrationsTotal:
      input.integrations.length,

    memoryEntries:
      input.memoryEntries.length,

    knowledgeNodes:
      input.knowledgeNodes.length,

    knowledgeEdges:
      input.knowledgeEdges.length,
  };
}

function buildPriorities(
  input: StrategicAdvisorInput,
): StrategicPriority[] {
  const priorities: StrategicPriority[] =
    [];

  const pendingApprovals =
    input.approvals.filter(
      (item) =>
        text(item.status) ===
        "pending",
    );

  for (
    const approval of
      pendingApprovals.slice(0, 3)
  ) {
    priorities.push({
      rank: 0,

      title:
        text(approval.action) ||
        "Revisionare una richiesta di approvazione",

      reason:
        text(approval.reason) ||
        "Una decisione umana sta bloccando il flusso operativo.",

      action:
        "Aprire il centro approvazioni e registrare una decisione.",

      sourceType: "approval",

      sourceId:
        text(approval.id) || null,

      urgency:
        isOneOf(
          approval.risk_level,
          ["critical", "high"],
        )
          ? "critical"
          : "high",

      impact: "high",
      requiresApproval: true,
    });
  }

  const waitingPlans =
    input.missionPlans.filter(
      (item) =>
        text(item.status) ===
        "awaiting_approval",
    );

  for (
    const plan of waitingPlans.slice(0, 3)
  ) {
    priorities.push({
      rank: 0,

      title:
        "Revisionare un piano operativo",

      reason:
        text(plan.executive_summary) ||
        "Il Mission Planner ha generato un piano in attesa di revisione.",

      action:
        "Controllare fasi, rischi, KPI e input richiesti prima dell’approvazione.",

      sourceType: "mission_plan",

      sourceId:
        text(plan.id) || null,

      urgency: "high",
      impact: "high",
      requiresApproval: true,
    });
  }

  const opportunities =
    [...input.opportunities]
      .filter(
        (item) =>
          !isOneOf(item.status, [
            "rejected",
            "dismissed",
            "completed",
            "archived",
          ]),
      )
      .sort(
        (a, b) =>
          numberValue(
            a.priority,
            99,
          ) -
          numberValue(
            b.priority,
            99,
          ),
      );

  for (
    const opportunity of
      opportunities.slice(0, 4)
  ) {
    priorities.push({
      rank: 0,

      title:
        text(opportunity.title) ||
        "Valutare opportunità strategica",

      reason:
        text(
          opportunity.rationale,
        ) ||
        text(
          opportunity.description,
        ) ||
        "Il motore opportunità ha individuato una possibilità di miglioramento.",

      action:
        "Valutare l’opportunità e convertirla in missione se coerente con gli obiettivi aziendali.",

      sourceType: "opportunity",

      sourceId:
        text(opportunity.id) || null,

      urgency:
        numberValue(
          opportunity.priority,
          5,
        ) <= 2
          ? "high"
          : "medium",

      impact:
        text(
          opportunity.impact,
        ) === "high"
          ? "high"
          : "medium",

      requiresApproval: true,
    });
  }

  const approvedMissions =
    input.missions.filter(
      (item) =>
        text(item.status) ===
        "approved",
    );

  for (
    const mission of
      approvedMissions.slice(0, 3)
  ) {
    const hasPlan =
      input.missionPlans.some(
        (plan) =>
          text(plan.mission_id) ===
          text(mission.id),
      );

    if (!hasPlan) {
      priorities.push({
        rank: 0,

        title:
          text(mission.title) ||
          "Pianificare missione approvata",

        reason:
          "La missione è stata approvata ma non dispone ancora di un piano operativo.",

        action:
          "Eseguire il Mission Planner e sottoporre il piano alla revisione umana.",

        sourceType: "mission",

        sourceId:
          text(mission.id) || null,

        urgency: "medium",
        impact: "high",
        requiresApproval: false,
      });
    }
  }

  if (
    input.integrations.length > 0 &&
    input.integrations.every(
      (item) =>
        !isOneOf(item.status, [
          "connected",
          "active",
          "verified",
        ]),
    )
  ) {
    priorities.push({
      rank: 0,

      title:
        "Connettere almeno una fonte dati esterna",

      reason:
        "Le analisi risultano limitate perché nessuna integrazione è attiva.",

      action:
        "Aprire Integration Hub e verificare la prima integrazione prioritaria.",

      sourceType: "integration",
      sourceId: null,
      urgency: "medium",
      impact: "high",
      requiresApproval: true,
    });
  }

  const urgencyScore = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const impactScore = {
    high: 3,
    medium: 2,
    low: 1,
  };

  return priorities
    .sort(
      (a, b) =>
        urgencyScore[b.urgency] *
          10 +
        impactScore[b.impact] -
        (urgencyScore[a.urgency] *
          10 +
          impactScore[a.impact]),
    )
    .slice(0, 7)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
}

function buildAlerts(
  input: StrategicAdvisorInput,
  metrics: StrategicMetrics,
): StrategicAlert[] {
  const alerts: StrategicAlert[] = [];

  const criticalApprovals =
    input.approvals.filter(
      (item) =>
        text(item.status) ===
          "pending" &&
        isOneOf(item.risk_level, [
          "critical",
          "high",
        ]),
    );

  if (criticalApprovals.length > 0) {
    alerts.push({
      level: "critical",

      title:
        `${criticalApprovals.length} approvazioni ad alta priorità`,

      description:
        "Una o più attività importanti sono ferme in attesa di una decisione umana.",

      sourceType: "approval",
      sourceId: null,
    });
  }

  if (
    metrics.integrationsTotal > 0 &&
    metrics.integrationsConnected === 0
  ) {
    alerts.push({
      level: "warning",

      title:
        "Nessuna integrazione attiva",

      description:
        "Il sistema può analizzare soltanto le informazioni già presenti internamente.",

      sourceType: "integration",
      sourceId: null,
    });
  }

  if (
    metrics.knowledgeNodes === 0
  ) {
    alerts.push({
      level: "warning",

      title:
        "Knowledge Graph vuoto",

      description:
        "Rigenerare il Knowledge Graph prima di prendere decisioni strategiche.",

      sourceType:
        "knowledge_graph",

      sourceId: null,
    });
  }

  if (
    metrics.opportunitiesOpen === 0
  ) {
    alerts.push({
      level: "information",

      title:
        "Nessuna opportunità aperta",

      description:
        "Valutare una nuova esecuzione dell’Opportunity Engine dopo aver aggiornato i dati aziendali.",

      sourceType: "opportunity",
      sourceId: null,
    });
  }

  if (
    metrics.plansAwaitingApproval > 0
  ) {
    alerts.push({
      level: "warning",

      title:
        `${metrics.plansAwaitingApproval} piani in attesa`,

      description:
        "Le strategie non possono avanzare finché i piani operativi non vengono revisionati.",

      sourceType: "mission_plan",
      sourceId: null,
    });
  }

  return alerts.slice(0, 6);
}

function buildMissingInformation(
  input: StrategicAdvisorInput,
): MissingInformation[] {
  const missing: MissingInformation[] =
    [];

  if (
    !text(
      input.business.primary_goal,
    )
  ) {
    missing.push({
      field:
        "Obiettivo aziendale principale",

      reason:
        "Il sistema non dispone di un obiettivo strategico esplicito.",

      consequence:
        "Priorità e opportunità possono risultare meno allineate.",
    });
  }

  if (
    !text(input.business.city)
  ) {
    missing.push({
      field:
        "Area geografica operativa",

      reason:
        "La città o il mercato territoriale non risultano definiti.",

      consequence:
        "Le analisi locali e competitive possono essere incomplete.",
    });
  }

  if (
    input.memoryEntries.length < 5
  ) {
    missing.push({
      field:
        "Business Memory",

      reason:
        "Sono presenti poche informazioni persistenti sull’azienda.",

      consequence:
        "Il sistema dispone di un contesto ridotto per prendere decisioni.",
    });
  }

  if (
    input.integrations.length === 0
  ) {
    missing.push({
      field:
        "Fonti dati collegate",

      reason:
        "Non risultano integrazioni configurate.",

      consequence:
        "KPI, campagne, recensioni e dati commerciali non possono essere verificati automaticamente.",
    });
  }

  return missing;
}

function buildRecommendations(
  metrics: StrategicMetrics,
  missing: MissingInformation[],
): StrategicRecommendation[] {
  const recommendations: StrategicRecommendation[] =
    [];

  if (
    metrics.approvalsPending > 0
  ) {
    recommendations.push({
      title:
        "Ridurre il collo di bottiglia decisionale",

      rationale:
        "Le approvazioni pendenti impediscono alle missioni di avanzare.",

      expectedOutcome:
        "Maggiore velocità operativa senza rinunciare al controllo umano.",

      nextStep:
        "Revisionare prima le richieste con rischio alto o impatto elevato.",
    });
  }

  if (
    metrics.opportunitiesOpen > 0
  ) {
    recommendations.push({
      title:
        "Concentrare le risorse sulle opportunità migliori",

      rationale:
        "Sono presenti opportunità che non sono ancora diventate missioni operative.",

      expectedOutcome:
        "Trasformazione più rapida delle analisi in azioni misurabili.",

      nextStep:
        "Convertire una sola opportunità prioritaria e verificarne il risultato.",
    });
  }

  if (
    metrics.automationsReady > 0
  ) {
    recommendations.push({
      title:
        "Portare in sandbox le automazioni pronte",

      rationale:
        "Sono disponibili blueprint che possono essere verificati senza effetti esterni.",

      expectedOutcome:
        "Riduzione del rischio prima dell’esecuzione reale.",

      nextStep:
        "Eseguire una simulazione e controllare gli artefatti generati.",
    });
  }

  if (missing.length > 0) {
    recommendations.push({
      title:
        "Completare i dati mancanti",

      rationale:
        "Alcune decisioni sono basate su un quadro informativo incompleto.",

      expectedOutcome:
        "Aumento dell’affidabilità delle analisi e della qualità delle priorità.",

      nextStep:
        `Completare per primo: ${missing[0].field}.`,
    });
  }

  return recommendations.slice(0, 5);
}

function calculateHealthScore(
  metrics: StrategicMetrics,
  missing: MissingInformation[],
  alerts: StrategicAlert[],
): number {
  let score = 55;

  if (metrics.memoryEntries >= 10) {
    score += 8;
  }

  if (metrics.knowledgeNodes >= 20) {
    score += 8;
  }

  if (metrics.knowledgeEdges >= 10) {
    score += 5;
  }

  if (metrics.opportunitiesOpen > 0) {
    score += 5;
  }

  if (metrics.integrationsConnected > 0) {
    score += 8;
  }

  if (metrics.automationsCompleted > 0) {
    score += 6;
  }

  score -=
    Math.min(
      metrics.approvalsPending * 2,
      10,
    );

  score -=
    Math.min(
      metrics.plansAwaitingApproval * 3,
      9,
    );

  score -=
    Math.min(
      missing.length * 4,
      16,
    );

  score -=
    alerts.filter(
      (item) =>
        item.level === "critical",
    ).length * 6;

  return Math.max(
    0,
    Math.min(100, score),
  );
}

export function buildStrategicBrief(
  input: StrategicAdvisorInput,
): StrategicBrief {
  const metrics =
    calculateMetrics(input);

  const priorities =
    buildPriorities(input);

  const alerts =
    buildAlerts(input, metrics);

  const missingInformation =
    buildMissingInformation(input);

  const recommendations =
    buildRecommendations(
      metrics,
      missingInformation,
    );

  const healthScore =
    calculateHealthScore(
      metrics,
      missingInformation,
      alerts,
    );

  const businessName =
    text(
      input.business.name,
      "L’azienda",
    );

  const executiveSummary =
    priorities.length > 0
      ? `${businessName} presenta ${priorities.length} priorità operative. Il punto più urgente è: ${priorities[0].title}. Lo stato operativo complessivo è ${healthScore >= 75 ? "solido" : healthScore >= 55 ? "intermedio" : "da consolidare"}.`
      : `${businessName} non presenta attualmente priorità operative urgenti. È consigliato aggiornare le fonti dati e rigenerare l’analisi strategica.`;

  const sourceVolume =
    input.memoryEntries.length +
    input.knowledgeNodes.length +
    input.knowledgeEdges.length +
    input.opportunities.length +
    input.missions.length +
    input.missionPlans.length +
    input.approvals.length +
    input.automationRuns.length;

  const confidence =
    Math.min(
      0.98,
      Math.max(
        0.5,
        0.55 +
          Math.min(
            sourceVolume / 250,
            0.35,
          ) -
          missingInformation.length *
            0.03,
      ),
    );

  return {
    businessId:
      text(input.business.id),

    organisationId:
      text(
        input.business.organisation_id,
      ) || null,

    briefDate: dateOnly(),

    executiveSummary,
    businessHealthScore:
      healthScore,

    confidence:
      Number(
        confidence.toFixed(2),
      ),

    priorities,
    alerts,
    recommendations,
    missingInformation,
    metrics,

    sourceSnapshot: {
      generatedAt:
        new Date().toISOString(),

      counts: {
        opportunities:
          input.opportunities.length,

        missions:
          input.missions.length,

        missionPlans:
          input.missionPlans.length,

        approvals:
          input.approvals.length,

        automationBlueprints:
          input.automationBlueprints.length,

        automationRuns:
          input.automationRuns.length,

        automationArtifacts:
          input.automationArtifacts.length,

        integrations:
          input.integrations.length,

        memoryEntries:
          input.memoryEntries.length,

        graphSnapshots:
          input.graphSnapshots.length,

        knowledgeNodes:
          input.knowledgeNodes.length,

        knowledgeEdges:
          input.knowledgeEdges.length,
      },
    },
  };
}

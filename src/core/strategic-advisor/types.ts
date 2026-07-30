export type StrategicPriority = {
  rank: number;
  title: string;
  reason: string;
  action: string;
  sourceType:
    | "approval"
    | "mission"
    | "mission_plan"
    | "opportunity"
    | "automation"
    | "integration"
    | "knowledge_graph"
    | "business_memory";

  sourceId: string | null;

  urgency:
    | "critical"
    | "high"
    | "medium"
    | "low";

  impact:
    | "high"
    | "medium"
    | "low";

  requiresApproval: boolean;
};

export type StrategicAlert = {
  level:
    | "critical"
    | "warning"
    | "information";

  title: string;
  description: string;

  sourceType: string;
  sourceId: string | null;
};

export type StrategicRecommendation = {
  title: string;
  rationale: string;
  expectedOutcome: string;
  nextStep: string;
};

export type MissingInformation = {
  field: string;
  reason: string;
  consequence: string;
};

export type StrategicMetrics = {
  opportunitiesOpen: number;
  missionsActive: number;
  plansAwaitingApproval: number;
  approvalsPending: number;
  automationsReady: number;
  automationsCompleted: number;
  artifactsProduced: number;
  integrationsConnected: number;
  integrationsTotal: number;
  memoryEntries: number;
  knowledgeNodes: number;
  knowledgeEdges: number;
};

export type StrategicBrief = {
  businessId: string;
  organisationId: string | null;
  briefDate: string;

  executiveSummary: string;
  businessHealthScore: number;
  confidence: number;

  priorities: StrategicPriority[];
  alerts: StrategicAlert[];
  recommendations: StrategicRecommendation[];
  missingInformation: MissingInformation[];

  metrics: StrategicMetrics;

  sourceSnapshot: Record<
    string,
    unknown
  >;
};

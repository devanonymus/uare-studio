import { z } from "zod";

export const EvidenceClassificationSchema = z.enum([
  "verified_fact",
  "inference",
  "hypothesis",
  "missing_data",
]);

export const EvidenceClaimSchema = z.object({
  id: z.string().min(2).max(100),
  claim: z.string().min(10).max(700),
  classification: EvidenceClassificationSchema,
  confidence: z.number().min(0).max(1),
  sourceIds: z.array(z.string().min(1).max(120)).max(12),
  verificationNote: z.string().min(10).max(600),
});

export const BusinessMemorySchema = z.object({
  identity: z.object({
    officialName: z.string().min(1).max(180),
    sector: z.string().min(1).max(120),
    city: z.string().max(120),
    website: z.string().max(500),
    businessModel: z.string().min(2).max(300),
  }),

  positioning: z.object({
    currentPositioning: z.string().min(10).max(700),
    desiredPositioning: z.string().min(10).max(700),
    differentiators: z.array(
      z.string().min(5).max(300),
    ).max(10),
  }),

  audiences: z.array(
    z.object({
      segment: z.string().min(2).max(160),
      need: z.string().min(5).max(400),
      desiredAction: z.string().min(2).max(200),
    }),
  ).max(10),

  goals: z.array(
    z.object({
      goal: z.string().min(5).max(300),
      priority: z.number().int().min(1).max(5),
      measurableOutcome: z.string().min(5).max(300),
    }),
  ).min(1).max(10),

  channels: z.array(
    z.object({
      channel: z.string().min(2).max(100),
      status: z.enum([
        "active",
        "partial",
        "missing",
        "not_verified",
      ]),
      note: z.string().min(3).max(400),
    }),
  ).max(20),

  offers: z.array(
    z.object({
      name: z.string().min(2).max(180),
      description: z.string().min(5).max(500),
      status: z.enum([
        "verified",
        "inferred",
        "not_verified",
      ]),
    }),
  ).max(12),

  brand: z.object({
    toneOfVoice: z.array(
      z.string().min(2).max(80),
    ).max(8),
    visualDirection: z.string().min(10).max(600),
    brandStrengths: z.array(
      z.string().min(5).max(300),
    ).max(8),
    brandRisks: z.array(
      z.string().min(5).max(300),
    ).max(8),
  }),

  constraints: z.array(
    z.string().min(5).max(400),
  ).max(15),

  unknowns: z.array(
    z.string().min(5).max(400),
  ).max(20),
});

export const MissionSchema = z.object({
  id: z.string().min(2).max(100),
  title: z.string().min(5).max(180),
  objective: z.string().min(15).max(700),
  rationale: z.string().min(20).max(900),

  priority: z.number().int().min(1).max(5),

  impact: z.enum([
    "critical",
    "high",
    "medium",
    "low",
  ]),

  effort: z.enum([
    "small",
    "medium",
    "large",
  ]),

  ownerAgent: z.string().min(2).max(120),

  supportingEvidenceIds: z.array(
    z.string().min(1).max(100),
  ).max(12),

  dependencies: z.array(
    z.string().min(2).max(250),
  ).max(10),

  kpis: z.array(
    z.object({
      name: z.string().min(2).max(140),
      target: z.string().min(2).max(220),
      measurementSource: z.string().min(2).max(180),
    }),
  ).min(1).max(6),

  riskLevel: z.enum([
    "low",
    "medium",
    "high",
  ]),

  approvalRequired: z.boolean(),

  status: z.literal("proposed"),
});

export const AutomationProposalSchema = z.object({
  id: z.string().min(2).max(100),
  name: z.string().min(5).max(180),
  objective: z.string().min(15).max(600),

  trigger: z.object({
    event: z.string().min(5).max(300),
    conditions: z.array(
      z.string().min(3).max(300),
    ).max(10),
  }),

  actions: z.array(
    z.object({
      order: z.number().int().min(1).max(30),
      agent: z.string().min(2).max(120),
      action: z.string().min(5).max(500),
      channel: z.string().min(2).max(120),
    }),
  ).min(1).max(20),

  safeguards: z.array(
    z.string().min(5).max(400),
  ).min(1).max(12),

  riskLevel: z.enum([
    "low",
    "medium",
    "high",
  ]),

  approvalRequired: z.boolean(),

  status: z.literal("proposed"),
});

export const RecommendedAgentSchema = z.object({
  id: z.string().min(2).max(100),
  name: z.string().min(2).max(140),
  responsibility: z.string().min(10).max(500),
  activationReason: z.string().min(10).max(500),
  priority: z.number().int().min(1).max(5),
});

export const UviqOrchestratorOutputSchema = z.object({
  executiveSummary: z.string().min(80).max(2200),

  strategicDiagnosis: z.string().min(80).max(2200),

  mainCommercialGap: z.string().min(30).max(900),

  businessMemory: BusinessMemorySchema,

  evidence: z.array(
    EvidenceClaimSchema,
  ).min(5).max(30),

  missions: z.array(
    MissionSchema,
  ).min(3).max(12),

  automationProposals: z.array(
    AutomationProposalSchema,
  ).min(1).max(8),

  recommendedAgents: z.array(
    RecommendedAgentSchema,
  ).min(3).max(15),

  immediateDecisions: z.array(
    z.string().min(10).max(500),
  ).min(2).max(10),

  blockedActions: z.array(
    z.object({
      action: z.string().min(5).max(400),
      reason: z.string().min(10).max(500),
      requiredDataOrApproval: z.string().min(5).max(500),
    }),
  ).max(12),

  confidence: z.number().min(0).max(1),

  limitations: z.array(
    z.string().min(10).max(500),
  ).max(20),
});

export const UviqOrchestratorResultSchema =
  UviqOrchestratorOutputSchema.extend({
    runId: z.string().min(2).max(120),
    generatedAt: z.string(),
    status: z.literal("completed"),
  });

export type UviqOrchestratorOutput =
  z.infer<typeof UviqOrchestratorOutputSchema>;

export type UviqOrchestratorResult =
  z.infer<typeof UviqOrchestratorResultSchema>;

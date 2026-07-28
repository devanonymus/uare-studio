import { z } from "zod";

export const OpportunitySchema = z.object({
  title: z.string().trim().min(8).max(220),

  summary: z.string().trim().min(30).max(1200),

  rationale: z.string().trim().min(40).max(2400),

  opportunityType: z.enum([
    "seo",
    "social",
    "advertising",
    "website",
    "conversion",
    "offer",
    "competitor",
    "reputation",
    "crm",
    "content",
    "automation",
    "data_gap",
    "strategic",
  ]),

  priority: z.number().int().min(1).max(5),

  impact: z.enum([
    "low",
    "medium",
    "high",
    "critical",
  ]),

  effort: z.enum([
    "small",
    "medium",
    "large",
  ]),

  riskLevel: z.enum([
    "low",
    "medium",
    "high",
    "critical",
  ]),

  confidence: z.number().min(0).max(1),

  estimatedCostMin: z.number().min(0).nullable(),

  estimatedCostMax: z.number().min(0).nullable(),

  estimatedTime: z.string().trim().min(2).max(160),

  supportingNodeIds: z.array(z.string().uuid()).max(40),

  supportingEvidenceIds: z.array(z.string().uuid()).max(40),

  missingData: z.array(
    z.string().trim().min(5).max(500),
  ).max(20),

  proposedActions: z.array(
    z.object({
      order: z.number().int().min(1),
      action: z.string().trim().min(10).max(700),
      ownerAgent: z.string().trim().min(2).max(160),
      approvalRequired: z.boolean(),
    }),
  ).min(1).max(20),

  expectedKpis: z.array(
    z.object({
      name: z.string().trim().min(2).max(160),
      target: z.string().trim().min(2).max(300),
      measurementSource: z.string().trim().min(2).max(180),
    }),
  ).min(1).max(12),

  limitations: z.array(
    z.string().trim().min(10).max(600),
  ).max(20),
});

export const OpportunityEngineOutputSchema = z.object({
  executiveSummary: z.string().trim().min(60).max(2200),

  opportunities: z.array(OpportunitySchema).min(1).max(12),

  globalMissingData: z.array(
    z.string().trim().min(5).max(500),
  ).max(30),

  analysisConfidence: z.number().min(0).max(1),
});

export type OpportunityEngineOutput = z.infer<
  typeof OpportunityEngineOutputSchema
>;

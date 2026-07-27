import { z } from "zod";

export const MissionStatusSchema = z.enum([
  "created",
  "analysing",
  "insufficient_data",
  "ready",
  "awaiting_approval",
  "approved",
  "rejected",
  "executing",
  "completed",
  "measuring",
  "optimising",
  "failed",
  "cancelled",
  "archived",
]);

export const MissionKpiSchema = z.object({
  name: z.string().trim().min(2).max(140),

  target: z.string().trim().min(2).max(220),

  measurementSource: z
    .string()
    .trim()
    .min(2)
    .max(180),
});

export const CreateMissionSchema = z.object({
  businessId: z.string().uuid(),

  title: z.string().trim().min(5).max(180),

  objective: z
    .string()
    .trim()
    .min(15)
    .max(1200),

  rationale: z
    .string()
    .trim()
    .min(20)
    .max(2000),

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

  ownerAgent: z
    .string()
    .trim()
    .min(2)
    .max(120),

  approvalRequired: z.boolean(),

  estimatedCost: z
    .number()
    .min(0)
    .optional(),

  dependencies: z
    .array(z.string().trim().min(2).max(250))
    .max(20)
    .default([]),

  kpis: z
    .array(MissionKpiSchema)
    .min(1)
    .max(10),

  evidenceClaimIds: z
    .array(z.string().uuid())
    .max(30)
    .default([]),
});

export type CreateMissionInput =
  z.infer<typeof CreateMissionSchema>;

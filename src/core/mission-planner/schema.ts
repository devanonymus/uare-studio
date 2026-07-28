import { z } from "zod";

export const MissionPlanPhaseSchema =
  z.object({
    order: z.number().int().min(1),

    name: z
      .string()
      .trim()
      .min(4)
      .max(180),

    objective: z
      .string()
      .trim()
      .min(15)
      .max(900),

    ownerAgent: z
      .string()
      .trim()
      .min(2)
      .max(160),

    estimatedDuration: z
      .string()
      .trim()
      .min(2)
      .max(120),

    approvalRequired: z.boolean(),

    actions: z
      .array(
        z.object({
          order: z.number().int().min(1),

          action: z
            .string()
            .trim()
            .min(10)
            .max(800),

          actionType: z.enum([
            "analysis",
            "strategy",
            "content",
            "seo",
            "social",
            "advertising",
            "website",
            "email",
            "whatsapp",
            "crm",
            "measurement",
            "automation",
          ]),

          externalEffect: z.boolean(),

          requiredIntegration: z
            .string()
            .trim()
            .max(160)
            .nullable(),
        }),
      )
      .min(1)
      .max(20),

    deliverables: z
      .array(
        z.string().trim().min(5).max(500),
      )
      .min(1)
      .max(20),
  });

export const AutomationBlueprintProposalSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(5)
      .max(220),

    objective: z
      .string()
      .trim()
      .min(15)
      .max(1000),

    riskLevel: z.enum([
      "low",
      "medium",
      "high",
      "critical",
    ]),

    approvalRequired: z.boolean(),

    trigger: z.object({
      event: z
        .string()
        .trim()
        .min(5)
        .max(300),

      conditions: z
        .array(
          z.string().trim().min(5).max(500),
        )
        .max(20),
    }),

    actions: z
      .array(
        z.object({
          order: z.number().int().min(1),

          agent: z
            .string()
            .trim()
            .min(2)
            .max(160),

          action: z
            .string()
            .trim()
            .min(10)
            .max(800),

          channel: z
            .string()
            .trim()
            .min(2)
            .max(120),

          externalEffect: z.boolean(),
        }),
      )
      .min(1)
      .max(30),

    safeguards: z
      .array(
        z.string().trim().min(10).max(600),
      )
      .min(2)
      .max(20),
  });

export const MissionPlannerOutputSchema =
  z.object({
    executiveSummary: z
      .string()
      .trim()
      .min(60)
      .max(2200),

    operatingModel: z.object({
      objective: z
        .string()
        .trim()
        .min(15)
        .max(900),

      executionMode: z.literal("sandbox_first"),

      governance: z
        .string()
        .trim()
        .min(20)
        .max(1200),
    }),

    phases: z
      .array(MissionPlanPhaseSchema)
      .min(2)
      .max(10),

    automationBlueprints: z
      .array(
        AutomationBlueprintProposalSchema,
      )
      .min(1)
      .max(8),

    requiredInputs: z
      .array(
        z.string().trim().min(5).max(500),
      )
      .max(30),

    risks: z
      .array(
        z.object({
          risk: z
            .string()
            .trim()
            .min(10)
            .max(600),

          level: z.enum([
            "low",
            "medium",
            "high",
            "critical",
          ]),

          mitigation: z
            .string()
            .trim()
            .min(10)
            .max(700),
        }),
      )
      .max(20),

    verificationChecks: z
      .array(
        z.object({
          check: z
            .string()
            .trim()
            .min(8)
            .max(500),

          requiredBeforeExecution:
            z.boolean(),
        }),
      )
      .min(3)
      .max(25),

    expectedKpis: z
      .array(
        z.object({
          name: z
            .string()
            .trim()
            .min(2)
            .max(180),

          target: z
            .string()
            .trim()
            .min(2)
            .max(350),

          source: z
            .string()
            .trim()
            .min(2)
            .max(180),
        }),
      )
      .min(1)
      .max(15),

    limitations: z
      .array(
        z.string().trim().min(10).max(600),
      )
      .max(20),

    confidence: z.number().min(0).max(1),
  });

export type MissionPlannerOutput =
  z.infer<typeof MissionPlannerOutputSchema>;

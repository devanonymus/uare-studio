import { z } from "zod";

export const AutomationExecutionInputSchema =
  z.object({
    automationId: z.string().uuid(),

    businessId: z.string().uuid(),

    dryRun: z.boolean().default(true),

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
      .max(220),

    context: z
      .record(z.string(), z.unknown())
      .default({}),
  });

export const AutomationArtifactSchema =
  z.object({
    id: z.string().min(2).max(120),

    type: z.enum([
      "strategy",
      "content_brief",
      "social_post",
      "reel_concept",
      "seo_plan",
      "campaign_plan",
      "email_draft",
      "whatsapp_draft",
      "competitor_report",
      "task",
      "checklist",
    ]),

    title: z.string().min(5).max(220),

    description: z.string().min(10).max(1800),

    content: z.string().min(5).max(8000),

    channel: z.string().min(2).max(120),

    status: z.literal("draft"),

    externalExecutionBlocked: z.boolean(),

    approvalRequired: z.boolean(),
  });

export const AutomationExecutionOutputSchema =
  z.object({
    executiveSummary: z
      .string()
      .min(50)
      .max(2000),

    objective: z
      .string()
      .min(10)
      .max(800),

    executionMode: z.literal("sandbox"),

    completedInternalActions: z
      .array(
        z.object({
          order: z.number().int().min(1),
          agent: z.string().min(2).max(160),
          action: z.string().min(5).max(600),
          result: z.string().min(10).max(1200),
        }),
      )
      .max(30),

    artifacts: z
      .array(AutomationArtifactSchema)
      .min(1)
      .max(30),

    blockedExternalActions: z
      .array(
        z.object({
          action: z.string().min(5).max(600),
          channel: z.string().min(2).max(120),
          reason: z.string().min(10).max(800),
          requiredIntegration: z
            .string()
            .min(2)
            .max(160),
          requiredApproval: z.boolean(),
        }),
      )
      .max(30),

    verificationChecks: z
      .array(
        z.object({
          check: z.string().min(5).max(300),
          status: z.enum([
            "passed",
            "warning",
            "blocked",
          ]),
          note: z.string().min(5).max(800),
        }),
      )
      .min(3)
      .max(30),

    recommendedNextSteps: z
      .array(z.string().min(10).max(600))
      .min(1)
      .max(15),

    confidence: z.number().min(0).max(1),

    limitations: z
      .array(z.string().min(10).max(600))
      .max(20),
  });

export type AutomationExecutionOutput =
  z.infer<
    typeof AutomationExecutionOutputSchema
  >;

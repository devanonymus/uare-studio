import { z } from "zod";

export const MemoryStatusSchema = z.enum([
  "verified",
  "inferred",
  "hypothesis",
  "missing",
  "conflicted",
  "archived",
]);

export const MemorySourceTypeSchema = z.enum([
  "user",
  "website",
  "document",
  "integration",
  "deterministic_check",
  "ai_inference",
  "system",
]);

export const CreateOrganisationSchema = z.object({
  name: z.string().trim().min(2).max(160),

  legalName: z
    .string()
    .trim()
    .max(200)
    .optional(),

  vatNumber: z
    .string()
    .trim()
    .max(40)
    .optional(),

  countryCode: z
    .string()
    .trim()
    .length(2)
    .default("IT"),

  timezone: z
    .string()
    .trim()
    .min(3)
    .max(80)
    .default("Europe/Rome"),
});

export const CreateBusinessSchema = z.object({
  organisationId: z.string().uuid(),

  name: z.string().trim().min(2).max(180),

  sector: z.string().trim().min(2).max(120),

  city: z
    .string()
    .trim()
    .max(120)
    .optional(),

  websiteUrl: z
    .string()
    .trim()
    .url()
    .max(500)
    .optional()
    .or(z.literal("")),

  primaryGoal: z
    .string()
    .trim()
    .max(800)
    .optional(),

  lifecycleStage: z
    .enum([
      "prospect",
      "qualified",
      "proposal",
      "client",
      "inactive",
      "archived",
    ])
    .default("prospect"),
});

export const CreateMemoryEntrySchema = z.object({
  businessId: z.string().uuid(),

  category: z.string().trim().min(2).max(100),

  memoryKey: z.string().trim().min(2).max(160),

  value: z.unknown(),

  status: MemoryStatusSchema.default(
    "hypothesis",
  ),

  confidence: z
    .number()
    .min(0)
    .max(1)
    .default(0),

  sourceType:
    MemorySourceTypeSchema.default("system"),

  sourceReference: z
    .string()
    .trim()
    .max(1000)
    .optional(),

  createdBy: z
    .string()
    .trim()
    .min(2)
    .max(160)
    .default("system"),
});

export type CreateOrganisationInput =
  z.infer<typeof CreateOrganisationSchema>;

export type CreateBusinessInput =
  z.infer<typeof CreateBusinessSchema>;

export type CreateMemoryEntryInput =
  z.infer<typeof CreateMemoryEntrySchema>;

import { z } from "zod";

export const areaIds = [
  "brand",
  "website",
  "mobile",
  "seo",
  "google",
  "social",
  "menu",
  "content",
  "conversion",
] as const;

export const IntelligenceAreaSchema = z.object({
  id: z.enum(areaIds),
  label: z.string().min(2).max(80),
  score: z.number().int().min(0).max(100),
  status: z.enum([
    "critica",
    "prioritaria",
    "migliorabile",
    "solida",
  ]),
  summary: z.string().min(30).max(900),
  findings: z.array(z.string().min(15).max(500)).min(2).max(5),
  recommendations: z
    .array(z.string().min(15).max(500))
    .min(2)
    .max(5),
});

export const DemoBlueprintSchema = z.object({
  archetype: z.enum([
    "luxury_editorial",
    "japanese_minimal",
    "commercial_ayce",
    "urban_street",
    "fusion_contemporary",
    "traditional_authentic",
  ]),
  positioning: z.string().min(10).max(300),
  audience: z.array(z.string().min(2).max(80)).min(2).max(6),
  tone: z.array(z.string().min(2).max(50)).min(3).max(6),
  paletteDirection: z.string().min(10).max(250),
  typographyDirection: z.string().min(10).max(250),
  heroStrategy: z.string().min(20).max(400),
  primaryCta: z.string().min(2).max(80),
  secondaryCta: z.string().min(2).max(80),
  sections: z.array(z.string().min(2).max(80)).min(5).max(10),
  visualAssets: z.array(z.string().min(5).max(180)).min(3).max(8),
});

export const BrandProfileSchema = z.object({
  inferredPositioning: z.enum([
    "premium",
    "upper_mid",
    "mainstream",
    "value",
    "unclear",
  ]),
  restaurantArchetype: z.enum([
    "luxury",
    "contemporary",
    "fusion",
    "traditional",
    "street_food",
    "all_you_can_eat",
    "fast_casual",
    "unclear",
  ]),
  perceivedAudience: z.array(z.string().min(2).max(80)).min(2).max(6),
  strengths: z.array(z.string().min(10).max(300)).min(2).max(6),
  weaknesses: z.array(z.string().min(10).max(300)).min(2).max(6),
  differentiators: z.array(z.string().min(5).max(250)).min(1).max(5),
});

export const AIIntelligenceSchema = z.object({
  executiveSummary: z.string().min(80).max(1800),
  strategicDiagnosis: z.string().min(80).max(1800),
  mainCommercialGap: z.string().min(30).max(800),
  strongestArea: z.enum(areaIds),
  weakestArea: z.enum(areaIds),
  areas: z.array(IntelligenceAreaSchema).length(9),
  criticalFindings: z
    .array(z.string().min(20).max(600))
    .min(4)
    .max(8),
  opportunities: z
    .array(z.string().min(20).max(600))
    .min(4)
    .max(8),
  brandProfile: BrandProfileSchema,
  demoBlueprint: DemoBlueprintSchema,
  confidence: z.number().min(0).max(1),
  limitations: z.array(z.string().min(10).max(400)).max(8),
});

export type AIIntelligence = z.infer<typeof AIIntelligenceSchema>;

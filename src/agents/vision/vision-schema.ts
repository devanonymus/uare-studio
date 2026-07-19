import { z } from "zod";

export const VisionAnalysisSchema = z.object({
  overallVisualScore: z.number().int().min(0).max(100),

  firstImpression: z.object({
    score: z.number().int().min(0).max(100),
    verdict: z.string().min(30).max(900),
    perceivedPositioning: z.enum([
      "premium",
      "contemporary",
      "mainstream",
      "economic",
      "dated",
      "unclear",
    ]),
  }),

  hierarchy: z.object({
    score: z.number().int().min(0).max(100),
    findings: z.array(z.string().min(15).max(500)).min(2).max(6),
  }),

  brandPerception: z.object({
    score: z.number().int().min(0).max(100),
    consistency: z.string().min(30).max(800),
    strengths: z.array(z.string().min(10).max(400)).min(1).max(5),
    weaknesses: z.array(z.string().min(10).max(400)).min(1).max(6),
  }),

  callToAction: z.object({
    score: z.number().int().min(0).max(100),
    visibility: z.enum([
      "assente",
      "debole",
      "sufficiente",
      "forte",
    ]),
    primaryActionDetected: z.string().max(160),
    findings: z.array(z.string().min(15).max(500)).min(2).max(6),
  }),

  mobileExperience: z.object({
    score: z.number().int().min(0).max(100),
    findings: z.array(z.string().min(15).max(500)).min(2).max(6),
  }),

  imagery: z.object({
    score: z.number().int().min(0).max(100),
    foodDesirability: z.number().int().min(0).max(100),
    professionalism: z.number().int().min(0).max(100),
    consistency: z.number().int().min(0).max(100),
    findings: z.array(z.string().min(15).max(500)).min(2).max(6),
  }),

  typography: z.object({
    score: z.number().int().min(0).max(100),
    findings: z.array(z.string().min(15).max(500)).min(2).max(5),
  }),

  accessibilityRisks: z
    .array(z.string().min(15).max(500))
    .min(1)
    .max(8),

  commercialGaps: z
    .array(z.string().min(20).max(600))
    .min(3)
    .max(8),

  recommendations: z
    .array(z.string().min(20).max(600))
    .min(4)
    .max(10),

  demoDirection: z.object({
    recommendedArchetype: z.enum([
      "luxury_editorial",
      "japanese_minimal",
      "commercial_ayce",
      "fusion_contemporary",
      "urban_asian",
      "traditional_authentic",
    ]),
    visualConcept: z.string().min(40).max(900),
    palette: z.array(z.string().min(3).max(60)).min(3).max(6),
    typography: z.string().min(20).max(500),
    heroConcept: z.string().min(30).max(700),
    sections: z.array(z.string().min(3).max(100)).min(5).max(10),
    primaryCta: z.string().min(2).max(100),
  }),

  confidence: z.number().min(0).max(1),

  limitations: z
    .array(z.string().min(10).max(400))
    .max(8),
});

export type VisionAnalysis = z.infer<typeof VisionAnalysisSchema>;

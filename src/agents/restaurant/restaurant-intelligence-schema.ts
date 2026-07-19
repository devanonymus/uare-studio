import { z } from "zod";

export const EvidenceValueSchema = z.object({
  value: z.string(),
  confidence: z.number().min(0).max(1),
  source: z.enum([
    "website",
    "vision",
    "user_input",
    "ai_inference",
    "not_verified",
  ]),
});

export const CommercialOpportunitySchema = z.object({
  id: z.string().min(2).max(100),
  service: z.string().min(2).max(160),
  priority: z.number().int().min(1).max(5),
  urgency: z.enum(["immediata", "alta", "media", "bassa"]),
  evidence: z.array(z.string().min(10).max(500)).min(1).max(6),
  commercialReason: z.string().min(30).max(900),
  expectedImpact: z.array(z.string().min(10).max(300)).min(1).max(5),
  priceRange: z.object({
    minimum: z.number().int().min(0),
    maximum: z.number().int().min(0),
  }),
});

export const RestaurantIntelligenceSchema = z.object({
  runId: z.string(),
  generatedAt: z.string(),

  identity: z.object({
    officialName: EvidenceValueSchema,
    alternativeNames: z.array(z.string()).max(10),
    namingConsistency: z.enum([
      "coerente",
      "parzialmente_coerente",
      "incoerente",
      "non_verificabile",
    ]),
    category: EvidenceValueSchema,
    restaurantModel: z.enum([
      "all_you_can_eat",
      "a_la_carte",
      "takeaway",
      "delivery",
      "fusion",
      "premium",
      "fast_casual",
      "mixed",
      "unclear",
    ]),
    city: EvidenceValueSchema,
    province: EvidenceValueSchema,
    country: EvidenceValueSchema,
    language: EvidenceValueSchema,
    currency: EvidenceValueSchema,
  }),

  business: z.object({
    phoneNumbers: z.array(z.string()).max(10),
    emails: z.array(z.string()).max(10),
    whatsappLinks: z.array(z.string()).max(10),
    addresses: z.array(z.string()).max(10),
    openingHours: z.array(z.string()).max(20),
    prices: z.array(z.string()).max(30),
    menuLinks: z.array(z.string()).max(20),
    bookingLinks: z.array(z.string()).max(20),
    deliveryLinks: z.array(z.string()).max(20),
    servicesDetected: z.array(z.string()).max(30),
  }),

  marketing: z.object({
    instagram: z.array(z.string()).max(10),
    facebook: z.array(z.string()).max(10),
    tiktok: z.array(z.string()).max(10),
    youtube: z.array(z.string()).max(10),
    tripadvisor: z.array(z.string()).max(10),
    theFork: z.array(z.string()).max(10),
    deliveryPlatforms: z.array(z.string()).max(20),
    googleBusinessVerified: z.boolean(),
    channelsNotVerified: z.array(z.string()).max(20),
  }),

  technical: z.object({
    statusCode: z.number().int().nullable(),
    loadTimeMs: z.number().int().min(0),
    documentHeight: z.number().int().min(0),
    bodyTextLength: z.number().int().min(0),
    imageCount: z.number().int().min(0),
    linkCount: z.number().int().min(0),
    headingCount: z.number().int().min(0),
    formCount: z.number().int().min(0),
    hasHorizontalOverflow: z.boolean(),
    hasPrimaryCta: z.boolean(),
    hasBookingSignal: z.boolean(),
    hasWhatsappSignal: z.boolean(),
    hasTelephoneSignal: z.boolean(),
    technicalFindings: z.array(z.string()).max(20),
  }),

  perception: z.object({
    positioning: z.enum([
      "premium",
      "upper_mid",
      "mainstream",
      "economic",
      "unclear",
    ]),
    archetype: z.enum([
      "luxury",
      "contemporary",
      "commercial_ayce",
      "fusion",
      "traditional",
      "street_food",
      "takeaway",
      "unclear",
    ]),
    audiences: z.array(z.string()).min(2).max(8),
    strengths: z.array(z.string()).min(2).max(8),
    weaknesses: z.array(z.string()).min(2).max(10),
    mainCommercialGap: z.string().min(40).max(1200),
    strategicDiagnosis: z.string().min(80).max(1800),
  }),

  scores: z.object({
    website: z.number().int().min(0).max(100),
    mobile: z.number().int().min(0).max(100),
    visual: z.number().int().min(0).max(100),
    brand: z.number().int().min(0).max(100),
    conversion: z.number().int().min(0).max(100),
    content: z.number().int().min(0).max(100),
    technical: z.number().int().min(0).max(100),
    commercialReadiness: z.number().int().min(0).max(100),
    overall: z.number().int().min(0).max(100),
  }),

  opportunities: z
    .array(CommercialOpportunitySchema)
    .min(4)
    .max(12),

  demoBlueprint: z.object({
    archetype: z.enum([
      "luxury_editorial",
      "japanese_minimal",
      "commercial_ayce",
      "fusion_contemporary",
      "urban_asian",
      "traditional_authentic",
      "takeaway_conversion",
    ]),
    objective: z.string().min(30).max(600),
    positioning: z.string().min(20).max(500),
    primaryAudience: z.string().min(5).max(200),
    palette: z.array(z.string().min(3).max(50)).min(3).max(7),
    typography: z.string().min(15).max(500),
    hero: z.object({
      eyebrow: z.string().max(100),
      title: z.string().min(5).max(180),
      subtitle: z.string().min(20).max(500),
      primaryCta: z.string().min(2).max(80),
      secondaryCta: z.string().min(2).max(80),
      visualDirection: z.string().min(20).max(600),
    }),
    sections: z
      .array(
        z.object({
          type: z.enum([
            "hero",
            "value_proposition",
            "menu",
            "ayce_prices",
            "gallery",
            "reviews",
            "story",
            "services",
            "delivery",
            "booking",
            "map_hours",
            "faq",
            "social_proof",
            "footer",
          ]),
          purpose: z.string().min(10).max(300),
          priority: z.number().int().min(1).max(10),
        }),
      )
      .min(6)
      .max(12),
    conversionElements: z.array(z.string()).min(3).max(10),
    imageRequirements: z.array(z.string()).min(3).max(12),
  }),

  confidence: z.number().min(0).max(1),
  limitations: z.array(z.string()).max(20),
});

export type RestaurantIntelligence = z.infer<
  typeof RestaurantIntelligenceSchema
>;

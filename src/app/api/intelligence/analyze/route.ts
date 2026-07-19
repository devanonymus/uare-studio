import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { researchWebsite } from "@/agents/website/research";
import {
  AIIntelligenceSchema,
  type AIIntelligence,
} from "@/agents/brain/intelligence-schema";
import { UAE_SYSTEM_PROMPT } from "@/agents/brain/system-prompt";
import { generateQuickAudit } from "@/lib/quick-audit-engine";
import type {
  QuickAuditArea,
  QuickAuditInput,
  QuickAuditResult,
} from "@/types/quick-audit";

export const runtime = "nodejs";
export const maxDuration = 60;

const InputSchema = z.object({
  restaurantName: z.string().min(2).max(160),
  city: z.string().max(120),
  contactPerson: z.string().max(160),
  category: z.string().min(2).max(160),
  website: z.string().max(500),
  googleBusiness: z.string().max(500),
  instagram: z.string().max(500),
  facebook: z.string().max(500),
  tiktok: z.string().max(500),
  currentMenu: z.string().max(500),
  notes: z.string().max(3000),
});

function normalizeStatus(
  score: number,
): QuickAuditArea["status"] {
  if (score <= 35) return "critica";
  if (score <= 52) return "prioritaria";
  if (score <= 72) return "migliorabile";
  return "solida";
}

function mergeIntelligence(
  base: QuickAuditResult,
  intelligence: AIIntelligence,
): QuickAuditResult {
  const aiAreaMap = new Map(
    intelligence.areas.map((area) => [area.id, area]),
  );

  const areas = base.areas.map((baseArea) => {
    const aiArea = aiAreaMap.get(baseArea.id);

    if (!aiArea) return baseArea;

    return {
      ...baseArea,
      label: aiArea.label,
      score: aiArea.score,
      status: normalizeStatus(aiArea.score),
      summary: aiArea.summary,
      findings: aiArea.findings,
      recommendations: aiArea.recommendations,
    };
  });

  const overallScore = Math.round(
    areas.reduce((total, area) => total + area.score, 0) /
      areas.length,
  );

  return {
    ...base,
    overallScore,
    scoreLabel:
      overallScore <= 35
        ? "Presenza digitale critica"
        : overallScore <= 52
          ? "Presenza digitale debole"
          : overallScore <= 70
            ? "Presenza digitale migliorabile"
            : "Presenza digitale solida",
    executiveSummary: intelligence.executiveSummary,
    strongestArea: intelligence.strongestArea,
    weakestArea: intelligence.weakestArea,
    criticalFindings: intelligence.criticalFindings,
    opportunities: intelligence.opportunities,
    intelligence: {
      strategicDiagnosis: intelligence.strategicDiagnosis,
      mainCommercialGap: intelligence.mainCommercialGap,
      brandProfile: intelligence.brandProfile,
      demoBlueprint: intelligence.demoBlueprint,
      confidence: intelligence.confidence,
      limitations: intelligence.limitations,
      analysisMode: "ai_research",
    },
  };
}

function buildPrompt(
  input: QuickAuditInput,
  websiteEvidence: Awaited<ReturnType<typeof researchWebsite>>,
): string {
  return `
RISTORANTE DA ANALIZZARE
${JSON.stringify(input, null, 2)}

EVIDENZE RACCOLTE DIRETTAMENTE DAL SITO
${JSON.stringify(websiteEvidence, null, 2)}

ISTRUZIONE:
Svolgi una ricerca web mirata sul ristorante indicato, sulla sua presenza Google e sui profili social forniti.

Non confondere attività omonime.
Usa nome, città, sito e categoria per disambiguare.

Produci:
- diagnosi strategica;
- nove aree complete;
- criticità osservabili;
- opportunità concrete;
- profilo di brand;
- blueprint per una demo realmente personalizzata.

Le limitazioni devono specificare quali dati non sono stati verificabili.
`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = InputSchema.parse(body) as QuickAuditInput;
    const baseResult = generateQuickAudit(input);

    const websiteEvidence = input.website
      ? await researchWebsite(input.website)
      : await researchWebsite("");

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        result: {
          ...baseResult,
          intelligence: {
            strategicDiagnosis:
              "La chiave OpenAI non è configurata. È stata utilizzata l’analisi locale di riserva.",
            mainCommercialGap:
              "Analisi AI non disponibile fino alla configurazione della chiave.",
            brandProfile: null,
            demoBlueprint: null,
            confidence: 0.2,
            limitations: [
              "OPENAI_API_KEY non configurata sul server.",
              ...websiteEvidence.errors,
            ],
            analysisMode: "local_fallback",
          },
        },
        websiteEvidence,
        mode: "local_fallback",
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      store: false,
      tools: [{ type: "web_search" }],
      input: [
        {
          role: "system",
          content: UAE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: buildPrompt(input, websiteEvidence),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "uae_restaurant_intelligence",
          description:
            "Report strutturato UAE Intelligence per ristoranti asiatici.",
          strict: true,
          schema: z.toJSONSchema(AIIntelligenceSchema, {
            target: "draft-7",
          }),
        },
      },
    });

    if (!response.output_text) {
      throw new Error(
        "Il modello non ha restituito un report utilizzabile.",
      );
    }

    const parsedJson = JSON.parse(response.output_text);
    const intelligence = AIIntelligenceSchema.parse(parsedJson);
    const result = mergeIntelligence(baseResult, intelligence);

    return NextResponse.json({
      result,
      websiteEvidence,
      mode: "ai_research",
    });
  } catch (error) {
    console.error("UAE Intelligence error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Errore durante l’analisi UAE Intelligence.",
      },
      { status: 500 },
    );
  }
}

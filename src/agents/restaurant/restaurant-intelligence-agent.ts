import fs from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import { z } from "zod";
import {
  RestaurantIntelligenceSchema,
  type RestaurantIntelligence,
} from "@/agents/restaurant/restaurant-intelligence-schema";
import { extractLocalRestaurantEvidence } from "@/agents/restaurant/local-evidence-extractor";

type BrowserEvidence = Parameters<
  typeof extractLocalRestaurantEvidence
>[0];

type VisionAnalysis = {
  overallVisualScore: number;
  firstImpression: {
    score: number;
    verdict: string;
    perceivedPositioning: string;
  };
  hierarchy: {
    score: number;
    findings: string[];
  };
  brandPerception: {
    score: number;
    consistency: string;
    strengths: string[];
    weaknesses: string[];
  };
  callToAction: {
    score: number;
    visibility: string;
    primaryActionDetected: string;
    findings: string[];
  };
  mobileExperience: {
    score: number;
    findings: string[];
  };
  imagery: {
    score: number;
    findings: string[];
  };
  typography: {
    score: number;
    findings: string[];
  };
  commercialGaps: string[];
  recommendations: string[];
  demoDirection: Record<string, unknown>;
  confidence: number;
  limitations: string[];
};

function validateRunId(runId: string): string {
  if (!/^[a-zA-Z0-9_-]+$/.test(runId)) {
    throw new Error("Run ID non valido.");
  }

  return runId;
}

async function readJson<T>(
  runId: string,
  filename: string,
): Promise<T> {
  const safeRunId = validateRunId(runId);

  const filePath = path.join(
    process.cwd(),
    "public",
    "generated",
    "research",
    safeRunId,
    filename,
  );

  const content = await fs.readFile(filePath, "utf-8");

  return JSON.parse(content) as T;
}

async function writeOutput(
  runId: string,
  intelligence: RestaurantIntelligence,
): Promise<void> {
  const outputPath = path.join(
    process.cwd(),
    "public",
    "generated",
    "research",
    validateRunId(runId),
    "restaurant-intelligence.json",
  );

  await fs.writeFile(
    outputPath,
    JSON.stringify(intelligence, null, 2),
    "utf-8",
  );
}

function buildPrompt({
  runId,
  restaurantName,
  city,
  website,
  localEvidence,
  browserEvidence,
  visionAnalysis,
}: {
  runId: string;
  restaurantName: string;
  city: string;
  website: string;
  localEvidence: ReturnType<typeof extractLocalRestaurantEvidence>;
  browserEvidence: BrowserEvidence;
  visionAnalysis: VisionAnalysis;
}) {
  return `
RUN ID
${runId}

DATI DICHIARATI DAL CONSULENTE
${JSON.stringify(
  {
    restaurantName,
    city,
    website,
  },
  null,
  2,
)}

EVIDENZE LOCALI ESTRATTE AUTOMATICAMENTE
${JSON.stringify(localEvidence, null, 2)}

DATI RACCOLTI DAL BROWSER
${JSON.stringify(
  {
    requestedUrl: browserEvidence.requestedUrl,
    finalUrl: browserEvidence.finalUrl,
    title: browserEvidence.title,
    statusCode: browserEvidence.statusCode,
    loadTimeMs: browserEvidence.loadTimeMs,
    pageMetrics: browserEvidence.pageMetrics,
    visualSignals: browserEvidence.visualSignals,
  },
  null,
  2,
)}

ANALISI DEL VISION AGENT
${JSON.stringify(visionAnalysis, null, 2)}

ISTRUZIONI:
Costruisci il profilo commerciale completo del ristorante.

Non inventare:
- numeri di telefono;
- indirizzi;
- orari;
- link;
- recensioni;
- follower;
- metriche Google;
- account social;
- competitor;
- dati economici.

Quando un dato non è verificabile:
- usa stringa vuota o array vuoto;
- imposta source a "not_verified";
- aggiungilo nelle limitations.

Le opportunità devono essere direttamente vendibili da una società digitale:
- sito;
- UX;
- SEO locale;
- Google Business;
- social;
- foto/video;
- prenotazione;
- WhatsApp;
- menu digitale;
- campagne;
- automazioni.

I prezzi devono essere realistici per una PMI italiana ma restano intervalli preliminari.

Il demoBlueprint deve essere specifico per questo ristorante e coerente con:
- modello di business;
- fascia percepita;
- prezzi rilevati;
- target;
- criticità;
- CTA;
- identità visuale.

Il punteggio overall deve derivare dagli altri punteggi e non essere arbitrario.
`;
}

export async function generateRestaurantIntelligence({
  runId,
  restaurantName,
  city = "",
  website = "",
}: {
  runId: string;
  restaurantName: string;
  city?: string;
  website?: string;
}): Promise<RestaurantIntelligence> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY non configurata.");
  }

  const browserEvidence = await readJson<BrowserEvidence>(
    runId,
    "evidence.json",
  );

  const visionAnalysis = await readJson<VisionAnalysis>(
    runId,
    "vision-analysis.json",
  );

  const localEvidence =
    extractLocalRestaurantEvidence(browserEvidence);

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.responses.create({
    model:
      process.env.OPENAI_INTELLIGENCE_MODEL ||
      process.env.OPENAI_MODEL ||
      "gpt-5.6-luna",

    store: false,

    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: `
Sei UAE Restaurant Intelligence Agent.

Agisci come un gruppo composto da:
- consulente aziendale;
- UX strategist;
- brand strategist;
- digital marketing strategist;
- SEO specialist;
- sales strategist;
- creative director.

Il tuo compito è trasformare evidenze verificabili in:
1. profilo del ristorante;
2. diagnosi commerciale;
3. opportunità vendibili;
4. blueprint unico per una nuova esperienza digitale.

REGOLE:
- non inventare dati;
- non presentare inferenze come fatti;
- evidenzia incoerenze;
- assegna punteggi severi ma motivati;
- non promettere incrementi di fatturato;
- non produrre testi generici;
- collega ogni opportunità ad almeno un'evidenza;
- usa italiano professionale e comprensibile.
`,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: buildPrompt({
              runId,
              restaurantName,
              city,
              website,
              localEvidence,
              browserEvidence,
              visionAnalysis,
            }),
          },
        ],
      },
    ],

    text: {
      format: {
        type: "json_schema",
        name: "uae_restaurant_intelligence",
        strict: true,
        schema: z.toJSONSchema(RestaurantIntelligenceSchema, {
          target: "draft-7",
        }),
      },
    },
  });

  if (!response.output_text) {
    throw new Error(
      "Il Restaurant Intelligence Agent non ha prodotto un risultato.",
    );
  }

  const rawResult = JSON.parse(response.output_text);
  const parsed = RestaurantIntelligenceSchema.parse(rawResult);

  const intelligence: RestaurantIntelligence = {
    ...parsed,
    runId,
    generatedAt: new Date().toISOString(),
  };

  await writeOutput(runId, intelligence);

  return intelligence;
}

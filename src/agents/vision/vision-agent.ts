import fs from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import sharp from "sharp";
import { z } from "zod";
import {
  VisionAnalysisSchema,
  type VisionAnalysis,
} from "@/agents/vision/vision-schema";

type Artifact = {
  type: "desktop" | "mobile" | "hero";
  relativePath: string;
  publicUrl: string;
  width: number;
  height: number;
  fullPage: boolean;
};

type BrowserEvidence = {
  requestedUrl: string;
  finalUrl: string;
  title: string;
  statusCode: number | null;
  capturedAt: string;
  loadTimeMs: number;
  viewportArtifacts: Artifact[];
  pageMetrics: Record<string, unknown>;
  visualSignals: Record<string, unknown>;
  errors: string[];
};

function validateRunId(runId: string): string {
  if (!/^[a-zA-Z0-9_-]+$/.test(runId)) {
    throw new Error("Identificativo analisi non valido.");
  }

  return runId;
}

async function readEvidence(runId: string): Promise<BrowserEvidence> {
  const safeRunId = validateRunId(runId);

  const evidencePath = path.join(
    process.cwd(),
    "public",
    "generated",
    "research",
    safeRunId,
    "evidence.json",
  );

  const raw = await fs.readFile(evidencePath, "utf-8");

  return JSON.parse(raw) as BrowserEvidence;
}

function safeArtifactPath(runId: string, artifact: Artifact): string {
  const baseDirectory = path.resolve(
    process.cwd(),
    "public",
    "generated",
    "research",
    validateRunId(runId),
  );

  const candidate = path.resolve(
    process.cwd(),
    artifact.relativePath,
  );

  if (!candidate.startsWith(`${baseDirectory}${path.sep}`)) {
    throw new Error("Percorso screenshot non consentito.");
  }

  return candidate;
}

async function imageToDataUrl(
  imagePath: string,
  mode: "hero" | "mobile",
): Promise<string> {
  const image = sharp(imagePath, {
    limitInputPixels: 80_000_000,
  });

  const metadata = await image.metadata();

  const maxWidth = mode === "hero" ? 1600 : 900;
  const maxHeight = mode === "hero" ? 1200 : 4200;

  const buffer = await image
    .resize({
      width:
        metadata.width && metadata.width > maxWidth
          ? maxWidth
          : undefined,
      height:
        metadata.height && metadata.height > maxHeight
          ? maxHeight
          : undefined,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 82,
      progressive: true,
    })
    .toBuffer();

  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

export async function analyzeWebsiteVision(
  runId: string,
  restaurantName: string,
): Promise<{
  evidence: BrowserEvidence;
  analysis: VisionAnalysis;
}> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY non configurata nel file .env.local.",
    );
  }

  const evidence = await readEvidence(runId);

  const heroArtifact = evidence.viewportArtifacts.find(
    (artifact) => artifact.type === "hero",
  );

  const mobileArtifact = evidence.viewportArtifacts.find(
    (artifact) => artifact.type === "mobile",
  );

  if (!heroArtifact || !mobileArtifact) {
    throw new Error(
      "Gli screenshot hero e mobile non sono disponibili.",
    );
  }

  const heroDataUrl = await imageToDataUrl(
    safeArtifactPath(runId, heroArtifact),
    "hero",
  );

  const mobileDataUrl = await imageToDataUrl(
    safeArtifactPath(runId, mobileArtifact),
    "mobile",
  );

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.responses.create({
    model:
      process.env.OPENAI_VISION_MODEL ||
      process.env.OPENAI_MODEL ||
      "gpt-5",

    store: false,

    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: `
Sei UAE Vision Agent, consulente senior specializzato in:
- UX/UI;
- conversione;
- brand perception;
- food marketing;
- siti web per ristoranti asiatici.

Devi analizzare esclusivamente ciò che è realmente visibile negli screenshot e nei dati tecnici forniti.

Non inventare:
- recensioni;
- risultati economici;
- dati di traffico;
- funzionalità non visibili;
- competitor;
- performance non presenti nei dati.

Distingui:
- evidenza visiva;
- interpretazione consulenziale;
- limitazione dell'analisi.

Il report deve essere severo, concreto e presentabile al titolare del ristorante.

Valuta soprattutto:
- impatto nei primi 5 secondi;
- chiarezza della proposta;
- gerarchia;
- CTA;
- desiderabilità delle immagini food;
- percezione premium;
- leggibilità;
- esperienza mobile;
- coerenza del marchio;
- capacità di generare prenotazioni.
`,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `
RISTORANTE
${restaurantName}

DATI TECNICI E TESTUALI RACCOLTI DAL BROWSER
${JSON.stringify(
  {
    requestedUrl: evidence.requestedUrl,
    finalUrl: evidence.finalUrl,
    title: evidence.title,
    loadTimeMs: evidence.loadTimeMs,
    pageMetrics: evidence.pageMetrics,
    visualSignals: evidence.visualSignals,
  },
  null,
  2,
)}

La prima immagine è la schermata desktop iniziale.
La seconda immagine è la pagina mobile completa.

Produci un'analisi visuale strutturata e una direzione creativa realmente specifica per questo ristorante.
`,
          },
          {
            type: "input_image",
            image_url: heroDataUrl,
            detail: "high",
          },
          {
            type: "input_image",
            image_url: mobileDataUrl,
            detail: "high",
          },
        ],
      },
    ],

    text: {
      format: {
        type: "json_schema",
        name: "uae_vision_analysis",
        strict: true,
        schema: z.toJSONSchema(VisionAnalysisSchema, {
          target: "draft-7",
        }),
      },
    },
  });

  if (!response.output_text) {
    throw new Error(
      "Il Vision Agent non ha restituito un'analisi.",
    );
  }

  const parsed = VisionAnalysisSchema.parse(
    JSON.parse(response.output_text),
  );

  const outputPath = path.join(
    process.cwd(),
    "public",
    "generated",
    "research",
    validateRunId(runId),
    "vision-analysis.json",
  );

  await fs.writeFile(
    outputPath,
    JSON.stringify(parsed, null, 2),
    "utf-8",
  );

  return {
    evidence,
    analysis: parsed,
  };
}

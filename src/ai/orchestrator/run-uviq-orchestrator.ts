import OpenAI from "openai";
import { z } from "zod";
import { researchWebsite } from "@/agents/website/research";
import {
  UviqOrchestratorOutputSchema,
  type UviqOrchestratorResult,
} from "@/ai/orchestrator/orchestrator-schema";
import { UVIQ_ORCHESTRATOR_SYSTEM_PROMPT } from "@/ai/orchestrator/orchestrator-prompt";

export type UviqOrchestratorInput = {
  businessName: string;
  sector: string;
  city: string;
  website: string;
  primaryGoal: string;
  notes: string;
  discovery: Record<string, unknown>;
};

function createRunId(): string {
  return `uviq-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
}

function buildPrompt({
  input,
  websiteEvidence,
}: {
  input: UviqOrchestratorInput;
  websiteEvidence: Awaited<
    ReturnType<typeof researchWebsite>
  >;
}): string {
  return `
AZIENDA

${JSON.stringify(
  {
    businessName: input.businessName,
    sector: input.sector,
    city: input.city,
    website: input.website,
    primaryGoal: input.primaryGoal,
    notes: input.notes,
  },
  null,
  2,
)}

BUSINESS DISCOVERY FORNITA DALL'UTENTE

${JSON.stringify(input.discovery, null, 2)}

EVIDENZE TECNICHE RACCOLTE DAL SITO

${JSON.stringify(websiteEvidence, null, 2)}

COMPITO

Agisci come direttore del reparto marketing UVIQ.

1. Costruisci la Business Memory iniziale.
2. Classifica fatti, inferenze, ipotesi e dati mancanti.
3. Identifica il principale divario commerciale.
4. Seleziona gli agenti necessari.
5. Genera missioni operative con KPI, dipendenze e rischio.
6. Proponi automazioni, ma non dichiararle attive.
7. Blocca tutte le azioni che richiedono dati o autorizzazioni mancanti.
8. Indica chiaramente le limitazioni.

Ogni sourceId deve fare riferimento a una fonte comprensibile, ad esempio:

- user-discovery
- user-business-data
- website-html
- website-metadata
- website-links
- website-cta
- public-web-search
- missing-crm-data
- missing-analytics-data
`;
}

export async function runUviqOrchestrator(
  input: UviqOrchestratorInput,
): Promise<{
  result: UviqOrchestratorResult;
  websiteEvidence: Awaited<
    ReturnType<typeof researchWebsite>
  >;
}> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY non configurata sul server.",
    );
  }

  const websiteEvidence = input.website
    ? await researchWebsite(input.website)
    : await researchWebsite("");

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.responses.create({
    model:
      process.env.OPENAI_INTELLIGENCE_MODEL ||
      process.env.OPENAI_MODEL ||
      "gpt-5",

    store: false,

    tools: [
      {
        type: "web_search",
      },
    ],

    input: [
      {
        role: "system",
        content: UVIQ_ORCHESTRATOR_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: buildPrompt({
          input,
          websiteEvidence,
        }),
      },
    ],

    text: {
      format: {
        type: "json_schema",
        name: "uviq_business_orchestrator",
        description:
          "Business Memory, evidenze, missioni e automazioni proposte da UVIQ.",
        strict: true,
        schema: z.toJSONSchema(
          UviqOrchestratorOutputSchema,
          {
            target: "draft-7",
          },
        ),
      },
    },
  });

  if (!response.output_text) {
    throw new Error(
      "UVIQ Orchestrator non ha restituito un output strutturato.",
    );
  }

  const rawOutput = JSON.parse(
    response.output_text,
  );

  const parsed =
    UviqOrchestratorOutputSchema.parse(
      rawOutput,
    );

  const result: UviqOrchestratorResult = {
    ...parsed,
    runId: createRunId(),
    generatedAt: new Date().toISOString(),
    status: "completed",
  };

  return {
    result,
    websiteEvidence,
  };
}

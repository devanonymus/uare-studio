import OpenAI from "openai";
import { z } from "zod";
import {
  OpportunityEngineOutputSchema,
  type OpportunityEngineOutput,
} from "@/core/opportunities/schema";

type OpportunityInput = {
  business: Record<string, unknown>;
  nodes: Array<Record<string, unknown>>;
  edges: Array<Record<string, unknown>>;
  evidence: Array<Record<string, unknown>>;
  existingMissions: Array<Record<string, unknown>>;
  existingOpportunities: Array<Record<string, unknown>>;
};

const SYSTEM_PROMPT = `
Sei UVIQ Business Opportunity Engine.

Il tuo compito è individuare opportunità concrete di crescita leggendo
esclusivamente i dati presenti nel Knowledge Graph e nel Core.

REGOLE OBBLIGATORIE:

1. Non inventare competitor, prezzi, campagne, risultati o metriche.
2. Distingui fatti verificati, inferenze e dati mancanti.
3. Non dichiarare un risultato economico come garantito.
4. Le stime economiche devono essere prudenti e possono essere null.
5. Ogni opportunità deve indicare i nodi e le evidenze che la supportano.
6. Se una proposta dipende da dati mancanti, inseriscili in missingData.
7. Evita duplicati di missioni e opportunità già esistenti.
8. Genera opportunità operative, non consigli generici.
9. Ogni azione esterna deve richiedere approvazione.
10. Confidence alta non equivale a certezza.
`;

export async function generateBusinessOpportunities(
  input: OpportunityInput,
): Promise<OpportunityEngineOutput> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY non configurata.");
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.responses.create({
    model:
      process.env.OPENAI_INTELLIGENCE_MODEL ||
      process.env.OPENAI_MODEL ||
      "gpt-5",

    store: false,

    input: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `
AZIENDA

${JSON.stringify(input.business, null, 2)}

KNOWLEDGE NODES

${JSON.stringify(input.nodes, null, 2)}

KNOWLEDGE EDGES

${JSON.stringify(input.edges, null, 2)}

EVIDENZE

${JSON.stringify(input.evidence, null, 2)}

MISSIONI ESISTENTI

${JSON.stringify(input.existingMissions, null, 2)}

OPPORTUNITÀ GIÀ PRESENTI

${JSON.stringify(input.existingOpportunities, null, 2)}

Genera opportunità motivate, realistiche e non duplicate.
`,
      },
    ],

    text: {
      format: {
        type: "json_schema",
        name: "uviq_business_opportunities",
        strict: true,
        schema: z.toJSONSchema(
          OpportunityEngineOutputSchema,
          {
            target: "draft-7",
          },
        ),
      },
    },
  });

  if (!response.output_text) {
    throw new Error(
      "Opportunity Engine non ha restituito un output.",
    );
  }

  return OpportunityEngineOutputSchema.parse(
    JSON.parse(response.output_text),
  );
}

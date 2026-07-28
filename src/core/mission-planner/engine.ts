import OpenAI from "openai";
import { z } from "zod";
import {
  MissionPlannerOutputSchema,
  type MissionPlannerOutput,
} from "@/core/mission-planner/schema";

type MissionPlannerInput = {
  business: Record<string, unknown>;
  mission: Record<string, unknown>;
  businessMemory: Array<Record<string, unknown>>;
  knowledgeNodes: Array<Record<string, unknown>>;
  evidence: Array<Record<string, unknown>>;
  integrations: Array<Record<string, unknown>>;
  existingAutomations: Array<Record<string, unknown>>;
};

const SYSTEM_PROMPT = `
Sei UVIQ Mission Planner.

Devi trasformare una missione approvata in un piano operativo concreto,
verificabile e governato.

REGOLE OBBLIGATORIE:

1. Usa esclusivamente dati forniti nel contesto.
2. Non inventare risultati, accessi, competitor, dati economici o metriche.
3. Distingui attività interne e attività con effetti esterni.
4. Ogni effetto esterno richiede approvazione.
5. Le integrazioni non collegate non possono essere considerate operative.
6. L'esecuzione iniziale deve essere sempre sandbox_first.
7. Non duplicare automazioni già presenti.
8. Ogni blueprint deve avere salvaguardie concrete.
9. Inserisci tra requiredInputs ogni dato necessario ma assente.
10. Non promettere risultati commerciali garantiti.
11. Ogni KPI deve indicare una fonte di misurazione.
12. Il piano deve poter essere eseguito progressivamente dagli agenti UVIQ.
`;

export async function generateMissionPlan(
  input: MissionPlannerInput,
): Promise<MissionPlannerOutput> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY non configurata.",
    );
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response =
    await client.responses.create({
      model:
        process.env
          .OPENAI_INTELLIGENCE_MODEL ||
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

MISSIONE APPROVATA

${JSON.stringify(input.mission, null, 2)}

BUSINESS MEMORY

${JSON.stringify(input.businessMemory, null, 2)}

KNOWLEDGE GRAPH

${JSON.stringify(input.knowledgeNodes, null, 2)}

EVIDENZE

${JSON.stringify(input.evidence, null, 2)}

INTEGRAZIONI

${JSON.stringify(input.integrations, null, 2)}

AUTOMAZIONI ESISTENTI

${JSON.stringify(input.existingAutomations, null, 2)}

Genera un piano operativo e blueprint non duplicati.
`,
        },
      ],

      text: {
        format: {
          type: "json_schema",
          name:
            "uviq_mission_operating_plan",

          strict: true,

          schema: z.toJSONSchema(
            MissionPlannerOutputSchema,
            {
              target: "draft-7",
            },
          ),
        },
      },
    });

  if (!response.output_text) {
    throw new Error(
      "Mission Planner non ha restituito un output.",
    );
  }

  return MissionPlannerOutputSchema.parse(
    JSON.parse(response.output_text),
  );
}

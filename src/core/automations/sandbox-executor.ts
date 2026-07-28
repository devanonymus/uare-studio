import OpenAI from "openai";
import { z } from "zod";
import {
  AutomationExecutionOutputSchema,
  type AutomationExecutionOutput,
} from "@/core/automations/execution-schema";

type Blueprint = {
  id: string;
  name: string;
  objective: string;
  status: string;
  risk_level: string;
  approval_required: boolean;
  trigger_definition: unknown;
  action_definition: unknown;
  safeguards: unknown;
};

type Business = {
  id: string;
  name: string;
  sector: string;
  city: string | null;
  website_url: string | null;
  primary_goal: string | null;
};

const SYSTEM_PROMPT = `
Sei UVIQ Automation Executor.

Esegui esclusivamente in modalità SANDBOX.

Il tuo compito è trasformare un blueprint approvato in:
- piano operativo;
- materiali in bozza;
- task;
- checklist;
- controlli di sicurezza;
- azioni esterne bloccate.

REGOLE OBBLIGATORIE

1. Non dichiarare di avere pubblicato contenuti.
2. Non dichiarare di avere inviato email o WhatsApp.
3. Non dichiarare di avere modificato campagne.
4. Non dichiarare di avere speso budget.
5. Non dichiarare di avere modificato siti o prezzi.
6. Tutti i materiali generati hanno stato "draft".
7. Le azioni Meta, Google, WhatsApp, email, CRM o CMS devono essere
   inserite in blockedExternalActions.
8. Non inventare metriche, risultati, clienti o dati di mercato.
9. Se mancano dati, segnalarlo nelle limitazioni.
10. Ogni output deve essere specifico per l’azienda e coerente con
    obiettivo, settore e Business Memory.
`;

export async function executeAutomationInSandbox({
  blueprint,
  business,
  businessMemory,
  context,
}: {
  blueprint: Blueprint;
  business: Business;
  businessMemory: unknown[];
  context: Record<string, unknown>;
}): Promise<AutomationExecutionOutput> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY non configurata.",
    );
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
AZIENDA

${JSON.stringify(business, null, 2)}

BUSINESS MEMORY

${JSON.stringify(businessMemory, null, 2)}

BLUEPRINT APPROVATO

${JSON.stringify(
  {
    id: blueprint.id,
    name: blueprint.name,
    objective: blueprint.objective,
    riskLevel: blueprint.risk_level,
    trigger: blueprint.trigger_definition,
    actions: blueprint.action_definition,
    safeguards: blueprint.safeguards,
  },
  null,
  2,
)}

CONTESTO DELL'ESECUZIONE

${JSON.stringify(context, null, 2)}

COMPITO

1. Esegui internamente tutte le attività di analisi e generazione.
2. Crea materiali specifici e utilizzabili, ma soltanto in bozza.
3. Blocca ogni azione che produce effetti su sistemi esterni.
4. Verifica coerenza, autorizzazioni e dati mancanti.
5. Indica esattamente cosa deve fare l’utente dopo la revisione.
`;

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
          content: prompt,
        },
      ],

      text: {
        format: {
          type: "json_schema",
          name:
            "uviq_automation_sandbox_execution",
          description:
            "Risultato strutturato dell’esecuzione sandbox UVIQ.",
          strict: true,
          schema: z.toJSONSchema(
            AutomationExecutionOutputSchema,
            {
              target: "draft-7",
            },
          ),
        },
      },
    });

  if (!response.output_text) {
    throw new Error(
      "L’Automation Executor non ha restituito un output.",
    );
  }

  return AutomationExecutionOutputSchema.parse(
    JSON.parse(response.output_text),
  );
}

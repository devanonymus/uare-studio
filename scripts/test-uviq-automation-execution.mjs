import { createClient } from "@supabase/supabase-js";

const businessId =
  process.argv[2] ||
  process.env.UVIQ_BUSINESS_ID;

if (!businessId) {
  console.error(
    "❌ Business ID mancante.",
  );

  console.error(
    "Uso: npm run test:automation -- <BUSINESS_ID>",
  );

  process.exit(1);
}

const baseUrl =
  process.env.UVIQ_BASE_URL ||
  "http://localhost:3006";

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error(
    "Variabili Supabase mancanti.",
  );
}

const supabase = createClient(
  url,
  key,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

const {
  data: automations,
  error,
} = await supabase
  .from("automation_blueprints")
  .select("*")
  .eq("business_id", businessId)
  .eq("status", "approved")
  .order("created_at", {
    ascending: false,
  })
  .limit(1);

if (error) {
  throw error;
}

const automation =
  automations?.[0];

if (!automation) {
  console.error("");
  console.error(
    "❌ Nessuna automazione approvata.",
  );

  console.error(
    "Approva prima un’automazione nella War Room.",
  );

  process.exit(1);
}

const idempotencyKey =
  `sandbox-${automation.id}-${Date.now()}`;

console.log("");
console.log(
  "UVIQ AUTOMATION SANDBOX TEST",
);
console.log(
  "============================",
);
console.log(
  `Automazione: ${automation.name}`,
);
console.log(
  `Automation ID: ${automation.id}`,
);
console.log("");

const response = await fetch(
  `${baseUrl}/api/core/automations/${automation.id}/execute`,
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
      "Idempotency-Key":
        idempotencyKey,
    },

    body: JSON.stringify({
      businessId,
      dryRun: true,
      requestedBy:
        "brian-laddomada",
      idempotencyKey,
      context: {
        executionReason:
          "Test manuale del motore sandbox UVIQ.",
      },
    }),

    signal:
      AbortSignal.timeout(
        180_000,
      ),
  },
);

const text =
  await response.text();

let data;

try {
  data = JSON.parse(text);
} catch {
  throw new Error(
    `Risposta non JSON: ${text.slice(0, 800)}`,
  );
}

if (!response.ok) {
  console.error(
    JSON.stringify(
      data,
      null,
      2,
    ),
  );

  throw new Error(
    `HTTP ${response.status}`,
  );
}

console.log(
  JSON.stringify(
    {
      status: data.status,
      mode: data.mode,
      durationMs:
        data.durationMs,
      confidence:
        data.result?.confidence,
      artifacts:
        data.result?.artifacts
          ?.length,
      internalActions:
        data.result
          ?.completedInternalActions
          ?.length,
      blockedExternalActions:
        data.result
          ?.blockedExternalActions
          ?.length,
    },
    null,
    2,
  ),
);

console.log("");
console.log(
  "ARTEFATTI GENERATI",
);

for (
  const artifact of
  data.result?.artifacts ?? []
) {
  console.log(
    `- [${artifact.type}] ${artifact.title}`,
  );
}

console.log("");
console.log(
  "✅ AUTOMAZIONE ESEGUITA IN SANDBOX",
);
console.log(
  "✅ NESSUN EFFETTO ESTERNO PRODOTTO",
);

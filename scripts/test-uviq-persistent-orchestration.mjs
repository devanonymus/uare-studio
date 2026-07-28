const businessId =
  process.argv[2] ||
  process.env.UVIQ_BUSINESS_ID;

if (!businessId) {
  console.error("");
  console.error(
    "❌ Business ID mancante.",
  );

  console.error("");
  console.error(
    "Uso:",
  );

  console.error(
    "npm run test:orchestrate:persist -- <BUSINESS_ID>",
  );

  process.exit(1);
}

const baseUrl =
  process.env.UVIQ_BASE_URL ||
  "http://localhost:3006";

const idempotencyKey =
  process.argv[3] ||
  `manual-${businessId}-${Date.now()}`;

const payload = {
  businessId,

  primaryGoal:
    "Individuare opportunità concrete, studiare mercato e competitor e generare missioni da sottoporre all’utente.",

  notes:
    "Prima orchestrazione persistente UVIQ con approvazione umana obbligatoria.",

  idempotencyKey,
};

console.log("");
console.log(
  "UVIQ PERSISTENT ORCHESTRATION",
);

console.log(
  "=============================",
);

console.log(
  `Business ID: ${businessId}`,
);

console.log(
  `Idempotency Key: ${idempotencyKey}`,
);

console.log("");

const response = await fetch(
  `${baseUrl}/api/ai/orchestrate-and-persist`,
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",

      "Idempotency-Key":
        idempotencyKey,
    },

    body: JSON.stringify(payload),

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
    `Risposta non JSON: ${text.slice(0, 1000)}`,
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
      cached: data.cached,
      durationMs:
        data.durationMs,
      persistence:
        data.persistence,
      confidence:
        data.orchestration
          ?.confidence,
      missions:
        data.orchestration
          ?.missions?.length,
      automations:
        data.orchestration
          ?.automationProposals
          ?.length,
    },
    null,
    2,
  ),
);

console.log("");
console.log(
  "✅ ORCHESTRAZIONE SALVATA NEL CORE",
);

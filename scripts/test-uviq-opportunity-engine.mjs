const businessId =
  process.argv[2] ||
  process.env.UVIQ_BUSINESS_ID;

if (!businessId) {
  throw new Error("Business ID mancante.");
}

const baseUrl =
  process.env.UVIQ_BASE_URL ||
  "http://localhost:3006";

const idempotencyKey =
  `opportunity-test-${businessId}-${Date.now()}`;

console.log("");
console.log("UVIQ OPPORTUNITY ENGINE TEST");
console.log("============================");
console.log(`Business ID: ${businessId}`);
console.log("");

const response = await fetch(
  `${baseUrl}/api/core/opportunities/generate`,
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },

    body: JSON.stringify({
      businessId,
      idempotencyKey,
    }),

    signal: AbortSignal.timeout(240_000),
  },
);

const data = await response.json();

if (!response.ok) {
  console.error(
    JSON.stringify(data, null, 2),
  );

  throw new Error(
    `Opportunity Engine HTTP ${response.status}`,
  );
}

console.log(
  JSON.stringify(
    {
      status: data.status,
      runId: data.runId,
      opportunities:
        data.opportunities?.length ?? 0,
      confidence:
        data.analysis?.analysisConfidence,
      durationMs: data.durationMs,
    },
    null,
    2,
  ),
);

console.log("");
console.log("OPPORTUNITÀ GENERATE");

for (const opportunity of data.opportunities ?? []) {
  console.log(
    `- [P${opportunity.priority}] ${opportunity.title}`,
  );
}

console.log("");
console.log(
  "✅ BUSINESS OPPORTUNITY ENGINE OPERATIVO",
);

const businessId =
  process.argv[2] ||
  process.env.UVIQ_BUSINESS_ID;

if (!businessId) {
  throw new Error(
    "Business ID mancante.",
  );
}

const baseUrl =
  process.env.UVIQ_BASE_URL ||
  "http://localhost:3006";

console.log("");
console.log(
  "UVIQ STRATEGIC ADVISOR TEST",
);
console.log(
  "===========================",
);
console.log(
  `Business ID: ${businessId}`,
);
console.log("");

const response = await fetch(
  `${baseUrl}/api/core/strategic-advisor`,
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({
      businessId,
    }),
  },
);

const payload =
  await response.json();

if (!response.ok) {
  console.error(
    JSON.stringify(
      payload,
      null,
      2,
    ),
  );

  process.exit(1);
}

const brief = payload.brief;

console.log(
  JSON.stringify(
    {
      status: payload.status,
      briefId: brief.id,
      healthScore:
        brief.business_health_score,
      confidence:
        brief.confidence,
      priorities:
        brief.priorities?.length ?? 0,
      alerts:
        brief.alerts?.length ?? 0,
      recommendations:
        brief.recommendations?.length ??
        0,
      durationMs:
        payload.durationMs,
    },
    null,
    2,
  ),
);

console.log("");
console.log("PRIORITÀ DI OGGI");

for (
  const priority of
    brief.priorities ?? []
) {
  console.log(
    `${priority.rank}. [${priority.urgency}] ${priority.title}`,
  );
}

console.log("");
console.log(
  "✅ DAILY STRATEGIC ADVISOR OPERATIVO",
);

const baseUrl =
  process.env.UVIQ_BASE_URL ||
  "http://localhost:3006";

const payload = {
  organisation: {
    name: "Univibe Group",
    legalName: "Univibe Group",
    countryCode: "IT",
    timezone: "Europe/Rome",
  },

  business: {
    name: "Yammy Ristorante Giapponese",
    sector: "Ristorazione",
    city: "Martina Franca",
    websiteUrl:
      "https://www.yammyristorantegiapponese.com",
    primaryGoal:
      "Aumentare prenotazioni, conversioni e continuità del marketing.",
    lifecycleStage: "prospect",
  },

  memory: [
    {
      category: "identity",
      memoryKey: "business_model",
      value: {
        type: "ristorante giapponese",
        market: "locale",
      },
      status: "verified",
      confidence: 1,
      sourceType: "user",
      sourceReference:
        "Business Discovery iniziale",
      createdBy: "brian-laddomada",
    },

    {
      category: "commercial",
      memoryKey: "primary_goal",
      value: {
        goal:
          "Aumentare prenotazioni e conversioni digitali",
      },
      status: "verified",
      confidence: 1,
      sourceType: "user",
      sourceReference:
        "Obiettivo indicato nel progetto",
      createdBy: "brian-laddomada",
    },

    {
      category: "digital_presence",
      memoryKey: "website",
      value: {
        url:
          "https://www.yammyristorantegiapponese.com",
      },
      status: "verified",
      confidence: 1,
      sourceType: "user",
      sourceReference:
        "URL fornito nel progetto",
      createdBy: "brian-laddomada",
    },

    {
      category: "governance",
      memoryKey: "approval_policy",
      value: {
        humanApprovalRequired: true,
        automaticPublishingAllowed: false,
        automaticMessagingAllowed: false,
        campaignBudgetChangesAllowed: false,
      },
      status: "verified",
      confidence: 1,
      sourceType: "system",
      sourceReference:
        "UVIQ Trust Policy",
      createdBy: "uviq-core",
    },

    {
      category: "intelligence",
      memoryKey: "competitor_analysis",
      value: {
        status: "not_started",
      },
      status: "missing",
      confidence: 0,
      sourceType: "system",
      sourceReference:
        "Competitor Intelligence non ancora eseguita",
      createdBy: "uviq-core",
    },
  ],
};

console.log("");
console.log("UVIQ CORE BOOTSTRAP");
console.log("===================");
console.log(`Endpoint: ${baseUrl}/api/core/bootstrap`);
console.log(`Azienda: ${payload.business.name}`);
console.log("");

const response = await fetch(
  `${baseUrl}/api/core/bootstrap`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30_000),
  },
);

const text = await response.text();

let data;

try {
  data = JSON.parse(text);
} catch {
  throw new Error(
    `Risposta non JSON: ${text.slice(0, 500)}`,
  );
}

if (!response.ok) {
  console.error(
    JSON.stringify(data, null, 2),
  );

  throw new Error(
    `Bootstrap fallito: HTTP ${response.status}`,
  );
}

console.log("✅ WORKSPACE CREATO");
console.log("");
console.log(
  `Organisation ID: ${data.organisation.id}`,
);
console.log(
  `Business ID: ${data.business.id}`,
);
console.log(
  `Memorie create: ${data.memoryEntries.length}`,
);
console.log(`Trace ID: ${data.traceId}`);
console.log("");

console.log(
  "Conserva il Business ID: servirà per orchestratore, missioni e automazioni.",
);

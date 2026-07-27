const baseUrl =
  process.env.UVIQ_BASE_URL ||
  "http://localhost:3006";

const payload = {
  businessName:
    process.argv[2] ||
    "Yammy Ristorante Giapponese",

  sector:
    process.argv[3] ||
    "ristorazione",

  city:
    process.argv[4] ||
    "Martina Franca",

  website:
    process.argv[5] ||
    "https://www.yammyristorantegiapponese.com",

  primaryGoal:
    process.argv[6] ||
    "Aumentare prenotazioni e rendere il marketing più continuativo.",

  notes:
    "Prima esecuzione reale del motore UVIQ Orchestrator.",

  discovery: {
    businessModel:
      "Ristorante giapponese",
    mainProblem:
      "Presenza digitale da analizzare e processo commerciale da strutturare.",
    humanApprovalRequired: true,
    automaticPublishingAllowed: false,
    automaticMessagingAllowed: false,
  },
};

console.log("");
console.log("UVIQ ORCHESTRATOR TEST");
console.log("======================");
console.log(`Endpoint: ${baseUrl}/api/ai/orchestrate`);
console.log(`Azienda: ${payload.businessName}`);
console.log("");

const controller = new AbortController();

const timeout = setTimeout(
  () => controller.abort(),
  120_000,
);

try {
  const response = await fetch(
    `${baseUrl}/api/ai/orchestrate`,
    {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(payload),
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

  const result = data.result;

  console.log("✅ ORCHESTRAZIONE COMPLETATA");
  console.log("");
  console.log(`Run ID: ${result.runId}`);
  console.log(
    `Confidence: ${Math.round(
      result.confidence * 100,
    )}%`,
  );
  console.log(
    `Missioni: ${result.missions.length}`,
  );
  console.log(
    `Automazioni proposte: ${result.automationProposals.length}`,
  );
  console.log(
    `Agenti consigliati: ${result.recommendedAgents.length}`,
  );
  console.log(
    `Durata API: ${data.durationMs} ms`,
  );

  console.log("");
  console.log("DIAGNOSI");
  console.log(result.strategicDiagnosis);

  console.log("");
  console.log("MISSIONI");
  result.missions.forEach(
    (mission, index) => {
      console.log(
        `${index + 1}. [P${mission.priority}] ${mission.title}`,
      );
      console.log(
        `   Agent: ${mission.ownerAgent}`,
      );
      console.log(
        `   Approval: ${mission.approvalRequired ? "Sì" : "No"}`,
      );
    },
  );

  console.log("");
  console.log("AUTOMAZIONI");
  result.automationProposals.forEach(
    (automation, index) => {
      console.log(
        `${index + 1}. ${automation.name}`,
      );
      console.log(
        `   Rischio: ${automation.riskLevel}`,
      );
      console.log(
        `   Approval: ${automation.approvalRequired ? "Sì" : "No"}`,
      );
    },
  );

  console.log("");
  console.log(
    "✅ Test terminato correttamente.",
  );
} catch (error) {
  console.error("");
  console.error(
    "❌ TEST ORCHESTRATOR FALLITO",
  );

  console.error(
    error instanceof Error
      ? error.message
      : error,
  );

  process.exitCode = 1;
} finally {
  clearTimeout(timeout);
}

const baseUrl =
  process.env.UVIQ_BASE_URL ||
  "http://localhost:3006";

console.log("");
console.log("UVIQ CORE TEST");
console.log("==============");
console.log(`Endpoint: ${baseUrl}/api/core/health`);
console.log("");

try {
  const response = await fetch(
    `${baseUrl}/api/core/health`,
    {
      signal: AbortSignal.timeout(15_000),
    },
  );

  const data = await response.json();

  console.log(
    JSON.stringify(data, null, 2),
  );

  if (
    response.status === 503 &&
    data.status ===
      "configuration_required"
  ) {
    console.log("");
    console.log(
      "⚠️ Core installato, ma Supabase deve essere configurato.",
    );

    process.exitCode = 2;
  } else if (!response.ok) {
    throw new Error(
      `Core non disponibile: HTTP ${response.status}`,
    );
  } else {
    console.log("");
    console.log(
      "✅ UVIQ CORE OPERATIVO",
    );
  }
} catch (error) {
  console.error("");
  console.error(
    "❌ TEST UVIQ CORE FALLITO",
  );

  console.error(
    error instanceof Error
      ? error.message
      : error,
  );

  process.exitCode = 1;
}

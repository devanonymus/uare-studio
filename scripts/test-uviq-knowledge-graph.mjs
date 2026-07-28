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
  "UVIQ KNOWLEDGE GRAPH TEST",
);
console.log(
  "=========================",
);

const buildResponse =
  await fetch(
    `${baseUrl}/api/core/knowledge-graph`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        businessId,
      }),

      signal:
        AbortSignal.timeout(
          90_000,
        ),
    },
  );

const buildData =
  await buildResponse.json();

if (!buildResponse.ok) {
  console.error(buildData);
  throw new Error(
    `Build HTTP ${buildResponse.status}`,
  );
}

const readResponse =
  await fetch(
    `${baseUrl}/api/core/knowledge-graph?businessId=${businessId}`,
    {
      signal:
        AbortSignal.timeout(
          30_000,
        ),
    },
  );

const graph =
  await readResponse.json();

if (!readResponse.ok) {
  console.error(graph);
  throw new Error(
    `Read HTTP ${readResponse.status}`,
  );
}

console.log(
  JSON.stringify(
    {
      snapshot:
        buildData.result.snapshotId,

      nodes:
        graph.nodes.length,

      edges:
        graph.edges.length,

      sourceCounts:
        buildData.result.sourceCounts,
    },
    null,
    2,
  ),
);

console.log("");
console.log(
  "✅ KNOWLEDGE GRAPH OPERATIVO",
);

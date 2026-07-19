import fs from "node:fs";
import path from "node:path";

const researchDirectory = path.join(
  process.cwd(),
  "public",
  "generated",
  "research",
);

const requestedRunId = process.argv[2];
const restaurantName = process.argv[3] || "Ristorante";

function getLatestRunId() {
  const directories = fs
    .readdirSync(researchDirectory, {
      withFileTypes: true,
    })
    .filter((item) => item.isDirectory())
    .map((item) => ({
      name: item.name,
      time: fs.statSync(
        path.join(researchDirectory, item.name),
      ).mtimeMs,
    }))
    .sort((first, second) => second.time - first.time);

  if (!directories[0]) {
    throw new Error(
      "Nessuna analisi screenshot disponibile.",
    );
  }

  return directories[0].name;
}

const runId = requestedRunId || getLatestRunId();

console.log(`Analisi Vision run: ${runId}`);
console.log(`Ristorante: ${restaurantName}`);

const response = await fetch(
  "http://localhost:3006/api/research/vision",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      runId,
      restaurantName,
    }),
  },
);

const payload = await response.json();

console.log(JSON.stringify(payload, null, 2));

if (!response.ok) {
  process.exit(1);
}

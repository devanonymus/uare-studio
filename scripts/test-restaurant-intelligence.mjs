import fs from "node:fs";
import path from "node:path";

const researchDirectory = path.join(
  process.cwd(),
  "public",
  "generated",
  "research",
);

const requestedRunId = process.argv[2];
const restaurantName =
  process.argv[3] || "Ristorante non specificato";
const city = process.argv[4] || "";
const website = process.argv[5] || "";

function findLatestValidRun() {
  const directories = fs
    .readdirSync(researchDirectory, {
      withFileTypes: true,
    })
    .filter((item) => item.isDirectory())
    .map((item) => ({
      name: item.name,
      directory: path.join(researchDirectory, item.name),
    }))
    .filter(
      (item) =>
        fs.existsSync(
          path.join(item.directory, "evidence.json"),
        ) &&
        fs.existsSync(
          path.join(
            item.directory,
            "vision-analysis.json",
          ),
        ),
    )
    .map((item) => ({
      ...item,
      modifiedAt: fs.statSync(item.directory).mtimeMs,
    }))
    .sort(
      (first, second) =>
        second.modifiedAt - first.modifiedAt,
    );

  if (!directories[0]) {
    throw new Error(
      "Nessuna analisi completa con evidence.json e vision-analysis.json.",
    );
  }

  return directories[0].name;
}

const runId = requestedRunId || findLatestValidRun();

console.log("");
console.log("UAE RESTAURANT INTELLIGENCE");
console.log(`Run: ${runId}`);
console.log(`Ristorante: ${restaurantName}`);
console.log(`Città: ${city || "non indicata"}`);
console.log("");

const response = await fetch(
  "http://localhost:3006/api/research/restaurant-intelligence",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      runId,
      restaurantName,
      city,
      website,
    }),
  },
);

const payload = await response.json();

console.log(JSON.stringify(payload, null, 2));

if (!response.ok) {
  process.exit(1);
}

console.log("");
console.log("✅ Restaurant Intelligence completata");
console.log(
  `File: public/generated/research/${runId}/restaurant-intelligence.json`,
);

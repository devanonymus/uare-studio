const url = process.argv[2];
const projectName = process.argv[3] || "UAE Test";

if (!url) {
  console.error(
    "Uso: node scripts/test-screenshot-engine.mjs https://sito.it \"Nome progetto\"",
  );
  process.exit(1);
}

const response = await fetch(
  "http://localhost:3006/api/research/screenshot",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      projectName,
    }),
  },
);

const payload = await response.json();

console.log(JSON.stringify(payload, null, 2));

if (!response.ok) {
  process.exit(1);
}

import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL =
  process.env.UVIQ_URL || "http://localhost:3006";

const OUTPUT_DIR = path.resolve(
  process.cwd(),
  "artifacts/e2e-uviq",
);

await fs.mkdir(OUTPUT_DIR, {
  recursive: true,
});

const browser = await chromium.launch({
  headless: false,
  slowMo: 120,
});

const context = await browser.newContext({
  viewport: {
    width: 1536,
    height: 960,
  },
  locale: "it-IT",
});

const page = await context.newPage();

page.on("console", (message) => {
  if (message.type() === "error") {
    console.error(
      `🌐 Browser console error: ${message.text()}`,
    );
  }
});

page.on("pageerror", (error) => {
  console.error(
    `🌐 Browser page error: ${error.message}`,
  );
});

async function screenshot(name) {
  const filepath = path.join(
    OUTPUT_DIR,
    `${name}.png`,
  );

  await page.screenshot({
    path: filepath,
    fullPage: true,
  });

  console.log(`📸 ${filepath}`);
}

async function step(label, callback) {
  console.log(`\n▶ ${label}`);

  try {
    await callback();
    console.log(`✅ ${label}`);
  } catch (error) {
    console.error(`❌ ${label}`);
    console.error(error);

    await screenshot(
      `error-${Date.now()}`,
    );

    throw error;
  }
}

try {
  await step(
    "Verifica server UVIQ",
    async () => {
      const response = await page.request.get(
        BASE_URL,
      );

      if (!response.ok()) {
        throw new Error(
          `Server non disponibile: ${response.status()}`,
        );
      }
    },
  );

  await step(
    "Apertura selezione settore",
    async () => {
      await page.goto(
        `${BASE_URL}/projects/new`,
        {
          waitUntil: "networkidle",
        },
      );

      await page
        .getByText(
          "Seleziona il settore",
          {
            exact: false,
          },
        )
        .first()
        .waitFor();

      await screenshot(
        "01-sector-selector",
      );
    },
  );

  await step(
    "Selezione Sanità e benessere",
    async () => {
      const healthcareButton =
        page.getByRole("button", {
          name: /Sanità e benessere/i,
        });

      await healthcareButton.waitFor({
        state: "visible",
      });

      await healthcareButton.click();

      await page.waitForURL(
        "**/projects/new/healthcare",
      );

      await page
        .getByText(
          "Business discovery",
          {
            exact: false,
          },
        )
        .first()
        .waitFor();

      await screenshot(
        "02-business-discovery-empty",
      );
    },
  );

  await step(
    "Compilazione Business Discovery",
    async () => {
      await page
        .getByPlaceholder(
          "Es. Studio Alfa Srl",
        )
        .fill("Studio Medico Aurora");

      await page
        .getByPlaceholder(
          "https://azienda.it",
        )
        .fill(
          "https://www.studiomedicoaurora.it",
        );

      await page
        .getByPlaceholder(
          "Es. Taranto e provincia",
        )
        .fill("Taranto e provincia");

      await page
        .getByPlaceholder(
          "Nome del referente",
        )
        .fill("Dott.ssa Laura Bianchi");

      await page
        .getByPlaceholder(
          "Clienti ideali dell’attività",
        )
        .fill(
          "Adulti e famiglie tra 30 e 65 anni",
        );

      await page
        .getByPlaceholder(
          /Problemi percepiti/i,
        )
        .fill(
          [
            "Lo studio vuole aumentare le prenotazioni.",
            "Il sito attuale è poco moderno.",
            "Non esistono automazioni di follow-up.",
            "La gestione social è discontinua.",
            "Serve un sistema per richieste, reminder e recensioni.",
          ].join(" "),
        );

      await screenshot(
        "03-business-discovery-complete",
      );

      const completionText =
        page.getByText("100%", {
          exact: true,
        });

      if (
        await completionText.count()
      ) {
        console.log(
          "✅ Profilo completato al 100%",
        );
      }
    },
  );

  await step(
    "Avvio Business Intelligence",
    async () => {
      await page
        .getByRole("button", {
          name: /Generate Business Intelligence/i,
        })
        .click();

      await page.waitForURL(
        "**/audits/new?sector=healthcare",
      );

      await page
        .getByText(
          "Configura il reparto",
          {
            exact: false,
          },
        )
        .waitFor();

      await screenshot(
        "04-intelligence-setup",
      );
    },
  );

  await step(
    "Configurazione fonti digitali",
    async () => {
      const instagram =
        page.getByPlaceholder("@profilo");

      if (
        await instagram.count()
      ) {
        await instagram
          .first()
          .fill("@studiomedicoaurora");
      }

      const googleBusiness =
        page.getByPlaceholder(
          "Link della scheda",
        );

      if (
        await googleBusiness.count()
      ) {
        await googleBusiness.fill(
          "https://google.com/maps",
        );
      }

      const facebook =
        page.getByPlaceholder(
          "Link della pagina",
        );

      if (
        await facebook.count()
      ) {
        await facebook.fill(
          "https://facebook.com/studiomedicoaurora",
        );
      }

      await screenshot(
        "05-intelligence-configured",
      );
    },
  );

  await step(
    "Avvio UVIQ Intelligence",
    async () => {
      await page
        .getByRole("button", {
          name: /Avvia UVIQ Intelligence/i,
        })
        .click();

      await page.waitForURL(
        "**/audits/analysis",
      );

      await page
        .getByText(
          "Research Intelligence",
          {
            exact: true,
          },
        )
        .waitFor({
          timeout: 15_000,
        });

      await screenshot(
        "06-war-room-start",
      );
    },
  );

  await step(
    "Monitoraggio agenti",
    async () => {
      await page
        .getByText("Research Agent", {
          exact: true,
        })
        .waitFor();

      await page
        .getByText("Automation Agent", {
          exact: true,
        })
        .waitFor();

      await page.waitForTimeout(4_000);

      await screenshot(
        "07-war-room-processing",
      );
    },
  );

  await step(
    "Attesa Business Twin",
    async () => {
      await page
        .getByText("Business Twin", {
          exact: true,
        })
        .waitFor({
          timeout: 45_000,
        });

      await page
        .getByText(
          "Studio Medico Aurora",
          {
            exact: true,
          },
        )
        .waitFor({
          timeout: 10_000,
        });

      await screenshot(
        "08-business-twin",
      );
    },
  );

  await step(
    "Apertura Growth Plan",
    async () => {
      const growthButton =
        page.getByRole("link", {
          name: /Crea piano operativo|Genera roadmap/i,
        });

      await growthButton
        .first()
        .click();

      await page.waitForURL(
        "**/growth-plan",
      );

      await page.waitForTimeout(1_000);

      await screenshot(
        "09-growth-plan",
      );
    },
  );

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ UVIQ END-TO-END TEST COMPLETATO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Flusso verificato:

✓ Selezione settore
✓ Business Discovery
✓ Salvataggio dati
✓ Intelligence Setup
✓ War Room
✓ Agenti AI
✓ Business Twin
✓ Growth Plan

Screenshot:
${OUTPUT_DIR}
`);
} catch (error) {
  console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ UVIQ END-TO-END TEST FALLITO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  process.exitCode = 1;
} finally {
  await page.waitForTimeout(2_000);
  await browser.close();
}

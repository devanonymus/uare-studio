import { promises as dns } from "node:dns";
import { promises as fs } from "node:fs";
import path from "node:path";
import { chromium, type Browser, type Page } from "playwright";

export type ScreenshotViewport = {
  name: "desktop" | "mobile";
  width: number;
  height: number;
};

export type ScreenshotArtifact = {
  type: "desktop" | "mobile" | "hero";
  relativePath: string;
  publicUrl: string;
  width: number;
  height: number;
  fullPage: boolean;
};

export type BrowserPageEvidence = {
  requestedUrl: string;
  finalUrl: string;
  title: string;
  statusCode: number | null;
  capturedAt: string;
  loadTimeMs: number;
  viewportArtifacts: ScreenshotArtifact[];
  pageMetrics: {
    documentWidth: number;
    documentHeight: number;
    bodyTextLength: number;
    imageCount: number;
    linkCount: number;
    buttonCount: number;
    headingCount: number;
    formCount: number;
    inputCount: number;
    hasHorizontalOverflow: boolean;
  };
  visualSignals: {
    heroHeading: string;
    primaryButtons: string[];
    dominantBackgrounds: string[];
    visibleTextSample: string;
  };
  errors: string[];
};

const viewports: ScreenshotViewport[] = [
  {
    name: "desktop",
    width: 1440,
    height: 1000,
  },
  {
    name: "mobile",
    width: 390,
    height: 844,
  },
];

function isPrivateIpv4(address: string): boolean {
  const parts = address.split(".").map(Number);

  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    return false;
  }

  const [first, second] = parts;

  return (
    first === 10 ||
    first === 127 ||
    first === 0 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}

function isPrivateIpv6(address: string): boolean {
  const normalized = address.toLowerCase();

  return (
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:")
  );
}

async function validatePublicUrl(rawUrl: string): Promise<URL> {
  const trimmed = rawUrl.trim();

  if (!trimmed) {
    throw new Error("Inserisci un URL valido.");
  }

  const value = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  const parsed = new URL(value);

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Sono consentiti soltanto URL HTTP o HTTPS.");
  }

  const hostname = parsed.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "0.0.0.0"
  ) {
    throw new Error("Gli indirizzi locali non possono essere analizzati.");
  }

  const addresses = await dns.lookup(hostname, {
    all: true,
    verbatim: true,
  });

  if (addresses.length === 0) {
    throw new Error("Il dominio non può essere risolto.");
  }

  for (const result of addresses) {
    const privateAddress =
      result.family === 4
        ? isPrivateIpv4(result.address)
        : isPrivateIpv6(result.address);

    if (privateAddress) {
      throw new Error(
        "Il dominio risolve verso una rete privata e non può essere analizzato.",
      );
    }
  }

  return parsed;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

async function preparePage(
  page: Page,
  viewport: ScreenshotViewport,
): Promise<void> {
  await page.setViewportSize({
    width: viewport.width,
    height: viewport.height,
  });

  await page.emulateMedia({
    colorScheme: "light",
    reducedMotion: "reduce",
  });

  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }

      html {
        scroll-behavior: auto !important;
      }
    `,
  });
}

async function dismissCommonDialogs(page: Page): Promise<void> {
  const labels = [
    "Accetta",
    "Accetta tutto",
    "Accetto",
    "Accept",
    "Accept all",
    "Consenti",
    "Continua",
    "Chiudi",
    "Close",
    "OK",
  ];

  for (const label of labels) {
    try {
      const button = page.getByRole("button", {
        name: new RegExp(`^${label}$`, "i"),
      });

      if (await button.first().isVisible({ timeout: 300 })) {
        await button.first().click({
          timeout: 800,
        });
      }
    } catch {
      // Il dialogo non è presente oppure non è cliccabile.
    }
  }

  try {
    await page.keyboard.press("Escape");
  } catch {
    // Nessuna azione necessaria.
  }
}

async function autoScroll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let position = 0;
      const step = 650;
      const interval = window.setInterval(() => {
        window.scrollTo(0, position);
        position += step;

        if (position >= document.documentElement.scrollHeight) {
          window.clearInterval(interval);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 80);
    });
  });
}

async function collectPageMetrics(page: Page) {
  return page.evaluate(() => {
    const normalizedText = document.body?.innerText
      ?.replace(/\s+/g, " ")
      .trim() ?? "";

    const buttons = Array.from(
      document.querySelectorAll<HTMLElement>(
        "button, a[role='button'], input[type='submit']",
      ),
    )
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const box = element.getBoundingClientRect();

        return (
          style.visibility !== "hidden" &&
          style.display !== "none" &&
          box.width > 0 &&
          box.height > 0
        );
      })
      .map((element) => {
        if (element instanceof HTMLInputElement) {
          return element.value.trim();
        }

        return element.innerText.trim();
      })
      .filter(Boolean)
      .slice(0, 12);

    const backgrounds = Array.from(
      document.querySelectorAll<HTMLElement>(
        "body, header, nav, main, section, footer",
      ),
    )
      .map((element) => window.getComputedStyle(element).backgroundColor)
      .filter(
        (color) =>
          color &&
          color !== "rgba(0, 0, 0, 0)" &&
          color !== "transparent",
      );

    const heading =
      document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim() ??
      "";

    return {
      pageMetrics: {
        documentWidth: document.documentElement.scrollWidth,
        documentHeight: document.documentElement.scrollHeight,
        bodyTextLength: normalizedText.length,
        imageCount: document.images.length,
        linkCount: document.links.length,
        buttonCount: document.querySelectorAll(
          "button, a[role='button'], input[type='submit']",
        ).length,
        headingCount: document.querySelectorAll(
          "h1, h2, h3, h4, h5, h6",
        ).length,
        formCount: document.forms.length,
        inputCount: document.querySelectorAll(
          "input, textarea, select",
        ).length,
        hasHorizontalOverflow:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 4,
      },
      visualSignals: {
        heroHeading: heading.slice(0, 300),
        primaryButtons: [...new Set(buttons)].slice(0, 10),
        dominantBackgrounds: [...new Set(backgrounds)].slice(0, 8),
        visibleTextSample: normalizedText.slice(0, 2200),
      },
    };
  });
}

export async function captureWebsiteScreenshots(
  rawUrl: string,
  projectName?: string,
): Promise<BrowserPageEvidence> {
  const validatedUrl = await validatePublicUrl(rawUrl);

  const runId = `${Date.now()}-${slugify(
    projectName || validatedUrl.hostname,
  )}`;

  const outputDirectory = path.join(
    process.cwd(),
    "public",
    "generated",
    "research",
    runId,
  );

  await fs.mkdir(outputDirectory, {
    recursive: true,
  });

  let browser: Browser | null = null;
  const artifacts: ScreenshotArtifact[] = [];
  const errors: string[] = [];

  let title = "";
  let finalUrl = validatedUrl.href;
  let statusCode: number | null = null;
  let loadTimeMs = 0;

  let collectedMetrics: Awaited<
    ReturnType<typeof collectPageMetrics>
  > | null = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        "--disable-dev-shm-usage",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-renderer-backgrounding",
      ],
    });

    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: {
          width: viewport.width,
          height: viewport.height,
        },
        deviceScaleFactor: 1,
        locale: "it-IT",
        timezoneId: "Europe/Rome",
        userAgent:
          viewport.name === "mobile"
            ? "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1 UAEIntelligence/1.0"
            : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/138 Safari/537.36 UAEIntelligence/1.0",
        isMobile: viewport.name === "mobile",
        hasTouch: viewport.name === "mobile",
      });

      const page = await context.newPage();
      await preparePage(page, viewport);

      const startedAt = Date.now();

      try {
        const response = await page.goto(validatedUrl.href, {
          waitUntil: "domcontentloaded",
          timeout: 30_000,
        });

        loadTimeMs = Math.max(loadTimeMs, Date.now() - startedAt);
        statusCode = response?.status() ?? statusCode;
        finalUrl = page.url();
        title = await page.title();

        await page.waitForLoadState("networkidle", {
          timeout: 8_000,
        }).catch(() => undefined);

        await dismissCommonDialogs(page);
        await autoScroll(page);

        const fullPageFile = `${viewport.name}-full.png`;
        const fullPagePath = path.join(
          outputDirectory,
          fullPageFile,
        );

        await page.screenshot({
          path: fullPagePath,
          fullPage: true,
          type: "png",
          animations: "disabled",
        });

        artifacts.push({
          type: viewport.name,
          relativePath: path.relative(
            process.cwd(),
            fullPagePath,
          ),
          publicUrl: `/generated/research/${runId}/${fullPageFile}`,
          width: viewport.width,
          height: viewport.height,
          fullPage: true,
        });

        if (viewport.name === "desktop") {
          await page.evaluate(() => window.scrollTo(0, 0));

          const heroFile = "desktop-hero.png";
          const heroPath = path.join(
            outputDirectory,
            heroFile,
          );

          await page.screenshot({
            path: heroPath,
            fullPage: false,
            type: "png",
            animations: "disabled",
          });

          artifacts.push({
            type: "hero",
            relativePath: path.relative(
              process.cwd(),
              heroPath,
            ),
            publicUrl: `/generated/research/${runId}/${heroFile}`,
            width: viewport.width,
            height: viewport.height,
            fullPage: false,
          });

          collectedMetrics = await collectPageMetrics(page);
        }
      } catch (error) {
        errors.push(
          `${viewport.name}: ${
            error instanceof Error
              ? error.message
              : "Errore durante la cattura."
          }`,
        );
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser?.close();
  }

  if (!collectedMetrics) {
    collectedMetrics = {
      pageMetrics: {
        documentWidth: 0,
        documentHeight: 0,
        bodyTextLength: 0,
        imageCount: 0,
        linkCount: 0,
        buttonCount: 0,
        headingCount: 0,
        formCount: 0,
        inputCount: 0,
        hasHorizontalOverflow: false,
      },
      visualSignals: {
        heroHeading: "",
        primaryButtons: [],
        dominantBackgrounds: [],
        visibleTextSample: "",
      },
    };
  }

  const evidence: BrowserPageEvidence = {
    requestedUrl: validatedUrl.href,
    finalUrl,
    title,
    statusCode,
    capturedAt: new Date().toISOString(),
    loadTimeMs,
    viewportArtifacts: artifacts,
    pageMetrics: collectedMetrics.pageMetrics,
    visualSignals: collectedMetrics.visualSignals,
    errors,
  };

  await fs.writeFile(
    path.join(outputDirectory, "evidence.json"),
    JSON.stringify(evidence, null, 2),
    "utf-8",
  );

  return evidence;
}

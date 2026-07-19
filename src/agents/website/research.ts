export type WebsiteEvidence = {
  requestedUrl: string;
  finalUrl: string;
  reachable: boolean;
  statusCode: number | null;
  contentType: string;
  title: string;
  description: string;
  language: string;
  canonical: string;
  robots: string;
  viewport: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  callsToAction: string[];
  links: {
    internal: number;
    external: number;
    whatsapp: number;
    telephone: number;
    booking: number;
    menu: number;
  };
  signals: {
    hasTitle: boolean;
    hasDescription: boolean;
    hasCanonical: boolean;
    hasViewport: boolean;
    hasOpenGraph: boolean;
    hasStructuredData: boolean;
    hasFavicon: boolean;
    hasBookingSignal: boolean;
    hasMenuSignal: boolean;
    hasWhatsappSignal: boolean;
    hasTelephoneSignal: boolean;
  };
  textSample: string;
  errors: string[];
};

const MAX_HTML_LENGTH = 900_000;
const FETCH_TIMEOUT = 12_000;

function decodeHtml(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(value: string): string {
  return decodeHtml(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  );
}

function getAttribute(tag: string, attribute: string): string {
  const expression = new RegExp(
    `${attribute}\\s*=\\s*["']([^"']+)["']`,
    "i",
  );

  return expression.exec(tag)?.[1]?.trim() ?? "";
}

function findMeta(html: string, key: string): string {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of tags) {
    const name =
      getAttribute(tag, "name") ||
      getAttribute(tag, "property");

    if (name.toLowerCase() === key.toLowerCase()) {
      return getAttribute(tag, "content");
    }
  }

  return "";
}

function findLink(html: string, relValue: string): string {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];

  for (const tag of tags) {
    const rel = getAttribute(tag, "rel").toLowerCase();

    if (rel.split(/\s+/).includes(relValue.toLowerCase())) {
      return getAttribute(tag, "href");
    }
  }

  return "";
}

function findTagText(
  html: string,
  tagName: "title" | "h1" | "h2" | "h3",
  limit = 12,
): string[] {
  const expression = new RegExp(
    `<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`,
    "gi",
  );

  const values: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = expression.exec(html)) && values.length < limit) {
    const text = stripTags(match[1]);

    if (text.length >= 2 && !values.includes(text)) {
      values.push(text.slice(0, 240));
    }
  }

  return values;
}

function isBlockedHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase();

  if (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized === "0.0.0.0" ||
    normalized === "::1"
  ) {
    return true;
  }

  if (
    /^127\./.test(normalized) ||
    /^10\./.test(normalized) ||
    /^192\.168\./.test(normalized) ||
    /^169\.254\./.test(normalized)
  ) {
    return true;
  }

  const private172 = /^172\.(\d{1,3})\./.exec(normalized);

  if (private172) {
    const secondOctet = Number(private172[1]);

    if (secondOctet >= 16 && secondOctet <= 31) {
      return true;
    }
  }

  return false;
}

function normalizeWebsiteUrl(rawUrl: string): URL {
  const trimmed = rawUrl.trim();

  if (!trimmed) {
    throw new Error("URL del sito assente.");
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  const url = new URL(withProtocol);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Protocollo URL non supportato.");
  }

  if (isBlockedHostname(url.hostname)) {
    throw new Error("Hostname locale o privato non consentito.");
  }

  return url;
}

function collectCallsToAction(html: string): string[] {
  const candidates: string[] = [];

  const buttonExpression =
    /<(button|a)\b[^>]*>([\s\S]*?)<\/\1>/gi;

  let match: RegExpExecArray | null;

  while (
    (match = buttonExpression.exec(html)) &&
    candidates.length < 80
  ) {
    const text = stripTags(match[2]).slice(0, 100);

    if (
      text.length >= 2 &&
      text.length <= 100 &&
      /prenot|ordina|menu|menù|contatt|chiama|whatsapp|scopri|acquista|riserva|delivery|asporto/i.test(
        text,
      )
    ) {
      candidates.push(text);
    }
  }

  return [...new Set(candidates)].slice(0, 20);
}

function analyzeLinks(html: string, baseUrl: URL) {
  const tags = html.match(/<a\b[^>]*>/gi) ?? [];

  const counters = {
    internal: 0,
    external: 0,
    whatsapp: 0,
    telephone: 0,
    booking: 0,
    menu: 0,
  };

  for (const tag of tags.slice(0, 1500)) {
    const href = getAttribute(tag, "href");

    if (!href) continue;

    const normalizedHref = href.toLowerCase();

    if (
      normalizedHref.startsWith("https://wa.me") ||
      normalizedHref.includes("api.whatsapp.com") ||
      normalizedHref.startsWith("whatsapp:")
    ) {
      counters.whatsapp += 1;
    }

    if (normalizedHref.startsWith("tel:")) {
      counters.telephone += 1;
    }

    if (
      /prenot|booking|reserve|reservation|thefork|quandoo|covermanager/.test(
        normalizedHref,
      )
    ) {
      counters.booking += 1;
    }

    if (/menu|menù|carta|piatti/.test(normalizedHref)) {
      counters.menu += 1;
    }

    try {
      const parsed = new URL(href, baseUrl);

      if (parsed.hostname === baseUrl.hostname) {
        counters.internal += 1;
      } else {
        counters.external += 1;
      }
    } catch {
      // Collegamento non interpretabile: viene ignorato.
    }
  }

  return counters;
}

export async function researchWebsite(
  rawUrl: string,
): Promise<WebsiteEvidence> {
  const errors: string[] = [];

  let requestedUrl: URL;

  try {
    requestedUrl = normalizeWebsiteUrl(rawUrl);
  } catch (error) {
    return {
      requestedUrl: rawUrl,
      finalUrl: "",
      reachable: false,
      statusCode: null,
      contentType: "",
      title: "",
      description: "",
      language: "",
      canonical: "",
      robots: "",
      viewport: "",
      headings: { h1: [], h2: [], h3: [] },
      callsToAction: [],
      links: {
        internal: 0,
        external: 0,
        whatsapp: 0,
        telephone: 0,
        booking: 0,
        menu: 0,
      },
      signals: {
        hasTitle: false,
        hasDescription: false,
        hasCanonical: false,
        hasViewport: false,
        hasOpenGraph: false,
        hasStructuredData: false,
        hasFavicon: false,
        hasBookingSignal: false,
        hasMenuSignal: false,
        hasWhatsappSignal: false,
        hasTelephoneSignal: false,
      },
      textSample: "",
      errors: [
        error instanceof Error
          ? error.message
          : "URL del sito non valida.",
      ],
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    FETCH_TIMEOUT,
  );

  try {
    const response = await fetch(requestedUrl, {
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; UAEIntelligence/1.0; +https://univibegroup.it)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "it-IT,it;q=0.9,en;q=0.7",
      },
    });

    const contentType =
      response.headers.get("content-type") ?? "";

    if (!contentType.toLowerCase().includes("text/html")) {
      errors.push(
        `Il server ha restituito un contenuto non HTML: ${contentType || "sconosciuto"}.`,
      );
    }

    const rawHtml = (await response.text()).slice(
      0,
      MAX_HTML_LENGTH,
    );

    const finalUrl = new URL(response.url || requestedUrl.href);
    const title = findTagText(rawHtml, "title", 1)[0] ?? "";
    const description = findMeta(rawHtml, "description");
    const canonical = findLink(rawHtml, "canonical");
    const robots = findMeta(rawHtml, "robots");
    const viewport = findMeta(rawHtml, "viewport");
    const language =
      /<html\b[^>]*\blang=["']([^"']+)["']/i.exec(rawHtml)?.[1] ??
      "";

    const links = analyzeLinks(rawHtml, finalUrl);
    const callsToAction = collectCallsToAction(rawHtml);

    const bodyText = stripTags(rawHtml).slice(0, 14_000);

    const hasBookingSignal =
      links.booking > 0 ||
      callsToAction.some((item) =>
        /prenot|booking|riserva/i.test(item),
      );

    const hasMenuSignal =
      links.menu > 0 ||
      callsToAction.some((item) => /menu|menù|carta/i.test(item));

    return {
      requestedUrl: requestedUrl.href,
      finalUrl: finalUrl.href,
      reachable: response.ok,
      statusCode: response.status,
      contentType,
      title,
      description,
      language,
      canonical,
      robots,
      viewport,
      headings: {
        h1: findTagText(rawHtml, "h1"),
        h2: findTagText(rawHtml, "h2"),
        h3: findTagText(rawHtml, "h3"),
      },
      callsToAction,
      links,
      signals: {
        hasTitle: title.length > 0,
        hasDescription: description.length > 0,
        hasCanonical: canonical.length > 0,
        hasViewport: viewport.length > 0,
        hasOpenGraph:
          rawHtml.includes('property="og:') ||
          rawHtml.includes("property='og:"),
        hasStructuredData:
          /application\/ld\+json/i.test(rawHtml),
        hasFavicon:
          /rel=["'][^"']*(icon|shortcut icon)[^"']*["']/i.test(
            rawHtml,
          ),
        hasBookingSignal,
        hasMenuSignal,
        hasWhatsappSignal: links.whatsapp > 0,
        hasTelephoneSignal: links.telephone > 0,
      },
      textSample: bodyText,
      errors,
    };
  } catch (error) {
    errors.push(
      error instanceof Error
        ? error.message
        : "Errore durante la lettura del sito.",
    );

    return {
      requestedUrl: requestedUrl.href,
      finalUrl: "",
      reachable: false,
      statusCode: null,
      contentType: "",
      title: "",
      description: "",
      language: "",
      canonical: "",
      robots: "",
      viewport: "",
      headings: { h1: [], h2: [], h3: [] },
      callsToAction: [],
      links: {
        internal: 0,
        external: 0,
        whatsapp: 0,
        telephone: 0,
        booking: 0,
        menu: 0,
      },
      signals: {
        hasTitle: false,
        hasDescription: false,
        hasCanonical: false,
        hasViewport: false,
        hasOpenGraph: false,
        hasStructuredData: false,
        hasFavicon: false,
        hasBookingSignal: false,
        hasMenuSignal: false,
        hasWhatsappSignal: false,
        hasTelephoneSignal: false,
      },
      textSample: "",
      errors,
    };
  } finally {
    clearTimeout(timeout);
  }
}

type BrowserEvidence = {
  requestedUrl: string;
  finalUrl: string;
  title: string;
  statusCode: number | null;
  loadTimeMs: number;
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
};

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function extractMatches(
  text: string,
  expression: RegExp,
  limit = 20,
): string[] {
  return unique(
    Array.from(text.matchAll(expression))
      .map((match) => match[0])
      .slice(0, limit),
  );
}

function normalizePhone(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function extractPhoneNumbers(text: string): string[] {
  const matches = extractMatches(
    text,
    /(?:\+39[\s.-]?)?(?:0\d{1,4}[\s.-]?\d{5,8}|3\d{2}[\s.-]?\d{6,7})/g,
  );

  return unique(matches.map(normalizePhone));
}

function extractEmails(text: string): string[] {
  return extractMatches(
    text,
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
  );
}

function extractPrices(text: string): string[] {
  return extractMatches(
    text,
    /(?:€\s?\d{1,3}(?:[.,]\d{1,2})?|\d{1,3}(?:[.,]\d{1,2})?\s?€)/g,
    40,
  );
}

function extractOpeningHours(text: string): string[] {
  const expressions = [
    /(?:lun(?:edì)?|mar(?:tedì)?|mer(?:coledì)?|gio(?:vedì)?|ven(?:erdì)?|sab(?:ato)?|dom(?:enica)?)[^.\n]{0,80}(?:\d{1,2}[:.]\d{2})[^.\n]{0,80}/gi,
    /\d{1,2}[:.]\d{2}\s?[-–]\s?\d{1,2}[:.]\d{2}/g,
    /(?:pranzo|cena)[^.\n]{0,80}\d{1,2}[:.]\d{2}[^.\n]{0,80}/gi,
  ];

  return unique(
    expressions.flatMap((expression) =>
      extractMatches(text, expression, 20),
    ),
  ).slice(0, 20);
}

function extractPossibleAddresses(text: string): string[] {
  const matches = extractMatches(
    text,
    /(?:via|viale|piazza|corso|strada|largo|contrada)\s+[A-ZÀ-Ýa-zà-ÿ0-9.'\s-]{3,80}(?:,\s?\d{1,4})?/gi,
    20,
  );

  return matches
    .map((value) => value.replace(/\s+/g, " ").trim())
    .filter((value) => value.length <= 120);
}

function inferServices(text: string): string[] {
  const rules: Array<[RegExp, string]> = [
    [/all\s*you\s*can\s*eat|ayce/i, "All You Can Eat"],
    [/asporto|takeaway|take away/i, "Asporto"],
    [/delivery|consegna a domicilio/i, "Delivery"],
    [/box\s*sushi/i, "Box sushi"],
    [/poke|poké/i, "Poké"],
    [/prenot/i, "Prenotazione"],
    [/whatsapp/i, "Contatto WhatsApp"],
    [/menu|menù/i, "Menù online"],
    [/cucina cinese/i, "Cucina cinese"],
    [/cucina giapponese|sushi/i, "Cucina giapponese"],
    [/pranzo/i, "Servizio pranzo"],
    [/cena/i, "Servizio cena"],
  ];

  return rules
    .filter(([expression]) => expression.test(text))
    .map(([, label]) => label);
}

function inferRestaurantModel(
  text: string,
):
  | "all_you_can_eat"
  | "a_la_carte"
  | "takeaway"
  | "delivery"
  | "fusion"
  | "premium"
  | "fast_casual"
  | "mixed"
  | "unclear" {
  const detected = [
    /all\s*you\s*can\s*eat|ayce/i.test(text),
    /asporto|takeaway|take away/i.test(text),
    /delivery|consegna a domicilio/i.test(text),
    /fusion/i.test(text),
    /premium|fine dining|gourmet/i.test(text),
  ].filter(Boolean).length;

  if (detected > 1) return "mixed";
  if (/all\s*you\s*can\s*eat|ayce/i.test(text)) return "all_you_can_eat";
  if (/asporto|takeaway|take away/i.test(text)) return "takeaway";
  if (/delivery|consegna a domicilio/i.test(text)) return "delivery";
  if (/fusion/i.test(text)) return "fusion";
  if (/premium|fine dining|gourmet/i.test(text)) return "premium";

  return "unclear";
}

function extractSocialUrls(text: string, hostname: string): string[] {
  const expression = new RegExp(
    `https?:\\/\\/(?:www\\.)?${hostname.replace(".", "\\.")}\\/[^\\s"'<>]+`,
    "gi",
  );

  return extractMatches(text, expression, 20);
}

export function extractLocalRestaurantEvidence(
  browserEvidence: BrowserEvidence,
) {
  const text = [
    browserEvidence.title,
    browserEvidence.visualSignals.heroHeading,
    browserEvidence.visualSignals.visibleTextSample,
    ...browserEvidence.visualSignals.primaryButtons,
  ].join(" ");

  return {
    rawText: text,
    identity: {
      title: browserEvidence.title,
      restaurantModel: inferRestaurantModel(text),
      languages: /[àèéìòù]/i.test(text) ? ["it"] : [],
      currency: text.includes("€") ? "EUR" : "",
    },

    business: {
      phoneNumbers: extractPhoneNumbers(text),
      emails: extractEmails(text),
      addresses: extractPossibleAddresses(text),
      openingHours: extractOpeningHours(text),
      prices: extractPrices(text),
      servicesDetected: inferServices(text),
    },

    marketing: {
      instagram: extractSocialUrls(text, "instagram.com"),
      facebook: extractSocialUrls(text, "facebook.com"),
      tiktok: extractSocialUrls(text, "tiktok.com"),
      youtube: extractSocialUrls(text, "youtube.com"),
      tripadvisor: extractSocialUrls(text, "tripadvisor.it"),
      theFork: [
        ...extractSocialUrls(text, "thefork.it"),
        ...extractSocialUrls(text, "thefork.com"),
      ],
      deliveryPlatforms: [
        ...extractSocialUrls(text, "justeat.it"),
        ...extractSocialUrls(text, "deliveroo.it"),
        ...extractSocialUrls(text, "glovoapp.com"),
      ],
    },

    technical: {
      statusCode: browserEvidence.statusCode,
      loadTimeMs: Math.round(browserEvidence.loadTimeMs),
      documentHeight: Math.round(
        browserEvidence.pageMetrics.documentHeight,
      ),
      bodyTextLength: browserEvidence.pageMetrics.bodyTextLength,
      imageCount: browserEvidence.pageMetrics.imageCount,
      linkCount: browserEvidence.pageMetrics.linkCount,
      headingCount: browserEvidence.pageMetrics.headingCount,
      formCount: browserEvidence.pageMetrics.formCount,
      hasHorizontalOverflow:
        browserEvidence.pageMetrics.hasHorizontalOverflow,
      primaryButtons: browserEvidence.visualSignals.primaryButtons,
      hasPrimaryCta: browserEvidence.visualSignals.primaryButtons.some(
        (button) =>
          /prenot|chiama|whatsapp|ordina|menu|menù|asporto/i.test(
            button,
          ),
      ),
    },
  };
}

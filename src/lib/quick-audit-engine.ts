import type {
  QuickAuditArea,
  QuickAuditAreaId,
  QuickAuditInput,
  QuickAuditResult,
  RecommendedService,
} from "@/types/quick-audit";

function createHash(value: string): number {
  return [...value].reduce(
    (total, character, index) =>
      total + character.charCodeAt(0) * (index + 1),
    0,
  );
}

function clamp(value: number, minimum = 18, maximum = 88): number {
  return Math.max(minimum, Math.min(maximum, Math.round(value)));
}

function hasValue(value: string): boolean {
  return value.trim().length > 3;
}

function urlQuality(value: string): number {
  if (!hasValue(value)) return -14;

  let score = 0;

  if (value.startsWith("https://")) score += 5;
  if (value.length < 45) score += 2;
  if (!value.includes("facebook.com")) score += 1;
  if (!value.includes("instagram.com")) score += 1;

  return score;
}

function getStatus(
  score: number,
): "critica" | "prioritaria" | "migliorabile" | "solida" {
  if (score <= 35) return "critica";
  if (score <= 52) return "prioritaria";
  if (score <= 72) return "migliorabile";
  return "solida";
}

function createArea(
  id: QuickAuditAreaId,
  label: string,
  score: number,
  summary: string,
  findings: string[],
  recommendations: string[],
): QuickAuditArea {
  const normalizedScore = clamp(score);

  return {
    id,
    label,
    score: normalizedScore,
    status: getStatus(normalizedScore),
    summary,
    findings,
    recommendations,
  };
}

function buildServices(areas: QuickAuditArea[]): RecommendedService[] {
  const score = (id: QuickAuditAreaId) =>
    areas.find((area) => area.id === id)?.score ?? 50;

  const websiteNeed =
    Math.round(
      (100 - score("website")) * 0.42 +
        (100 - score("mobile")) * 0.28 +
        (100 - score("conversion")) * 0.3,
    );

  const socialNeed = Math.round(
    (100 - score("social")) * 0.55 +
      (100 - score("content")) * 0.45,
  );

  const googleNeed = Math.round(
    (100 - score("google")) * 0.65 +
      (100 - score("seo")) * 0.35,
  );

  const menuNeed = Math.round(
    (100 - score("menu")) * 0.7 +
      (100 - score("conversion")) * 0.3,
  );

  const services: RecommendedService[] = [
    {
      id: "website-premium",
      name: "Sito web premium",
      description:
        "Nuova esperienza digitale mobile-first con menù, prenotazioni, SEO locale e percorsi di conversione.",
      priority: websiteNeed >= 65 ? 5 : websiteNeed >= 48 ? 4 : 3,
      priceFrom: 1800,
      selected: websiteNeed >= 45,
    },
    {
      id: "social-ai",
      name: "Gestione social assistita dall’AI",
      description:
        "Strategia, calendario editoriale, copy, contenuti, programmazione e supervisione delle performance.",
      priority: socialNeed >= 65 ? 5 : socialNeed >= 48 ? 4 : 3,
      priceFrom: 600,
      selected: socialNeed >= 42,
    },
    {
      id: "google-seo",
      name: "Google Business e SEO locale",
      description:
        "Ottimizzazione della presenza su Google, struttura SEO, reputazione e visibilità territoriale.",
      priority: googleNeed >= 65 ? 5 : googleNeed >= 48 ? 4 : 3,
      priceFrom: 450,
      selected: googleNeed >= 42,
    },
    {
      id: "menu-digital",
      name: "Menù digitale evoluto",
      description:
        "Menù progettato per rendere più semplice la scelta, valorizzare i piatti e aumentare il valore medio dell’ordine.",
      priority: menuNeed >= 65 ? 5 : menuNeed >= 48 ? 4 : 3,
      priceFrom: 500,
      selected: menuNeed >= 42,
    },
    {
      id: "food-content",
      name: "Food photography e contenuti video",
      description:
        "Produzione di immagini e video pensati per sito, social, campagne e comunicazione del locale.",
      priority: score("content") <= 42 ? 5 : score("content") <= 60 ? 4 : 3,
      priceFrom: 750,
      selected: score("content") <= 66,
    },
    {
      id: "conversion-system",
      name: "Sistema prenotazioni e conversione",
      description:
        "Prenotazione rapida, WhatsApp, tracciamenti, call to action e automazioni per ridurre gli attriti.",
      priority:
        score("conversion") <= 38 ? 5 : score("conversion") <= 58 ? 4 : 3,
      priceFrom: 450,
      selected: score("conversion") <= 65,
    },
  ];

  return services.sort(
    (first, second) => second.priority - first.priority,
  );
}

export function generateQuickAudit(
  input: QuickAuditInput,
): QuickAuditResult {
  const seed = createHash(
    `${input.restaurantName}-${input.city}-${input.website}-${input.instagram}`,
  );

  const variation = (offset: number, range = 10) =>
    ((seed + offset * 37) % range) - Math.floor(range / 2);

  const websiteExists = hasValue(input.website);
  const googleExists = hasValue(input.googleBusiness);
  const instagramExists = hasValue(input.instagram);
  const facebookExists = hasValue(input.facebook);
  const tiktokExists = hasValue(input.tiktok);
  const menuExists = hasValue(input.currentMenu);

  const socialCount = [
    instagramExists,
    facebookExists,
    tiktokExists,
  ].filter(Boolean).length;

  const websiteScore = clamp(
    48 +
      urlQuality(input.website) +
      variation(1, 17) -
      (websiteExists ? 0 : 15),
  );

  const mobileScore = clamp(
    websiteScore - 6 + variation(2, 15),
  );

  const seoScore = clamp(
    websiteScore - 12 + variation(3, 19),
  );

  const brandScore = clamp(
    55 +
      variation(4, 20) +
      (instagramExists ? 3 : -4),
  );

  const googleScore = clamp(
    50 +
      (googleExists ? 10 : -16) +
      variation(5, 17),
  );

  const socialScore = clamp(
    34 +
      socialCount * 9 +
      variation(6, 15) -
      (socialCount === 0 ? 12 : 0),
  );

  const menuScore = clamp(
    47 +
      (menuExists ? 8 : -13) +
      variation(7, 16),
  );

  const contentScore = clamp(
    43 +
      socialCount * 5 +
      variation(8, 20),
  );

  const conversionScore = clamp(
    websiteScore * 0.42 +
      menuScore * 0.22 +
      googleScore * 0.16 +
      socialScore * 0.2 -
      9 +
      variation(9, 11),
  );

  const areas: QuickAuditArea[] = [
    createArea(
      "brand",
      "Identità e posizionamento",
      brandScore,
      brandScore < 60
        ? "L’identità presenta elementi utilizzabili, ma non costruisce ancora una percezione sufficientemente distintiva e premium."
        : "L’identità risulta riconoscibile, ma può essere resa più coerente nei diversi punti di contatto.",
      [
        "La riconoscibilità del ristorante può essere rafforzata attraverso una direzione visiva più uniforme.",
        "Il posizionamento non emerge sempre con chiarezza nei primi secondi di contatto.",
      ],
      [
        "Definire una direzione visiva proprietaria.",
        "Uniformare sito, social, menù e materiali promozionali.",
      ],
    ),
    createArea(
      "website",
      "Sito web",
      websiteScore,
      websiteExists
        ? "Il sito offre una presenza di base, ma presenta margini importanti nella percezione del valore e nella capacità di accompagnare verso l’azione."
        : "Non è stata rilevata una presenza web proprietaria completa e orientata alla conversione.",
      [
        websiteExists
          ? "L’esperienza non comunica ancora pienamente il livello qualitativo del ristorante."
          : "L’assenza di un sito proprietario riduce controllo, posizionamento e possibilità di conversione.",
        "Menù, prenotazione e contatti devono essere raggiungibili con minore attrito.",
      ],
      [
        "Realizzare un’esperienza digitale progettata specificamente per la ristorazione asiatica.",
        "Rendere immediatamente visibili prenotazione, menù e ordine.",
      ],
    ),
    createArea(
      "mobile",
      "Esperienza mobile",
      mobileScore,
      "La maggior parte delle decisioni avviene da smartphone: il percorso deve essere rapido, leggibile e completamente orientato all’azione.",
      [
        "Gerarchia, dimensioni e spazi potrebbero non essere ottimizzati in tutti i passaggi.",
        "Il percorso principale richiede una maggiore semplificazione.",
      ],
      [
        "Progettare l’interfaccia partendo dallo smartphone.",
        "Ridurre i passaggi necessari per prenotare o contattare il locale.",
      ],
    ),
    createArea(
      "seo",
      "SEO e visibilità organica",
      seoScore,
      "La visibilità organica può essere aumentata attraverso struttura tecnica, contenuti locali e pagine dedicate alle ricerche più rilevanti.",
      [
        "Il potenziale delle ricerche locali non appare sfruttato completamente.",
        "L’architettura dei contenuti può essere resa più leggibile per i motori di ricerca.",
      ],
      [
        "Creare pagine e contenuti orientati alle ricerche locali.",
        "Ottimizzare titoli, descrizioni, dati strutturati e collegamenti interni.",
      ],
    ),
    createArea(
      "google",
      "Google Business e reputazione",
      googleScore,
      googleExists
        ? "La presenza Google costituisce un punto di contatto importante, ma deve essere gestita come un vero canale commerciale."
        : "Non è stato indicato un profilo Google Business pienamente utilizzabile nell’analisi.",
      [
        "Fotografie, aggiornamenti e risposte alle recensioni incidono direttamente sulla fiducia.",
        "La scheda deve accompagnare in modo più evidente verso sito, chiamata e prenotazione.",
      ],
      [
        "Ottimizzare integralmente il profilo Google Business.",
        "Definire una procedura continuativa per recensioni, foto e aggiornamenti.",
      ],
    ),
    createArea(
      "social",
      "Social media",
      socialScore,
      socialCount > 0
        ? "I canali esistono, ma devono diventare un sistema editoriale coerente e non una semplice raccolta di pubblicazioni."
        : "La presenza social non risulta sufficientemente strutturata per sostenere notorietà e prenotazioni.",
      [
        "La frequenza e la coerenza dei contenuti possono essere migliorate.",
        "I contenuti devono mostrare maggiormente prodotto, atmosfera, persone e preparazione.",
      ],
      [
        "Creare un calendario editoriale mensile.",
        "Integrare Reel, storytelling, CTA e contenuti orientati alla prenotazione.",
      ],
    ),
    createArea(
      "menu",
      "Menù ed esperienza di scelta",
      menuScore,
      menuExists
        ? "Il menù è disponibile, ma può essere trasformato in uno strumento di vendita più chiaro, desiderabile e dinamico."
        : "L’assenza di un menù digitale evoluto limita la possibilità di valorizzare piatti e percorsi.",
      [
        "La scelta deve essere facilitata attraverso categorie e gerarchie più immediate.",
        "Piatti strategici, combinazioni e proposte ad alto valore devono ottenere maggiore evidenza.",
      ],
      [
        "Ripensare struttura, fotografie e presentazione del menù.",
        "Inserire filtri, allergeni, percorsi consigliati e occasioni di upselling.",
      ],
    ),
    createArea(
      "content",
      "Foto, video e comunicazione food",
      contentScore,
      "Nella ristorazione asiatica la qualità percepita nasce prima dalla comunicazione visiva e solo successivamente dall’esperienza fisica.",
      [
        "Le immagini devono avere uno standard uniforme e professionale.",
        "Video brevi e contenuti di preparazione possono aumentare attenzione e desiderio.",
      ],
      [
        "Produrre una libreria fotografica e video proprietaria.",
        "Creare formati dedicati a Reel, Stories, sito e campagne.",
      ],
    ),
    createArea(
      "conversion",
      "Prenotazioni e conversione",
      conversionScore,
      "Il sistema digitale deve ridurre la distanza tra interesse e prenotazione attraverso percorsi immediati e misurabili.",
      [
        "I principali punti di contatto non lavorano ancora come un unico sistema.",
        "Il tracciamento delle azioni dell’utente può essere reso più completo.",
      ],
      [
        "Integrare prenotazione, WhatsApp, chiamata e ordine in un percorso unico.",
        "Misurare click, richieste, chiamate e prenotazioni generate.",
      ],
    ),
  ];

  const overallScore = Math.round(
    areas.reduce((total, area) => total + area.score, 0) /
      areas.length,
  );

  const orderedAreas = [...areas].sort(
    (first, second) => first.score - second.score,
  );

  const services = buildServices(areas);
  const selectedServices = services.filter(
    (service) => service.selected,
  );

  const baseInvestment = selectedServices.reduce(
    (total, service) => total + service.priceFrom,
    0,
  );

  const restaurantSlug = input.restaurantName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4)
    .padEnd(4, "X");

  return {
    auditCode: `UARE-2026-${restaurantSlug}-${String(seed % 1000).padStart(
      3,
      "0",
    )}`,
    generatedAt: new Date().toISOString(),
    overallScore,
    scoreLabel:
      overallScore <= 35
        ? "Presenza digitale critica"
        : overallScore <= 52
          ? "Presenza digitale debole"
          : overallScore <= 70
            ? "Presenza digitale migliorabile"
            : "Presenza digitale solida",
    executiveSummary:
      overallScore <= 52
        ? `L’analisi preliminare di ${input.restaurantName} evidenzia una presenza digitale frammentata e con importanti margini di trasformazione. Le priorità riguardano ${orderedAreas[0].label.toLowerCase()}, ${orderedAreas[1].label.toLowerCase()} e ${orderedAreas[2].label.toLowerCase()}.`
        : `La presenza digitale di ${input.restaurantName} dispone di una base utilizzabile, ma non esprime ancora pienamente il potenziale commerciale e il valore percepito del ristorante. Gli interventi prioritari riguardano ${orderedAreas[0].label.toLowerCase()} e ${orderedAreas[1].label.toLowerCase()}.`,
    areas,
    strongestArea: orderedAreas.at(-1)?.id ?? "brand",
    weakestArea: orderedAreas[0]?.id ?? "conversion",
    criticalFindings: orderedAreas
      .slice(0, 4)
      .map(
        (area) =>
          `${area.label}: ${area.findings[0]}`,
      ),
    opportunities: [
      "Costruire un ecosistema digitale coerente tra sito, Google, social e menù.",
      "Ridurre i passaggi necessari per prenotare, ordinare o contattare il locale.",
      "Aumentare il valore percepito attraverso una comunicazione food premium.",
      "Utilizzare contenuti, dati e automazioni per sostenere la crescita continuativa.",
    ],
    services,
    estimatedInvestment: {
      minimum: Math.max(1500, Math.round(baseInvestment * 0.78 / 50) * 50),
      maximum: Math.max(3000, Math.round(baseInvestment * 1.24 / 50) * 50),
      recommended: Math.max(
        2500,
        Math.round(baseInvestment / 50) * 50,
      ),
    },
    input,
    demoAnalysis: true,
  };
}

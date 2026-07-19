import type { AuditSection } from "@/types/audit";

export const auditSections: AuditSection[] = [
  {
    id: "brand",
    title: "Identità e posizionamento",
    shortTitle: "Brand",
    description:
      "Valuta la capacità del ristorante di comunicare un’identità riconoscibile, coerente e premium.",
    questions: [
      {
        id: "brand-logo",
        title: "Qualità e riconoscibilità del logo",
        description:
          "Il logo è professionale, leggibile e facilmente riconoscibile?",
        weight: 1,
      },
      {
        id: "brand-coherence",
        title: "Coerenza visiva",
        description:
          "Colori, font, fotografie e materiali comunicano la stessa identità?",
        weight: 1,
      },
      {
        id: "brand-positioning",
        title: "Posizionamento percepito",
        description:
          "Il cliente comprende immediatamente fascia, stile e proposta del ristorante?",
        weight: 1.2,
      },
      {
        id: "brand-differentiation",
        title: "Differenziazione dai concorrenti",
        description:
          "Il ristorante presenta caratteristiche distintive rispetto agli altri locali asiatici?",
        weight: 1.2,
      },
    ],
  },
  {
    id: "website",
    title: "Sito web ed esperienza digitale",
    shortTitle: "Sito web",
    description:
      "Analizza design, usabilità, chiarezza e capacità del sito di trasformare una visita in prenotazione.",
    questions: [
      {
        id: "website-design",
        title: "Qualità del design",
        description:
          "Il sito comunica qualità, modernità e coerenza con l’esperienza del locale?",
        weight: 1.2,
      },
      {
        id: "website-navigation",
        title: "Navigazione e chiarezza",
        description:
          "Le informazioni principali sono raggiungibili rapidamente e senza confusione?",
        weight: 1,
      },
      {
        id: "website-mobile",
        title: "Esperienza da smartphone",
        description:
          "Il sito è leggibile, veloce e semplice da utilizzare da mobile?",
        weight: 1.4,
      },
      {
        id: "website-speed",
        title: "Velocità e prestazioni",
        description:
          "Le pagine si caricano rapidamente e senza elementi che rallentano l’esperienza?",
        weight: 1,
      },
      {
        id: "website-cta",
        title: "Call to action",
        description:
          "Prenotazione, telefono, WhatsApp e ordine online sono evidenti e immediati?",
        weight: 1.4,
      },
    ],
  },
  {
    id: "menu",
    title: "Menù digitale",
    shortTitle: "Menù",
    description:
      "Valuta quanto il menù sia accessibile, leggibile, desiderabile e orientato alla vendita.",
    questions: [
      {
        id: "menu-readability",
        title: "Leggibilità del menù",
        description:
          "Categorie, piatti, ingredienti e prezzi sono chiari e ben organizzati?",
        weight: 1,
      },
      {
        id: "menu-photos",
        title: "Qualità fotografica dei piatti",
        description:
          "Le fotografie valorizzano realmente il prodotto e stimolano il desiderio?",
        weight: 1.3,
      },
      {
        id: "menu-allergens",
        title: "Ingredienti e allergeni",
        description:
          "Le informazioni obbligatorie e utili sono facilmente comprensibili?",
        weight: 1,
      },
      {
        id: "menu-conversion",
        title: "Orientamento alla scelta",
        description:
          "Il menù facilita la scelta e mette in evidenza piatti, percorsi e proposte ad alto valore?",
        weight: 1.2,
      },
    ],
  },
  {
    id: "google",
    title: "Google e reputazione locale",
    shortTitle: "Google",
    description:
      "Analizza visibilità locale, recensioni, fotografie e qualità della presenza su Google.",
    questions: [
      {
        id: "google-profile",
        title: "Completezza del profilo Google",
        description:
          "Orari, contatti, categorie, sito, prenotazione e servizi risultano corretti?",
        weight: 1.2,
      },
      {
        id: "google-photos",
        title: "Qualità e aggiornamento delle fotografie",
        description:
          "Le immagini presenti rappresentano correttamente locale, piatti e atmosfera?",
        weight: 1,
      },
      {
        id: "google-reviews",
        title: "Quantità e qualità delle recensioni",
        description:
          "Il numero, la frequenza e la valutazione media generano fiducia?",
        weight: 1.3,
      },
      {
        id: "google-replies",
        title: "Gestione delle risposte",
        description:
          "Il ristorante risponde in modo professionale alle recensioni positive e negative?",
        weight: 1,
      },
      {
        id: "google-local",
        title: "Posizionamento locale",
        description:
          "Il ristorante è facilmente individuabile nelle ricerche locali rilevanti?",
        weight: 1.4,
      },
    ],
  },
  {
    id: "social",
    title: "Social media e contenuti",
    shortTitle: "Social",
    description:
      "Valuta qualità, frequenza e capacità dei contenuti social di generare desiderio e interazione.",
    questions: [
      {
        id: "social-coherence",
        title: "Coerenza del profilo",
        description:
          "Feed, copertine, testi e contenuti comunicano una direzione visiva precisa?",
        weight: 1,
      },
      {
        id: "social-frequency",
        title: "Frequenza di pubblicazione",
        description:
          "Il profilo viene aggiornato con continuità e senza lunghi periodi di inattività?",
        weight: 1,
      },
      {
        id: "social-video",
        title: "Utilizzo dei video",
        description:
          "Reel e contenuti video raccontano preparazione, persone, piatti e atmosfera?",
        weight: 1.3,
      },
      {
        id: "social-engagement",
        title: "Coinvolgimento del pubblico",
        description:
          "I contenuti generano commenti, condivisioni, salvataggi e interazioni?",
        weight: 1.1,
      },
      {
        id: "social-conversion",
        title: "Conversione dai social",
        description:
          "Il profilo accompagna efficacemente verso prenotazione, ordine o contatto?",
        weight: 1.3,
      },
    ],
  },
  {
    id: "conversion",
    title: "Prenotazioni, ordini e conversione",
    shortTitle: "Conversione",
    description:
      "Misura quanto il sistema digitale renda semplice trasformare interesse in una prenotazione o in un ordine.",
    questions: [
      {
        id: "conversion-book",
        title: "Prenotazione del tavolo",
        description:
          "Il cliente può prenotare facilmente, senza passaggi inutili o informazioni mancanti?",
        weight: 1.5,
      },
      {
        id: "conversion-order",
        title: "Ordine da asporto o delivery",
        description:
          "Il processo di ordine è diretto, leggibile e indipendente da ostacoli tecnici?",
        weight: 1.4,
      },
      {
        id: "conversion-whatsapp",
        title: "WhatsApp e contatto immediato",
        description:
          "Il contatto rapido è presente e configurato correttamente?",
        weight: 1,
      },
      {
        id: "conversion-tracking",
        title: "Tracciamento delle conversioni",
        description:
          "Il ristorante misura prenotazioni, chiamate, click e richieste generate online?",
        weight: 1.3,
      },
      {
        id: "conversion-retention",
        title: "Fidelizzazione",
        description:
          "Esistono strumenti per riportare il cliente nel locale dopo la prima esperienza?",
        weight: 1.2,
      },
    ],
  },
];

import {
  Building2,
  Car,
  Dumbbell,
  Factory,
  Hotel,
  House,
  Scale,
  ShoppingBag,
  Stethoscope,
  Utensils,
} from "lucide-react";
import type {
  SectorDefinition,
  SectorId,
} from "@/core/sectors/types";

export const sectorRegistry: SectorDefinition[] = [
  {
    id: "restaurant",
    name: "Ristorazione",
    shortName: "Food & Restaurant",
    description:
      "Ristoranti, sushi, pizzerie, bistrot, bar, delivery e attività food.",
    icon: Utensils,
    status: "active",
    accent: "#d4a85c",
    glow: "rgba(212,168,92,0.18)",
    examples: [
      "Ristorante",
      "Sushi",
      "Pizzeria",
      "Bar",
      "Delivery",
    ],
    analysisAreas: [
      {
        id: "menu",
        label: "Menù",
        description: "Struttura, leggibilità, prezzi e desiderabilità.",
      },
      {
        id: "booking",
        label: "Prenotazioni",
        description: "Percorso da interesse a prenotazione.",
      },
      {
        id: "local",
        label: "Visibilità locale",
        description: "Google, mappe, recensioni e ricerche territoriali.",
      },
      {
        id: "food-content",
        label: "Contenuti food",
        description: "Qualità di foto, video e comunicazione visiva.",
      },
    ],
    conversionGoals: [
      { id: "book", label: "Prenotazione tavolo" },
      { id: "call", label: "Telefonata" },
      { id: "whatsapp", label: "Richiesta WhatsApp" },
      { id: "order", label: "Ordine o asporto" },
    ],
    requiredFeatures: [
      "Menù digitale",
      "Prenotazione",
      "WhatsApp",
      "Google Maps",
      "Orari",
      "Gallery food",
    ],
    commercialServices: [
      "Sito web",
      "SEO locale",
      "Google Business",
      "Social media",
      "Foto e video",
      "Menù digitale",
      "Automazioni WhatsApp",
    ],
    demoArchetypes: [
      "Luxury dining",
      "Commercial AYCE",
      "Street food",
      "Minimal restaurant",
    ],
  },

  {
    id: "hotel",
    name: "Hospitality",
    shortName: "Hotel & Tourism",
    description:
      "Hotel, resort, B&B, masserie, affittacamere e strutture turistiche.",
    icon: Hotel,
    status: "beta",
    accent: "#74a7c7",
    glow: "rgba(116,167,199,0.18)",
    examples: [
      "Hotel",
      "Resort",
      "B&B",
      "Masseria",
      "Casa vacanze",
    ],
    analysisAreas: [
      {
        id: "booking",
        label: "Booking",
        description: "Disponibilità, tariffe e prenotazione diretta.",
      },
      {
        id: "rooms",
        label: "Camere",
        description: "Presentazione, servizi e differenziazione.",
      },
      {
        id: "experience",
        label: "Esperienza",
        description: "Territorio, servizi e valore percepito.",
      },
      {
        id: "ota",
        label: "Dipendenza OTA",
        description: "Bilanciamento tra portali e prenotazioni dirette.",
      },
    ],
    conversionGoals: [
      { id: "book-room", label: "Prenotazione diretta" },
      { id: "availability", label: "Verifica disponibilità" },
      { id: "quote", label: "Richiesta preventivo" },
      { id: "call", label: "Contatto struttura" },
    ],
    requiredFeatures: [
      "Booking engine",
      "Camere",
      "Gallery",
      "Esperienze",
      "Multilingua",
      "Mappe",
    ],
    commercialServices: [
      "Sito hospitality",
      "Booking diretto",
      "SEO turistico",
      "Google Hotel",
      "Foto e video",
      "Campagne",
    ],
    demoArchetypes: [
      "Luxury resort",
      "Boutique hotel",
      "Mediterranean hospitality",
      "Urban hotel",
    ],
  },

  {
    id: "healthcare",
    name: "Sanità e benessere",
    shortName: "Healthcare",
    description:
      "Dentisti, poliambulatori, cliniche, fisioterapia e professionisti sanitari.",
    icon: Stethoscope,
    status: "beta",
    accent: "#68b5a6",
    glow: "rgba(104,181,166,0.18)",
    examples: [
      "Dentista",
      "Clinica",
      "Fisioterapia",
      "Poliambulatorio",
      "Centro medico",
    ],
    analysisAreas: [
      {
        id: "trust",
        label: "Fiducia",
        description: "Equipe, autorevolezza e rassicurazione.",
      },
      {
        id: "services",
        label: "Prestazioni",
        description: "Chiarezza dei servizi e dei percorsi.",
      },
      {
        id: "booking",
        label: "Prenotazioni",
        description: "Contatto, urgenze e appuntamenti.",
      },
      {
        id: "compliance",
        label: "Conformità",
        description: "Privacy, comunicazione e correttezza informativa.",
      },
    ],
    conversionGoals: [
      { id: "appointment", label: "Prenota visita" },
      { id: "emergency", label: "Richiesta urgente" },
      { id: "call", label: "Telefonata" },
      { id: "information", label: "Richiesta informazioni" },
    ],
    requiredFeatures: [
      "Prestazioni",
      "Equipe",
      "Prenotazioni",
      "FAQ",
      "Privacy",
      "Recensioni",
    ],
    commercialServices: [
      "Sito sanitario",
      "SEO locale",
      "Google Business",
      "Campagne lead",
      "Automazioni appuntamenti",
      "GDPR",
    ],
    demoArchetypes: [
      "Clinical premium",
      "Human healthcare",
      "Medical minimal",
      "Wellness clinic",
    ],
  },

  {
    id: "fitness",
    name: "Fitness e sport",
    shortName: "Fitness",
    description:
      "Palestre, personal trainer, box, centri sportivi e associazioni.",
    icon: Dumbbell,
    status: "beta",
    accent: "#dd7658",
    glow: "rgba(221,118,88,0.18)",
    examples: [
      "Palestra",
      "CrossFit",
      "Personal trainer",
      "Centro sportivo",
    ],
    analysisAreas: [
      {
        id: "membership",
        label: "Abbonamenti",
        description: "Offerta, prove e iscrizioni.",
      },
      {
        id: "classes",
        label: "Corsi",
        description: "Calendario, istruttori e disponibilità.",
      },
      {
        id: "community",
        label: "Community",
        description: "Risultati, persone e senso di appartenenza.",
      },
      {
        id: "lead",
        label: "Lead generation",
        description: "Prova gratuita e contatto commerciale.",
      },
    ],
    conversionGoals: [
      { id: "free-trial", label: "Prova gratuita" },
      { id: "membership", label: "Richiesta abbonamento" },
      { id: "class", label: "Prenota corso" },
      { id: "whatsapp", label: "Contatto WhatsApp" },
    ],
    requiredFeatures: [
      "Corsi",
      "Calendario",
      "Trainer",
      "Abbonamenti",
      "Prova gratuita",
      "Risultati",
    ],
    commercialServices: [
      "Sito fitness",
      "Lead generation",
      "Social media",
      "Video",
      "Campagne Meta",
      "CRM iscritti",
    ],
    demoArchetypes: [
      "Performance dark",
      "Fitness energetic",
      "Premium wellness",
      "Community sport",
    ],
  },

  {
    id: "automotive",
    name: "Automotive",
    shortName: "Automotive",
    description:
      "Concessionarie, officine, noleggio, carrozzerie e servizi per veicoli.",
    icon: Car,
    status: "beta",
    accent: "#8c9fca",
    glow: "rgba(140,159,202,0.18)",
    examples: [
      "Concessionaria",
      "Officina",
      "Noleggio",
      "Carrozzeria",
    ],
    analysisAreas: [
      {
        id: "inventory",
        label: "Veicoli e servizi",
        description: "Catalogo, filtri e chiarezza dell’offerta.",
      },
      {
        id: "lead",
        label: "Lead",
        description: "Preventivi, test drive e contatti.",
      },
      {
        id: "trust",
        label: "Affidabilità",
        description: "Recensioni, garanzie e reputazione.",
      },
      {
        id: "local",
        label: "Presenza locale",
        description: "Google, mappe e ricerche territoriali.",
      },
    ],
    conversionGoals: [
      { id: "quote", label: "Richiedi preventivo" },
      { id: "test-drive", label: "Prenota test drive" },
      { id: "appointment", label: "Prenota officina" },
      { id: "call", label: "Telefonata" },
    ],
    requiredFeatures: [
      "Catalogo",
      "Filtri",
      "Preventivo",
      "Test drive",
      "WhatsApp",
      "Mappe",
    ],
    commercialServices: [
      "Portale automotive",
      "CRM lead",
      "Google Ads",
      "SEO locale",
      "Foto veicoli",
      "Automazioni",
    ],
    demoArchetypes: [
      "Automotive premium",
      "Dealer performance",
      "Workshop industrial",
      "Mobility clean",
    ],
  },

  {
    id: "industry",
    name: "Industria e B2B",
    shortName: "Industry",
    description:
      "Aziende produttive, manifattura, logistica, impiantistica e servizi B2B.",
    icon: Factory,
    status: "beta",
    accent: "#a8aeb5",
    glow: "rgba(168,174,181,0.16)",
    examples: [
      "Industria",
      "Produzione",
      "Logistica",
      "Impiantistica",
      "B2B",
    ],
    analysisAreas: [
      {
        id: "positioning",
        label: "Posizionamento B2B",
        description: "Competenze, settori e differenziazione.",
      },
      {
        id: "lead",
        label: "Lead generation",
        description: "Richieste commerciali e contatti qualificati.",
      },
      {
        id: "technical",
        label: "Contenuti tecnici",
        description: "Prodotti, certificazioni e documentazione.",
      },
      {
        id: "international",
        label: "Mercati",
        description: "Export, lingue e presenza internazionale.",
      },
    ],
    conversionGoals: [
      { id: "quote", label: "Richiesta offerta" },
      { id: "catalogue", label: "Scarica catalogo" },
      { id: "contact", label: "Contatto commerciale" },
      { id: "meeting", label: "Prenota incontro" },
    ],
    requiredFeatures: [
      "Settori",
      "Prodotti",
      "Case study",
      "Certificazioni",
      "Download",
      "Multilingua",
    ],
    commercialServices: [
      "Sito corporate",
      "Lead generation",
      "SEO B2B",
      "LinkedIn",
      "CRM",
      "Automazioni commerciali",
    ],
    demoArchetypes: [
      "Industrial precision",
      "Corporate technology",
      "Engineering editorial",
      "B2B minimal",
    ],
  },

  {
    id: "professional",
    name: "Professionisti",
    shortName: "Professional Services",
    description:
      "Studi legali, commercialisti, consulenti, ingegneri e professionisti.",
    icon: Scale,
    status: "beta",
    accent: "#b694cc",
    glow: "rgba(182,148,204,0.18)",
    examples: [
      "Avvocato",
      "Commercialista",
      "Consulente",
      "Ingegnere",
    ],
    analysisAreas: [
      {
        id: "authority",
        label: "Autorevolezza",
        description: "Competenze, casi e posizionamento.",
      },
      {
        id: "services",
        label: "Servizi",
        description: "Aree di intervento e chiarezza.",
      },
      {
        id: "lead",
        label: "Contatti",
        description: "Consulenze, appuntamenti e richieste.",
      },
      {
        id: "content",
        label: "Contenuti",
        description: "Approfondimenti e visibilità organica.",
      },
    ],
    conversionGoals: [
      { id: "consultation", label: "Prenota consulenza" },
      { id: "contact", label: "Richiesta informazioni" },
      { id: "call", label: "Telefonata" },
      { id: "document", label: "Invio documentazione" },
    ],
    requiredFeatures: [
      "Professionisti",
      "Competenze",
      "Servizi",
      "Articoli",
      "Contatti",
      "Prenotazione",
    ],
    commercialServices: [
      "Sito professionale",
      "SEO",
      "Personal branding",
      "Lead generation",
      "Content marketing",
      "Automazioni",
    ],
    demoArchetypes: [
      "Professional editorial",
      "Legal authority",
      "Consulting premium",
      "Minimal expertise",
    ],
  },

  {
    id: "real_estate",
    name: "Immobiliare",
    shortName: "Real Estate",
    description:
      "Agenzie immobiliari, property manager, costruttori e consulenti.",
    icon: House,
    status: "planned",
    accent: "#83b7a0",
    glow: "rgba(131,183,160,0.18)",
    examples: [
      "Agenzia immobiliare",
      "Property manager",
      "Costruttore",
    ],
    analysisAreas: [],
    conversionGoals: [
      { id: "valuation", label: "Richiedi valutazione" },
      { id: "visit", label: "Prenota visita" },
      { id: "property", label: "Richiedi immobile" },
    ],
    requiredFeatures: [
      "Immobili",
      "Ricerca",
      "Valutazioni",
      "Visite",
      "Mappe",
    ],
    commercialServices: [
      "Portale immobiliare",
      "CRM",
      "Lead generation",
      "Campagne",
    ],
    demoArchetypes: ["Luxury property", "Urban estate"],
  },

  {
    id: "retail",
    name: "Retail e commercio",
    shortName: "Retail",
    description:
      "Negozi, showroom, ecommerce, attività commerciali e servizi locali.",
    icon: ShoppingBag,
    status: "planned",
    accent: "#d991a8",
    glow: "rgba(217,145,168,0.18)",
    examples: [
      "Negozio",
      "Showroom",
      "Ecommerce",
      "Attività locale",
    ],
    analysisAreas: [],
    conversionGoals: [
      { id: "purchase", label: "Acquisto" },
      { id: "visit", label: "Visita in negozio" },
      { id: "contact", label: "Richiesta prodotto" },
    ],
    requiredFeatures: [
      "Prodotti",
      "Catalogo",
      "Ecommerce",
      "Store locator",
    ],
    commercialServices: [
      "Ecommerce",
      "Sito retail",
      "Campagne",
      "Social commerce",
    ],
    demoArchetypes: ["Editorial retail", "Commerce conversion"],
  },
];

export function getSector(
  sectorId: SectorId,
): SectorDefinition | undefined {
  return sectorRegistry.find((sector) => sector.id === sectorId);
}

export function isSectorId(value: string): value is SectorId {
  return sectorRegistry.some((sector) => sector.id === value);
}

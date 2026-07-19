export type DemoRestaurantStatus =
  | "Audit completato"
  | "Report generato"
  | "Concept pronto"
  | "Proposta inviata"
  | "In revisione";

export type DemoRestaurant = {
  id: string;
  projectCode: string;
  name: string;
  city: string;
  category: string;
  score: number;
  opportunityValue: number;
  status: DemoRestaurantStatus;
  primaryNeed: string;
  progress: number;
  lastActivity: string;
  demo: true;
};

export const demoRestaurants: DemoRestaurant[] = [
  {
    id: "sakura-house",
    projectCode: "UARE-2026-0018",
    name: "Sakura House",
    city: "Bari",
    category: "Sushi premium",
    score: 54,
    opportunityValue: 5800,
    status: "Report generato",
    primaryNeed: "Restyling sito web",
    progress: 76,
    lastActivity: "12 minuti fa",
    demo: true,
  },
  {
    id: "kyoto-fusion",
    projectCode: "UARE-2026-0017",
    name: "Kyoto Fusion",
    city: "Lecce",
    category: "Asian fusion",
    score: 61,
    opportunityValue: 3950,
    status: "Proposta inviata",
    primaryNeed: "Strategia social",
    progress: 88,
    lastActivity: "48 minuti fa",
    demo: true,
  },
  {
    id: "tokyo-garden",
    projectCode: "UARE-2026-0016",
    name: "Tokyo Garden",
    city: "Taranto",
    category: "All you can eat",
    score: 49,
    opportunityValue: 4700,
    status: "Concept pronto",
    primaryNeed: "Google e conversione",
    progress: 67,
    lastActivity: "Oggi, 10:42",
    demo: true,
  },
  {
    id: "hikari-sushi",
    projectCode: "UARE-2026-0015",
    name: "Hikari Sushi",
    city: "Brindisi",
    category: "Sushi restaurant",
    score: 67,
    opportunityValue: 2900,
    status: "In revisione",
    primaryNeed: "Prenotazioni online",
    progress: 52,
    lastActivity: "Ieri, 18:20",
    demo: true,
  },
  {
    id: "dragon-wok",
    projectCode: "UARE-2026-0014",
    name: "Dragon Wok",
    city: "Matera",
    category: "Cucina cinese",
    score: 46,
    opportunityValue: 6200,
    status: "Audit completato",
    primaryNeed: "Sito, menù e branding",
    progress: 61,
    lastActivity: "Ieri, 15:12",
    demo: true,
  },
];

export const dashboardMetrics = {
  completedAudits: 18,
  generatedReports: 16,
  opportunityValue: 96400,
  averageScore: 58,
  activeProjects: 7,
  proposalsSent: 6,
};

export const pipelineStages = [
  { label: "Audit", value: 18, percentage: 100 },
  { label: "Report", value: 16, percentage: 89 },
  { label: "Concept", value: 11, percentage: 61 },
  { label: "Proposte", value: 6, percentage: 33 },
  { label: "Progetti avviati", value: 3, percentage: 17 },
];

export const opportunityBreakdown = [
  { label: "Sito web premium", value: 89 },
  { label: "SEO e Google Business", value: 76 },
  { label: "Gestione social", value: 71 },
  { label: "Menù digitale", value: 64 },
  { label: "Food photography", value: 52 },
];

export type RestaurantCategory =
  | "Sushi e cucina giapponese"
  | "Ristorante cinese"
  | "Asian fusion"
  | "Poké"
  | "Ramen restaurant"
  | "Ristorante coreano"
  | "Ristorante thailandese";

export type QuickAuditInput = {
  restaurantName: string;
  city: string;
  contactPerson: string;
  category: RestaurantCategory;
  website: string;
  googleBusiness: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  currentMenu: string;
  notes: string;
};

export type QuickAuditAreaId =
  | "brand"
  | "website"
  | "mobile"
  | "seo"
  | "google"
  | "social"
  | "menu"
  | "content"
  | "conversion";

export type QuickAuditArea = {
  id: QuickAuditAreaId;
  label: string;
  score: number;
  status: "critica" | "prioritaria" | "migliorabile" | "solida";
  summary: string;
  findings: string[];
  recommendations: string[];
};

export type RecommendedService = {
  id: string;
  name: string;
  description: string;
  priority: 1 | 2 | 3 | 4 | 5;
  priceFrom: number;
  selected: boolean;
};

export type QuickAuditResult = {
  auditCode: string;
  generatedAt: string;
  overallScore: number;
  scoreLabel: string;
  executiveSummary: string;
  areas: QuickAuditArea[];
  strongestArea: QuickAuditAreaId;
  weakestArea: QuickAuditAreaId;
  criticalFindings: string[];
  opportunities: string[];
  services: RecommendedService[];
  estimatedInvestment: {
    minimum: number;
    maximum: number;
    recommended: number;
  };
  input: QuickAuditInput;
  demoAnalysis: true;
};

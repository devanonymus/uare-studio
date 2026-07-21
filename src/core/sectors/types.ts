import type { LucideIcon } from "lucide-react";

export type SectorId =
  | "restaurant"
  | "hotel"
  | "healthcare"
  | "fitness"
  | "automotive"
  | "industry"
  | "professional"
  | "real_estate"
  | "retail";

export type SectorMetric = {
  id: string;
  label: string;
  description: string;
};

export type SectorConversionGoal = {
  id: string;
  label: string;
};

export type SectorDefinition = {
  id: SectorId;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;

  status: "active" | "beta" | "planned";

  accent: string;
  glow: string;

  examples: string[];

  analysisAreas: SectorMetric[];
  conversionGoals: SectorConversionGoal[];
  requiredFeatures: string[];
  commercialServices: string[];

  demoArchetypes: string[];
};

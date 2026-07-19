export type AuditPriority = "bassa" | "media" | "alta" | "critica";

export type AuditQuestion = {
  id: string;
  title: string;
  description: string;
  weight: number;
};

export type AuditSection = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  questions: AuditQuestion[];
};

export type AuditAnswer = {
  score: number;
  note: string;
};

export type AuditAnswers = Record<string, AuditAnswer>;

export type RestaurantData = {
  restaurantName: string;
  projectName: string;
  city: string;
  contactPerson: string;
  website: string;
  googleBusiness: string;
  instagram: string;
  category: string;
};

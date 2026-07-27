import type {
  CreateBusinessInput,
  CreateMemoryEntryInput,
  CreateOrganisationInput,
} from "@/core/business-memory/schema";

export type OrganisationRecord = {
  id: string;
  name: string;
  legalName: string | null;
  vatNumber: string | null;
  countryCode: string;
  timezone: string;
  createdAt: string;
};

export type BusinessRecord = {
  id: string;
  organisationId: string;
  name: string;
  sector: string;
  city: string | null;
  websiteUrl: string | null;
  primaryGoal: string | null;
  lifecycleStage: string;
  createdAt: string;
};

export type MemoryEntryRecord = {
  id: string;
  businessId: string;
  category: string;
  memoryKey: string;
  value: unknown;
  status: string;
  confidence: number;
  sourceType: string;
  sourceReference: string | null;
  version: number;
  isCurrent: boolean;
  createdAt: string;
};

export interface BusinessMemoryRepository {
  createOrganisation(
    input: CreateOrganisationInput,
  ): Promise<OrganisationRecord>;

  createBusiness(
    input: CreateBusinessInput,
  ): Promise<BusinessRecord>;

  getBusiness(
    businessId: string,
  ): Promise<BusinessRecord | null>;

  listBusinesses(
    organisationId: string,
  ): Promise<BusinessRecord[]>;

  addMemoryEntry(
    input: CreateMemoryEntryInput,
  ): Promise<MemoryEntryRecord>;

  getCurrentMemory(
    businessId: string,
  ): Promise<MemoryEntryRecord[]>;
}

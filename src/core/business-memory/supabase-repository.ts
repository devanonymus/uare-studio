import { getSupabaseAdmin } from "@/core/database/supabase-admin";
import type {
  BusinessMemoryRepository,
  BusinessRecord,
  MemoryEntryRecord,
  OrganisationRecord,
} from "@/core/business-memory/repository";
import type {
  CreateBusinessInput,
  CreateMemoryEntryInput,
  CreateOrganisationInput,
} from "@/core/business-memory/schema";

function mapOrganisation(
  row: Record<string, unknown>,
): OrganisationRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    legalName:
      row.legal_name === null
        ? null
        : String(row.legal_name),
    vatNumber:
      row.vat_number === null
        ? null
        : String(row.vat_number),
    countryCode: String(row.country_code),
    timezone: String(row.timezone),
    createdAt: String(row.created_at),
  };
}

function mapBusiness(
  row: Record<string, unknown>,
): BusinessRecord {
  return {
    id: String(row.id),
    organisationId: String(
      row.organisation_id,
    ),
    name: String(row.name),
    sector: String(row.sector),
    city:
      row.city === null
        ? null
        : String(row.city),
    websiteUrl:
      row.website_url === null
        ? null
        : String(row.website_url),
    primaryGoal:
      row.primary_goal === null
        ? null
        : String(row.primary_goal),
    lifecycleStage: String(
      row.lifecycle_stage,
    ),
    createdAt: String(row.created_at),
  };
}

function mapMemoryEntry(
  row: Record<string, unknown>,
): MemoryEntryRecord {
  return {
    id: String(row.id),
    businessId: String(row.business_id),
    category: String(row.category),
    memoryKey: String(row.memory_key),
    value: row.value,
    status: String(row.status),
    confidence: Number(row.confidence),
    sourceType: String(row.source_type),
    sourceReference:
      row.source_reference === null
        ? null
        : String(row.source_reference),
    version: Number(row.version),
    isCurrent: Boolean(row.is_current),
    createdAt: String(row.created_at),
  };
}

export class SupabaseBusinessMemoryRepository
  implements BusinessMemoryRepository
{
  async createOrganisation(
    input: CreateOrganisationInput,
  ): Promise<OrganisationRecord> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("organisations")
      .insert({
        name: input.name,
        legal_name: input.legalName ?? null,
        vat_number: input.vatNumber ?? null,
        country_code: input.countryCode,
        timezone: input.timezone,
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(
        `Creazione organizzazione fallita: ${error.message}`,
      );
    }

    return mapOrganisation(data);
  }

  async createBusiness(
    input: CreateBusinessInput,
  ): Promise<BusinessRecord> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("businesses")
      .insert({
        organisation_id:
          input.organisationId,

        name: input.name,
        sector: input.sector,
        city: input.city ?? null,

        website_url:
          input.websiteUrl || null,

        primary_goal:
          input.primaryGoal ?? null,

        lifecycle_stage:
          input.lifecycleStage,
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(
        `Creazione azienda fallita: ${error.message}`,
      );
    }

    return mapBusiness(data);
  }

  async getBusiness(
    businessId: string,
  ): Promise<BusinessRecord | null> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Lettura azienda fallita: ${error.message}`,
      );
    }

    return data ? mapBusiness(data) : null;
  }

  async listBusinesses(
    organisationId: string,
  ): Promise<BusinessRecord[]> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq(
        "organisation_id",
        organisationId,
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw new Error(
        `Lettura aziende fallita: ${error.message}`,
      );
    }

    return (data ?? []).map(mapBusiness);
  }

  async addMemoryEntry(
    input: CreateMemoryEntryInput,
  ): Promise<MemoryEntryRecord> {
    const supabase = getSupabaseAdmin();

    const { data: previousEntries, error } =
      await supabase
        .from("business_memory_entries")
        .select("id, version")
        .eq("business_id", input.businessId)
        .eq("category", input.category)
        .eq("memory_key", input.memoryKey)
        .eq("is_current", true)
        .order("version", {
          ascending: false,
        });

    if (error) {
      throw new Error(
        `Controllo memoria fallito: ${error.message}`,
      );
    }

    const latestVersion =
      previousEntries?.[0]?.version ?? 0;

    if (
      previousEntries &&
      previousEntries.length > 0
    ) {
      const ids = previousEntries.map(
        (entry) => entry.id,
      );

      const { error: archiveError } =
        await supabase
          .from("business_memory_entries")
          .update({
            is_current: false,
            valid_until:
              new Date().toISOString(),
          })
          .in("id", ids);

      if (archiveError) {
        throw new Error(
          `Versionamento memoria fallito: ${archiveError.message}`,
        );
      }
    }

    const { data, error: insertError } =
      await supabase
        .from("business_memory_entries")
        .insert({
          business_id: input.businessId,
          category: input.category,
          memory_key: input.memoryKey,
          value: input.value,
          status: input.status,
          confidence: input.confidence,
          source_type: input.sourceType,

          source_reference:
            input.sourceReference ?? null,

          version:
            Number(latestVersion) + 1,

          is_current: true,

          verified_at:
            input.status === "verified"
              ? new Date().toISOString()
              : null,

          created_by: input.createdBy,
        })
        .select("*")
        .single();

    if (insertError) {
      throw new Error(
        `Scrittura memoria fallita: ${insertError.message}`,
      );
    }

    return mapMemoryEntry(data);
  }

  async getCurrentMemory(
    businessId: string,
  ): Promise<MemoryEntryRecord[]> {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("business_memory_entries")
      .select("*")
      .eq("business_id", businessId)
      .eq("is_current", true)
      .order("category")
      .order("memory_key");

    if (error) {
      throw new Error(
        `Lettura memoria fallita: ${error.message}`,
      );
    }

    return (data ?? []).map(mapMemoryEntry);
  }
}

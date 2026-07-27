import { getSupabaseAdmin } from "@/core/database/supabase-admin";

export type AuditEventInput = {
  organisationId?: string;
  businessId?: string;

  actorType:
    | "user"
    | "agent"
    | "automation"
    | "system"
    | "integration";

  actorId: string;

  eventType: string;
  resourceType: string;
  resourceId?: string;
  action: string;

  previousState?: unknown;
  nextState?: unknown;

  evidence?: unknown[];

  requestId?: string;
  traceId?: string;
};

export async function writeAuditEvent(
  input: AuditEventInput,
): Promise<void> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("audit_events")
    .insert({
      organisation_id:
        input.organisationId ?? null,

      business_id:
        input.businessId ?? null,

      actor_type: input.actorType,
      actor_id: input.actorId,

      event_type: input.eventType,
      resource_type: input.resourceType,

      resource_id:
        input.resourceId ?? null,

      action: input.action,

      previous_state:
        input.previousState ?? null,

      next_state:
        input.nextState ?? null,

      evidence: input.evidence ?? [],

      request_id:
        input.requestId ?? null,

      trace_id:
        input.traceId ?? null,
    });

  if (error) {
    throw new Error(
      `Scrittura audit log fallita: ${error.message}`,
    );
  }
}

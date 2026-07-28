import { NextResponse } from "next/server";
import { z } from "zod";
import {
  CreateBusinessSchema,
  CreateMemoryEntrySchema,
  CreateOrganisationSchema,
} from "@/core/business-memory/schema";
import { SupabaseBusinessMemoryRepository } from "@/core/business-memory/supabase-repository";
import { writeAuditEvent } from "@/core/audit-log/logger";

export const runtime = "nodejs";

const BootstrapSchema = z.object({
  organisation: CreateOrganisationSchema,

  business: CreateBusinessSchema.omit({
    organisationId: true,
  }),

  memory: z
    .array(
      CreateMemoryEntrySchema.omit({
        businessId: true,
      }),
    )
    .max(50)
    .default([]),
});

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const traceId = `bootstrap-${Date.now()}`;

  try {
    const body = await request.json();
    const input = BootstrapSchema.parse(body);

    const repository =
      new SupabaseBusinessMemoryRepository();

    const organisation =
      await repository.createOrganisation(
        input.organisation,
      );

    const business =
      await repository.createBusiness({
        ...input.business,
        organisationId: organisation.id,
      });

    const memoryEntries = [];

    for (const entry of input.memory) {
      const created =
        await repository.addMemoryEntry({
          ...entry,
          businessId: business.id,
        });

      memoryEntries.push(created);
    }

    await writeAuditEvent({
      organisationId: organisation.id,
      businessId: business.id,
      actorType: "system",
      actorId: "uviq-bootstrap",
      eventType: "workspace_bootstrapped",
      resourceType: "business",
      resourceId: business.id,
      action:
        "Creazione organizzazione, azienda e Business Memory iniziale.",
      nextState: {
        organisation,
        business,
        memoryEntriesCreated:
          memoryEntries.length,
      },
      requestId,
      traceId,
    });

    return NextResponse.json(
      {
        status: "completed",
        organisation,
        business,
        memoryEntries,
        requestId,
        traceId,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "UVIQ bootstrap error:",
      error,
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "failed",
          error: "Dati bootstrap non validi.",
          issues: error.issues,
          requestId,
          traceId,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        status: "failed",
        error:
          error instanceof Error
            ? error.message
            : "Errore sconosciuto durante il bootstrap.",
        requestId,
        traceId,
      },
      {
        status: 500,
      },
    );
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/core/database/supabase-admin";
import {
  getIntegrationDefinition,
} from "@/core/integrations/registry";
import {
  inspectIntegrationConfiguration,
} from "@/core/integrations/configuration";
import { writeAuditEvent } from "@/core/audit-log/logger";

export const runtime = "nodejs";

const BodySchema = z.object({
  businessId: z.string().uuid(),

  actorId: z
    .string()
    .trim()
    .min(2)
    .max(160)
    .default("workspace-owner"),
});

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      provider: string;
    }>;
  },
) {
  const requestId =
    crypto.randomUUID();

  try {
    const { provider } =
      await context.params;

    const definition =
      getIntegrationDefinition(
        provider,
      );

    if (!definition) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Provider non supportato.",
        },
        {
          status: 404,
        },
      );
    }

    const body = BodySchema.parse(
      await request.json(),
    );

    const configuration =
      inspectIntegrationConfiguration(
        definition,
      );

    const supabase =
      getSupabaseAdmin();

    const {
      data: business,
      error: businessError,
    } = await supabase
      .from("businesses")
      .select(
        "id, organisation_id",
      )
      .eq(
        "id",
        body.businessId,
      )
      .single();

    if (
      businessError ||
      !business
    ) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Azienda non trovata.",
        },
        {
          status: 404,
        },
      );
    }

    const testedAt =
      new Date().toISOString();

    const nextStatus =
      configuration.configured
        ? "configuration_detected"
        : "not_configured";

    const {
      data: connection,
      error: connectionError,
    } = await supabase
      .from(
        "integration_connections",
      )
      .update({
        status: nextStatus,
        last_tested_at: testedAt,

        last_success_at:
          configuration.configured
            ? testedAt
            : null,

        last_error_at:
          configuration.configured
            ? null
            : testedAt,

        last_error_message:
          configuration.configured
            ? null
            : `Variabili mancanti: ${configuration.missingVariables.join(", ")}`,

        metadata: {
          configurationOnly: true,
          readiness:
            configuration.readiness,
          missingVariables:
            configuration.missingVariables,
        },
      })
      .eq(
        "business_id",
        body.businessId,
      )
      .eq(
        "provider",
        definition.provider,
      )
      .select("*")
      .single();

    if (connectionError) {
      throw new Error(
        connectionError.message,
      );
    }

    await supabase
      .from("integration_events")
      .insert({
        integration_id:
          connection.id,

        organisation_id:
          business.organisation_id,

        business_id:
          body.businessId,

        provider:
          definition.provider,

        event_type:
          "configuration_test",

        status:
          configuration.configured
            ? "success"
            : "blocked",

        message:
          configuration.configured
            ? "Configurazione server rilevata. Connessione API esterna non ancora verificata."
            : `Configurazione incompleta: ${configuration.missingVariables.join(", ")}`,

        request_id:
          requestId,

        metadata: {
          readiness:
            configuration.readiness,

          externalConnectionTested:
            false,
        },
      });

    await writeAuditEvent({
      organisationId:
        business.organisation_id,

      businessId:
        body.businessId,

      actorType: "user",

      actorId:
        body.actorId,

      eventType:
        "integration_configuration_tested",

      resourceType:
        "integration",

      resourceId:
        connection.id,

      action:
        `Controllo configurazione ${definition.name}`,

      nextState: {
        provider:
          definition.provider,

        configured:
          configuration.configured,

        readiness:
          configuration.readiness,

        externalConnectionTested:
          false,
      },

      requestId,
    });

    return NextResponse.json({
      status:
        configuration.configured
          ? "configuration_detected"
          : "configuration_required",

      provider:
        definition.provider,

      readiness:
        configuration.readiness,

      missingVariables:
        configuration.missingVariables,

      externalConnectionTested:
        false,

      message:
        configuration.configured
          ? "Credenziali server rilevate. Il test API reale verrà implementato nell’adapter del provider."
          : "Configurazione server incompleta.",
    });
  } catch (error) {
    console.error(
      "Integration test error:",
      error,
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Dati non validi.",
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
            : "Errore sconosciuto.",
      },
      {
        status: 500,
      },
    );
  }
}

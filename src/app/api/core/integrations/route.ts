import {
  NextRequest,
  NextResponse,
} from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/core/database/supabase-admin";
import { inspectAllIntegrations } from "@/core/integrations/configuration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  businessId: z.string().uuid(),
});

export async function GET(
  request: NextRequest,
) {
  try {
    const { businessId } =
      QuerySchema.parse({
        businessId:
          request.nextUrl.searchParams.get(
            "businessId",
          ),
      });

    const supabase =
      getSupabaseAdmin();

    const {
      data: business,
      error: businessError,
    } = await supabase
      .from("businesses")
      .select(
        "id, organisation_id, name",
      )
      .eq("id", businessId)
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

    const inspected =
      inspectAllIntegrations();

    for (const item of inspected) {
      const detected =
        item.configuration.configured;

      const { error } =
        await supabase
          .from(
            "integration_connections",
          )
          .upsert(
            {
              organisation_id:
                business.organisation_id,

              business_id:
                businessId,

              provider:
                item.definition.provider,

              display_name:
                item.definition.name,

              status: detected
                ? "configuration_detected"
                : "not_configured",

              secret_reference:
                detected
                  ? item.definition
                      .requiredEnvironmentVariables
                      .join(",")
                  : null,

              capabilities:
                item.definition.capabilities,

              enabled: false,

              metadata: {
                category:
                  item.definition.category,

                readiness:
                  item.configuration.readiness,

                missingVariables:
                  item.configuration
                    .missingVariables,
              },
            },
            {
              onConflict:
                "organisation_id,business_id,provider",
            },
          );

      if (error) {
        throw new Error(
          `Sincronizzazione ${item.definition.provider} fallita: ${error.message}`,
        );
      }
    }

    const {
      data: connections,
      error: connectionsError,
    } = await supabase
      .from("integration_connections")
      .select("*")
      .eq(
        "business_id",
        businessId,
      )
      .order("provider");

    if (connectionsError) {
      throw new Error(
        connectionsError.message,
      );
    }

    const responseItems =
      inspected.map((item) => {
        const connection =
          connections?.find(
            (entry) =>
              entry.provider ===
              item.definition.provider,
          );

        return {
          ...item.definition,

          configuration: {
            configured:
              item.configuration
                .configured,

            readiness:
              item.configuration
                .readiness,

            missingVariables:
              item.configuration
                .missingVariables,
          },

          connection:
            connection ?? null,
        };
      });

    return NextResponse.json({
      status: "completed",
      business,
      integrations:
        responseItems,
    });
  } catch (error) {
    console.error(
      "Integration Hub API error:",
      error,
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Business ID non valido.",
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

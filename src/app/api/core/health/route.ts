import { NextResponse } from "next/server";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/core/database/supabase-admin";

export const runtime = "nodejs";

export async function GET() {
  const configured =
    isSupabaseConfigured();

  if (!configured) {
    return NextResponse.json(
      {
        service: "uviq-core",
        status: "configuration_required",

        database: {
          provider: "supabase-postgresql",
          configured: false,
          reachable: false,
        },

        requiredEnvironmentVariables: [
          "NEXT_PUBLIC_SUPABASE_URL",
          "SUPABASE_SERVICE_ROLE_KEY",
        ],

        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
      },
    );
  }

  try {
    const supabase =
      getSupabaseAdmin();

    const { error } = await supabase
      .from("organisations")
      .select("id", {
        count: "exact",
        head: true,
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      service: "uviq-core",
      status: "healthy",

      database: {
        provider: "supabase-postgresql",
        configured: true,
        reachable: true,
      },

      modules: {
        businessMemory: "ready",
        evidenceRegistry: "ready",
        missionEngine: "ready",
        approvalEngine: "ready",
        automationEngine: "schema_ready",
        auditLog: "ready",
      },

      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        service: "uviq-core",
        status: "database_unreachable",

        database: {
          provider: "supabase-postgresql",
          configured: true,
          reachable: false,
        },

        error:
          error instanceof Error
            ? error.message
            : "Errore database sconosciuto",

        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
      },
    );
  }
}

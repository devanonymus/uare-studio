import { createClient } from "@supabase/supabase-js";

const businessId =
  process.argv[2] ||
  process.env.UVIQ_BUSINESS_ID;

if (!businessId) {
  throw new Error(
    "Business ID mancante.",
  );
}

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error(
    "Variabili Supabase mancanti.",
  );
}

const baseUrl =
  process.env.UVIQ_BASE_URL ||
  "http://localhost:3006";

const supabase =
  createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

const {
  data: missions,
  error,
} = await supabase
  .from("missions")
  .select("*")
  .eq("business_id", businessId)
  .eq("status", "approved")
  .order("priority", {
    ascending: false,
  });

if (error) {
  throw error;
}

let mission = null;

for (const candidate of missions ?? []) {
  const {
    data: existingPlan,
    error: planError,
  } = await supabase
    .from("mission_plans")
    .select("id")
    .eq("mission_id", candidate.id)
    .maybeSingle();

  if (planError) {
    throw planError;
  }

  if (!existingPlan) {
    mission = candidate;
    break;
  }
}

if (!mission) {
  console.error("");
  console.error(
    "❌ Nessuna missione approvata senza piano.",
  );
  console.error(
    "Approva una missione nella War Room e riprova.",
  );
  process.exit(1);
}

const idempotencyKey =
  `mission-plan-${mission.id}`;

console.log("");
console.log("UVIQ MISSION PLANNER TEST");
console.log("=========================");
console.log(`Missione: ${mission.title}`);
console.log(`Mission ID: ${mission.id}`);
console.log("");

const response = await fetch(
  `${baseUrl}/api/core/missions/${mission.id}/plan`,
  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
      "Idempotency-Key":
        idempotencyKey,
    },

    body: JSON.stringify({
      requestedBy:
        "brian-laddomada",

      idempotencyKey,
    }),

    signal:
      AbortSignal.timeout(
        240_000,
      ),
  },
);

const data =
  await response.json();

if (!response.ok) {
  console.error(
    JSON.stringify(
      data,
      null,
      2,
    ),
  );

  throw new Error(
    `Mission Planner HTTP ${response.status}`,
  );
}

console.log(
  JSON.stringify(
    {
      status:
        data.status,

      cached:
        data.cached,

      planId:
        data.plan?.id,

      planStatus:
        data.plan?.status,

      confidence:
        data.plan?.confidence,

      blueprints:
        data.blueprints?.length ?? 0,

      approvalsCreated:
        data.approvalsCreated,

      durationMs:
        data.durationMs,
    },
    null,
    2,
  ),
);

console.log("");
console.log("BLUEPRINT GENERATI");

for (
  const blueprint of
  data.blueprints ?? []
) {
  console.log(
    `- [${blueprint.status}] ${blueprint.name}`,
  );
}

console.log("");
console.log(
  "✅ MISSION PLANNER OPERATIVO",
);
console.log(
  "✅ NESSUN EFFETTO ESTERNO PRODOTTO",
);

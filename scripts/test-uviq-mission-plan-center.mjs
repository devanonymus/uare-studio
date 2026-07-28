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

const supabase =
  createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

const {
  data: plans,
  error,
} = await supabase
  .from("mission_plans")
  .select(
    `
    id,
    status,
    confidence,
    created_at,
    missions (
      id,
      title,
      status
    )
  `,
  )
  .eq("business_id", businessId)
  .order("created_at", {
    ascending: false,
  });

if (error) {
  throw error;
}

console.log("");
console.log("UVIQ MISSION PLAN CENTER");
console.log("========================");
console.log(`Piani: ${plans?.length ?? 0}`);
console.log("");

for (const plan of plans ?? []) {
  console.log(
    `[${plan.status}] ${plan.missions?.title ?? plan.id} · ${Math.round(
      Number(plan.confidence) * 100,
    )}%`,
  );
}

console.log("");
console.log(
  "✅ MISSION PLAN CENTER PRONTO",
);

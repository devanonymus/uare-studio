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
  data: opportunities,
  error,
} = await supabase
  .from("business_opportunities")
  .select(
    "id, title, status, priority",
  )
  .eq("business_id", businessId)
  .order("priority", {
    ascending: false,
  });

if (error) {
  throw error;
}

console.log("");
console.log(
  "UVIQ OPPORTUNITY CENTER",
);
console.log(
  "=======================",
);
console.log(
  `Opportunità: ${opportunities?.length ?? 0}`,
);
console.log("");

for (
  const opportunity of
  opportunities ?? []
) {
  console.log(
    `[${opportunity.status}] P${opportunity.priority} · ${opportunity.title}`,
  );
}

console.log("");
console.log(
  "✅ OPPORTUNITY CENTER PRONTO",
);

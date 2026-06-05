/**
 * ONE-TIME SETUP SCRIPT
 * Bu script restaurant_tables ve qr_settings cedvellerini yaradır
 * Bir defe islet: node scripts/setup-db.mjs
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mrlnlanarsyofpgvunyv.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ybG5sYW5hcnN5b2ZwZ3Z1bnl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjM2MTMxNSwiZXhwIjoyMDg3OTM3MzE1fQ.mub231W6K5pSsceERtH1eAnLSgp99vkSyq3j83XqM5M";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log("🚀 Supabase cədvəlləri yoxlanılır...\n");

// Check if restaurant_tables exists by trying to select from it
const { error: tableCheckErr } = await supabase
  .from("restaurant_tables")
  .select("id")
  .limit(1);

if (tableCheckErr) {
  console.log("❌ restaurant_tables tapılmadı:", tableCheckErr.message);
  console.log("\n📋 Aşağıdakı SQL-i Supabase SQL Redaktoruna yapışdırıb işlədin:");
  console.log("   https://supabase.com/dashboard/project/mrlnlanarsyofpgvunyv/sql/new\n");
  console.log("=".repeat(60));
  console.log(`
CREATE TABLE IF NOT EXISTS public.restaurant_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number integer NOT NULL UNIQUE,
  table_name text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT 'Iceri',
  capacity integer NOT NULL DEFAULT 4,
  custom_message text NOT NULL DEFAULT '',
  menu_filter text[] NOT NULL DEFAULT '{all}',
  qr_active boolean NOT NULL DEFAULT true,
  qr_version integer NOT NULL DEFAULT 1,
  template_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.qr_settings (
  id integer PRIMARY KEY,
  fg_color text NOT NULL DEFAULT '#8B6914',
  bg_color text NOT NULL DEFAULT '#FFFFFF',
  logo_url text NOT NULL DEFAULT '',
  logo_active boolean NOT NULL DEFAULT false,
  error_correction text NOT NULL DEFAULT 'M',
  size integer NOT NULL DEFAULT 400,
  menu_version integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.qr_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.restaurant_tables (table_number, location, capacity)
SELECT n, 'Iceri', 4 FROM generate_series(1,5) AS n
WHERE NOT EXISTS (SELECT 1 FROM public.restaurant_tables LIMIT 1);
  `);
  console.log("=".repeat(60));
  process.exit(1);
}

console.log("✅ restaurant_tables mövcuddur");

// Check/seed tables
const { data: existing } = await supabase
  .from("restaurant_tables")
  .select("id")
  .limit(1);

if (!existing || existing.length === 0) {
  console.log("📝 Başlanğıc masalar əlavə edilir...");
  const rows = [1, 2, 3, 4, 5].map((n) => ({
    table_number: n,
    table_name: `Masa #${n}`,
    location: "Iceri",
    capacity: 4,
  }));
  const { error: insertErr } = await supabase
    .from("restaurant_tables")
    .insert(rows);
  if (insertErr) console.log("  Insert xətası:", insertErr.message);
  else console.log("✅ 5 masa əlavə edildi");
} else {
  const { count } = await supabase
    .from("restaurant_tables")
    .select("*", { count: "exact", head: true });
  console.log(`✅ ${count} masa artıq mövcuddur`);
}

// Check qr_settings
const { error: qrCheckErr } = await supabase
  .from("qr_settings")
  .select("id")
  .limit(1);

if (qrCheckErr) {
  console.log("❌ qr_settings tapılmadı — yuxarıdakı SQL-i işlədin");
} else {
  const { data: qrRow } = await supabase
    .from("qr_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (!qrRow) {
    await supabase.from("qr_settings").insert({ id: 1 });
    console.log("✅ qr_settings standart sətri əlavə edildi");
  } else {
    console.log("✅ qr_settings mövcuddur");
  }
}

console.log("\n🎉 Quraşdırma tamamlandı!");

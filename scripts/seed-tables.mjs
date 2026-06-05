import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://mrlnlanarsyofpgvunyv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ybG5sYW5hcnN5b2ZwZ3Z1bnl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjM2MTMxNSwiZXhwIjoyMDg3OTM3MzE1fQ.mub231W6K5pSsceERtH1eAnLSgp99vkSyq3j83XqM5M",
  { auth: { persistSession: false } }
);

// Get existing max table number
const { data: maxRow } = await supabase
  .from("restaurant_tables")
  .select("table_number")
  .order("table_number", { ascending: false })
  .limit(1)
  .maybeSingle();

const maxNum = maxRow?.table_number ?? 0;
console.log("Mövcud maksimum masa nömrəsi:", maxNum);

if (maxNum < 5) {
  const toInsert = [];
  for (let n = maxNum + 1; n <= 5; n++) {
    toInsert.push({ table_number: n, table_name: `Masa #${n}`, location: "Iceri", capacity: 4 });
  }
  const { error } = await supabase.from("restaurant_tables").insert(toInsert);
  if (error) console.log("Xəta:", error.message);
  else console.log(`✅ ${toInsert.length} yeni masa əlavə edildi (${maxNum + 1}–5)`);
} else {
  console.log("✅ Artıq 5+ masa mövcuddur, əlavə lazım deyil");
}

// Show all tables
const { data: all } = await supabase
  .from("restaurant_tables")
  .select("table_number, table_name, location, qr_active")
  .order("table_number");

console.log("\nBütün masalar:");
all?.forEach(t => console.log(`  Masa #${t.table_number} | ${t.location} | Aktiv: ${t.qr_active}`));

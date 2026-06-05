import https from "https";

const PROJECT_REF = "mrlnlanarsyofpgvunyv";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ybG5sYW5hcnN5b2ZwZ3Z1bnl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjM2MTMxNSwiZXhwIjoyMDg3OTM3MzE1fQ.mub231W6K5pSsceERtH1eAnLSgp99vkSyq3j83XqM5M";

const sql = `
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
`;

function post(hostname, path, headers, bodyStr) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname, path, method: "POST", headers: { ...headers, "Content-Length": Buffer.byteLength(bodyStr) } },
      (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on("end", () => resolve({ status: res.statusCode, body: data }));
      }
    );
    req.on("error", reject);
    req.write(bodyStr);
    req.end();
  });
}

console.log("Trying Supabase SQL via REST rpc...\n");

// Try via PostgREST rpc endpoint (requires exec_sql function to exist - usually doesn't)
// Instead use the Supabase database REST API via pg-meta
const res = await post(
  `${PROJECT_REF}.supabase.co`,
  `/rest/v1/rpc/exec_sql`,
  {
    "Content-Type": "application/json",
    Authorization: `Bearer ${SERVICE_KEY}`,
    apikey: SERVICE_KEY,
  },
  JSON.stringify({ sql })
);

console.log("rpc/exec_sql status:", res.status);
console.log("Response:", res.body.substring(0, 300));

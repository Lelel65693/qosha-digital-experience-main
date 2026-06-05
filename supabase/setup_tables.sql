-- ============================================================
-- Run this in your Supabase SQL Editor (once)
-- https://supabase.com/dashboard/project/mrlnlanarsyofpgvunyv/sql/new
-- ============================================================

-- 1. restaurant_tables
CREATE TABLE IF NOT EXISTS public.restaurant_tables (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number  integer NOT NULL UNIQUE,
  table_name    text NOT NULL DEFAULT '',
  location      text NOT NULL DEFAULT 'İçəri',
  capacity      integer NOT NULL DEFAULT 4,
  custom_message text NOT NULL DEFAULT '',
  menu_filter   text[] NOT NULL DEFAULT '{all}',
  qr_active     boolean NOT NULL DEFAULT true,
  qr_version    integer NOT NULL DEFAULT 1,
  template_id   uuid REFERENCES public.menu_templates(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;

-- Allow service role (admin) full access
DROP POLICY IF EXISTS "Admin full access on restaurant_tables" ON public.restaurant_tables;
CREATE POLICY "Admin full access on restaurant_tables"
  ON public.restaurant_tables FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- Allow public read of active tables (for QR menu page)
DROP POLICY IF EXISTS "Public read active tables" ON public.restaurant_tables;
CREATE POLICY "Public read active tables"
  ON public.restaurant_tables FOR SELECT
  TO anon, authenticated USING (qr_active = true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_restaurant_tables_updated_at ON public.restaurant_tables;
CREATE TRIGGER set_restaurant_tables_updated_at
  BEFORE UPDATE ON public.restaurant_tables
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. qr_settings (single-row config table)
CREATE TABLE IF NOT EXISTS public.qr_settings (
  id               integer PRIMARY KEY DEFAULT 1,
  fg_color         text NOT NULL DEFAULT '#8B6914',
  bg_color         text NOT NULL DEFAULT '#FFFFFF',
  logo_url         text NOT NULL DEFAULT '',
  logo_active      boolean NOT NULL DEFAULT false,
  error_correction text NOT NULL DEFAULT 'M',
  size             integer NOT NULL DEFAULT 400,
  menu_version     integer NOT NULL DEFAULT 1,
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- Insert default row if not present
INSERT INTO public.qr_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.qr_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access on qr_settings" ON public.qr_settings;
CREATE POLICY "Admin full access on qr_settings"
  ON public.qr_settings FOR ALL
  TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read qr_settings" ON public.qr_settings;
CREATE POLICY "Public read qr_settings"
  ON public.qr_settings FOR SELECT
  TO anon, authenticated USING (true);

-- 3. Seed a few tables if empty
INSERT INTO public.restaurant_tables (table_number, location, capacity)
SELECT t.n, 'İçəri', 4
FROM (VALUES (1),(2),(3),(4),(5)) AS t(n)
WHERE NOT EXISTS (SELECT 1 FROM public.restaurant_tables LIMIT 1);

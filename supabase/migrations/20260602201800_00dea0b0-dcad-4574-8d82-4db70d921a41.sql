
-- 1. Add realtime publications for tables that need live sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_tables;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;

-- Ensure REPLICA IDENTITY FULL so realtime payloads carry full rows
ALTER TABLE public.menu_items REPLICA IDENTITY FULL;
ALTER TABLE public.menu_categories REPLICA IDENTITY FULL;
ALTER TABLE public.restaurant_tables REPLICA IDENTITY FULL;
ALTER TABLE public.gallery REPLICA IDENTITY FULL;
ALTER TABLE public.reservations REPLICA IDENTITY FULL;
ALTER TABLE public.reviews REPLICA IDENTITY FULL;

-- 2. Waiter calls table (QR "call waiter" feature -> admin notification bell)
CREATE TABLE public.waiter_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number integer NOT NULL,
  table_id uuid,
  kind text NOT NULL DEFAULT 'waiter', -- 'waiter' | 'bill' | 'help'
  status text NOT NULL DEFAULT 'open', -- 'open' | 'done'
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.waiter_calls TO authenticated;
GRANT SELECT, INSERT ON public.waiter_calls TO anon;
GRANT ALL ON public.waiter_calls TO service_role;

ALTER TABLE public.waiter_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can call waiter"
ON public.waiter_calls FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admin manage waiter calls"
ON public.waiter_calls FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

ALTER PUBLICATION supabase_realtime ADD TABLE public.waiter_calls;
ALTER TABLE public.waiter_calls REPLICA IDENTITY FULL;

-- 3. Restaurant_tables UPDATE policy for anon (allow bumping qr scan stats later if needed - keeping minimal)
-- No change needed; admin policy already exists

-- 4. Site settings: ensure defaults exist for new keys
INSERT INTO public.site_settings (key, value) VALUES
  ('branding', '{"logo_url":"","currency":"₼","restaurant_name":"Qoşa Qala"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

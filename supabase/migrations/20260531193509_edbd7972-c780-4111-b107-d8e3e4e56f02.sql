
-- ============ menu_categories ============
CREATE TABLE public.menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_az text NOT NULL,
  name_ru text NOT NULL DEFAULT '',
  name_en text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '🍽️',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.menu_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_categories TO authenticated;
GRANT ALL ON public.menu_categories TO service_role;

ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view active categories" ON public.menu_categories
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admin manage categories" ON public.menu_categories
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ site_settings ============
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ menu_items extensions ============
ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.menu_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS old_price numeric(10,2),
  ADD COLUMN IF NOT EXISTS weight_grams integer,
  ADD COLUMN IF NOT EXISTS calories integer,
  ADD COLUMN IF NOT EXISTS cooking_time integer,
  ADD COLUMN IF NOT EXISTS spicy_level integer DEFAULT 0 CHECK (spicy_level BETWEEN 0 AND 3),
  ADD COLUMN IF NOT EXISTS allergens text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS badges text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- ============ restaurant_tables extensions ============
ALTER TABLE public.restaurant_tables
  ADD COLUMN IF NOT EXISTS location text NOT NULL DEFAULT 'İçəri',
  ADD COLUMN IF NOT EXISTS capacity integer NOT NULL DEFAULT 4,
  ADD COLUMN IF NOT EXISTS qr_version integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS menu_filter text[] NOT NULL DEFAULT '{all}';

-- ============ reservations extensions ============
ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS occasion text,
  ADD COLUMN IF NOT EXISTS table_id uuid REFERENCES public.restaurant_tables(id) ON DELETE SET NULL;

-- ============ reviews extensions ============
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS author_avatar text,
  ADD COLUMN IF NOT EXISTS content_az text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS content_ru text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS content_en text NOT NULL DEFAULT '';

-- Backfill content_az from existing content
UPDATE public.reviews SET content_az = content WHERE content_az = '' AND content IS NOT NULL;

-- ============ updated_at trigger for menu_items ============
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS menu_items_touch_updated_at ON public.menu_items;
CREATE TRIGGER menu_items_touch_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS site_settings_touch_updated_at ON public.site_settings;
CREATE TRIGGER site_settings_touch_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ Seed standard categories ============
INSERT INTO public.menu_categories (slug, name_az, name_ru, name_en, icon, sort_order) VALUES
  ('cold-appetizers', 'Soyuq qəlyanaltılar', 'Холодные закуски', 'Cold Appetizers', '🥗', 10),
  ('hot-appetizers', 'İsti qəlyanaltılar', 'Горячие закуски', 'Hot Appetizers', '🍳', 20),
  ('salads', 'Salatlar', 'Салаты', 'Salads', '🥬', 30),
  ('soups', 'Şorbalar', 'Супы', 'Soups', '🍲', 40),
  ('main-dishes', 'Əsas yeməklər', 'Основные блюда', 'Main Dishes', '🍖', 50),
  ('bbq', 'Mangal & Barbekü', 'Мангал', 'BBQ & Grill', '🔥', 60),
  ('seafood', 'Dəniz məhsulları', 'Морепродукты', 'Seafood', '🐟', 70),
  ('desserts', 'Şirniyyatlar', 'Десерты', 'Desserts', '🍰', 80),
  ('drinks', 'İçkilər', 'Напитки', 'Drinks', '🍹', 90),
  ('alcohol', 'Spirtli içkilər', 'Алкоголь', 'Alcohol', '🍷', 100)
ON CONFLICT (slug) DO NOTHING;

-- ============ Link existing menu_items by category text -> category_id ============
UPDATE public.menu_items mi
SET category_id = mc.id
FROM public.menu_categories mc
WHERE mi.category_id IS NULL AND mi.category = mc.slug;

-- ============ Default site_settings rows ============
INSERT INTO public.site_settings (key, value) VALUES
  ('contact_info', '{"phone":"+994 50 790 88 88","email":"info@qosaqala.az","address":"Bakı, İçərişəhər","map_lat":40.3667,"map_lng":49.8358}'::jsonb),
  ('working_hours', '{"mon":"10:00-23:00","tue":"10:00-23:00","wed":"10:00-23:00","thu":"10:00-23:00","fri":"10:00-00:00","sat":"10:00-00:00","sun":"10:00-23:00"}'::jsonb),
  ('announcement_banner', '{"active":false,"text_az":"","text_ru":"","text_en":""}'::jsonb),
  ('social_links', '{"instagram":"","whatsapp":"+994507908888","facebook":""}'::jsonb)
ON CONFLICT (key) DO NOTHING;


-- ============ ROLES SYSTEM ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- ============ MENU ITEMS ============
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_az TEXT NOT NULL,
  name_ru TEXT NOT NULL DEFAULT '',
  name_en TEXT NOT NULL DEFAULT '',
  desc_az TEXT NOT NULL DEFAULT '',
  desc_ru TEXT NOT NULL DEFAULT '',
  desc_en TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  badge TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view active menu" ON public.menu_items FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admin manage menu" ON public.menu_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ REVIEWS ============
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  content TEXT NOT NULL,
  review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('google','manual')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view approved reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "Admin manage reviews" ON public.reviews FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ TABLES (for QR) ============
CREATE TABLE public.restaurant_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number INTEGER NOT NULL UNIQUE,
  table_name TEXT NOT NULL DEFAULT '',
  custom_message TEXT NOT NULL DEFAULT '',
  qr_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.restaurant_tables TO anon, authenticated;
GRANT ALL ON public.restaurant_tables TO service_role;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view active tables" ON public.restaurant_tables FOR SELECT TO anon, authenticated USING (qr_active = true);
CREATE POLICY "Admin manage tables" ON public.restaurant_tables FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ RESERVATIONS ============
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guests INTEGER NOT NULL DEFAULT 2 CHECK (guests BETWEEN 1 AND 50),
  note TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.reservations TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.reservations TO authenticated;
GRANT ALL ON public.reservations TO service_role;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create reservation" ON public.reservations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin view reservations" ON public.reservations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update reservations" ON public.reservations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete reservations" ON public.reservations FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ GALLERY ============
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'interior',
  title TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.gallery TO anon, authenticated;
GRANT ALL ON public.gallery TO service_role;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage gallery" ON public.gallery FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public) VALUES
  ('menu-images', 'menu-images', true),
  ('gallery-images', 'gallery-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Public read menu images" ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');
CREATE POLICY "Admin upload menu images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'menu-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update menu images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'menu-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete menu images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'menu-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read gallery images" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-images');
CREATE POLICY "Admin upload gallery images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update gallery images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'gallery-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete gallery images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'gallery-images' AND public.has_role(auth.uid(), 'admin'));

-- ============ menu_categories ============
CREATE TABLE public.menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_az text NOT NULL,
  name_ru text NOT NULL DEFAULT '',
  name_en text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'ğŸ½ï¸',
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
  ADD COLUMN IF NOT EXISTS location text NOT NULL DEFAULT 'Ä°Ã§É™ri',
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
  ('cold-appetizers', 'Soyuq qÉ™lyanaltÄ±lar', 'Ğ¥Ğ¾Ğ»Ğ¾Ğ´Ğ½Ñ‹Ğµ Ğ·Ğ°ĞºÑƒÑĞºĞ¸', 'Cold Appetizers', 'ğŸ¥—', 10),
  ('hot-appetizers', 'Ä°sti qÉ™lyanaltÄ±lar', 'Ğ“Ğ¾Ñ€ÑÑ‡Ğ¸Ğµ Ğ·Ğ°ĞºÑƒÑĞºĞ¸', 'Hot Appetizers', 'ğŸ³', 20),
  ('salads', 'Salatlar', 'Ğ¡Ğ°Ğ»Ğ°Ñ‚Ñ‹', 'Salads', 'ğŸ¥¬', 30),
  ('soups', 'Åorbalar', 'Ğ¡ÑƒĞ¿Ñ‹', 'Soups', 'ğŸ²', 40),
  ('main-dishes', 'Æsas yemÉ™klÉ™r', 'ĞÑĞ½Ğ¾Ğ²Ğ½Ñ‹Ğµ Ğ±Ğ»ÑĞ´Ğ°', 'Main Dishes', 'ğŸ–', 50),
  ('bbq', 'Mangal & BarbekÃ¼', 'ĞœĞ°Ğ½Ğ³Ğ°Ğ»', 'BBQ & Grill', 'ğŸ”¥', 60),
  ('seafood', 'DÉ™niz mÉ™hsullarÄ±', 'ĞœĞ¾Ñ€ĞµĞ¿Ñ€Ğ¾Ğ´ÑƒĞºÑ‚Ñ‹', 'Seafood', 'ğŸŸ', 70),
  ('desserts', 'Åirniyyatlar', 'Ğ”ĞµÑĞµÑ€Ñ‚Ñ‹', 'Desserts', 'ğŸ°', 80),
  ('drinks', 'Ä°Ã§kilÉ™r', 'ĞĞ°Ğ¿Ğ¸Ñ‚ĞºĞ¸', 'Drinks', 'ğŸ¹', 90),
  ('alcohol', 'Spirtli iÃ§kilÉ™r', 'ĞĞ»ĞºĞ¾Ğ³Ğ¾Ğ»ÑŒ', 'Alcohol', 'ğŸ·', 100)
ON CONFLICT (slug) DO NOTHING;

-- ============ Link existing menu_items by category text -> category_id ============
UPDATE public.menu_items mi
SET category_id = mc.id
FROM public.menu_categories mc
WHERE mi.category_id IS NULL AND mi.category = mc.slug;

-- ============ Default site_settings rows ============
INSERT INTO public.site_settings (key, value) VALUES
  ('contact_info', '{"phone":"+994 50 790 88 88","email":"info@qosaqala.az","address":"BakÄ±, Ä°Ã§É™riÅŸÉ™hÉ™r","map_lat":40.3667,"map_lng":49.8358}'::jsonb),
  ('working_hours', '{"mon":"10:00-23:00","tue":"10:00-23:00","wed":"10:00-23:00","thu":"10:00-23:00","fri":"10:00-00:00","sat":"10:00-00:00","sun":"10:00-23:00"}'::jsonb),
  ('announcement_banner', '{"active":false,"text_az":"","text_ru":"","text_en":""}'::jsonb),
  ('social_links', '{"instagram":"","whatsapp":"+994507908888","facebook":""}'::jsonb)
ON CONFLICT (key) DO NOTHING;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;

-- ============================================================
-- A. MENYU ÅABLONLARI
-- ============================================================
CREATE TABLE public.menu_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  is_default boolean NOT NULL DEFAULT false,
  show_prices boolean NOT NULL DEFAULT true,
  lang_default text NOT NULL DEFAULT 'az',
  accent_color text NOT NULL DEFAULT '#8B6914',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.menu_templates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_templates TO authenticated;
GRANT ALL ON public.menu_templates TO service_role;

ALTER TABLE public.menu_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view templates" ON public.menu_templates
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage templates" ON public.menu_templates
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER touch_menu_templates BEFORE UPDATE ON public.menu_templates
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- YalnÄ±z bir default ÅŸablon ola bilÉ™r
CREATE UNIQUE INDEX one_default_template ON public.menu_templates (is_default) WHERE is_default = true;

-- ============================================================
-- TEMPLATE_CATEGORIES (M:N)
-- ============================================================
CREATE TABLE public.template_categories (
  template_id uuid NOT NULL REFERENCES public.menu_templates(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  PRIMARY KEY (template_id, category_id)
);

GRANT SELECT ON public.template_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.template_categories TO authenticated;
GRANT ALL ON public.template_categories TO service_role;

ALTER TABLE public.template_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view template_categories" ON public.template_categories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage template_categories" ON public.template_categories
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- MENU_ITEM_VARIANTS
-- ============================================================
CREATE TABLE public.menu_item_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  name_az text NOT NULL,
  name_ru text NOT NULL DEFAULT '',
  name_en text NOT NULL DEFAULT '',
  price numeric NOT NULL,
  weight_grams integer,
  is_default boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.menu_item_variants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_item_variants TO authenticated;
GRANT ALL ON public.menu_item_variants TO service_role;

ALTER TABLE public.menu_item_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view variants" ON public.menu_item_variants
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage variants" ON public.menu_item_variants
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- MENU_ITEM_EXTRAS
-- ============================================================
CREATE TABLE public.menu_item_extras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  name_az text NOT NULL,
  name_ru text NOT NULL DEFAULT '',
  name_en text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  is_required boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.menu_item_extras TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_item_extras TO authenticated;
GRANT ALL ON public.menu_item_extras TO service_role;

ALTER TABLE public.menu_item_extras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view extras" ON public.menu_item_extras
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage extras" ON public.menu_item_extras
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- TABLES â€” template_id sÃ¼tunu
-- ============================================================
ALTER TABLE public.restaurant_tables
  ADD COLUMN template_id uuid REFERENCES public.menu_templates(id) ON DELETE SET NULL;

-- ============================================================
-- GALLERY â€” Ã§oxdilli caption-lar
-- ============================================================
ALTER TABLE public.gallery
  ADD COLUMN caption_az text NOT NULL DEFAULT '',
  ADD COLUMN caption_ru text NOT NULL DEFAULT '',
  ADD COLUMN caption_en text NOT NULL DEFAULT '',
  ADD COLUMN is_active boolean NOT NULL DEFAULT true;

-- ============================================================
-- AUDIT LOG
-- ============================================================
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin view audit log" ON public.audit_log
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin insert audit log" ON public.audit_log
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_audit_log_created ON public.audit_log (created_at DESC);
CREATE INDEX idx_audit_log_entity ON public.audit_log (entity, entity_id);

-- ============================================================
-- REALTIME PUBLICATION (sync Ã¼Ã§Ã¼n)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_templates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.template_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_item_variants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_item_extras;
ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_tables;

ALTER TABLE public.menu_items REPLICA IDENTITY FULL;
ALTER TABLE public.menu_categories REPLICA IDENTITY FULL;
ALTER TABLE public.menu_templates REPLICA IDENTITY FULL;
ALTER TABLE public.template_categories REPLICA IDENTITY FULL;
ALTER TABLE public.menu_item_variants REPLICA IDENTITY FULL;
ALTER TABLE public.menu_item_extras REPLICA IDENTITY FULL;
ALTER TABLE public.restaurant_tables REPLICA IDENTITY FULL;

-- ============================================================
-- SEED: 17 standart kateqoriya (É™gÉ™r boÅŸdursa)
-- ============================================================
INSERT INTO public.menu_categories (slug, name_az, name_ru, name_en, icon, sort_order, is_active)
SELECT * FROM (VALUES
  ('breakfast',       'SÉ™hÉ™r YemÉ™yi',         'Ğ—Ğ°Ğ²Ñ‚Ñ€Ğ°Ğº',                'Breakfast',         'ğŸŒ…',  1, true),
  ('salads',          'Salatlar',             'Ğ¡Ğ°Ğ»Ğ°Ñ‚Ñ‹',                 'Salads',            'ğŸ¥—',  2, true),
  ('cold-appetizers', 'Soyuq QÉ™lyanaltÄ±lar',  'Ğ¥Ğ¾Ğ»Ğ¾Ğ´Ğ½Ñ‹Ğµ Ğ·Ğ°ĞºÑƒÑĞºĞ¸',       'Cold Appetizers',   'ğŸ¥©',  3, true),
  ('hot-appetizers',  'Ä°sti QÉ™lyanaltÄ±lar',   'Ğ“Ğ¾Ñ€ÑÑ‡Ğ¸Ğµ Ğ·Ğ°ĞºÑƒÑĞºĞ¸',        'Hot Appetizers',    'ğŸ”¥',  4, true),
  ('soups',           'Åorbalar',             'Ğ¡ÑƒĞ¿Ñ‹',                   'Soups',             'ğŸ²',  5, true),
  ('main-dishes',     'Æsas YemÉ™klÉ™r',        'ĞÑĞ½Ğ¾Ğ²Ğ½Ñ‹Ğµ Ğ±Ğ»ÑĞ´Ğ°',         'Main Dishes',       'ğŸ–',  6, true),
  ('steaks',          'SteyklÉ™r',             'Ğ¡Ñ‚ĞµĞ¹ĞºĞ¸',                 'Steaks',            'ğŸ¥©',  7, true),
  ('bbq',             'TÉ™ndÃ¼r & Manqal',      'Ğ¢Ğ°Ğ½Ğ´Ñ‹Ñ€ Ğ¸ ĞœĞ°Ğ½Ğ³Ğ°Ğ»',        'Tandoor & BBQ',     'ğŸ”¥',  8, true),
  ('show-dishes',     'Åou YemÉ™klÉ™r',         'Ğ¨Ğ¾Ñƒ Ğ±Ğ»ÑĞ´Ğ°',              'Show Dishes',       'ğŸ­',  9, true),
  ('kids',            'UÅŸaq Menyusu',         'Ğ”ĞµÑ‚ÑĞºĞ¾Ğµ Ğ¼ĞµĞ½Ñ',           'Kids Menu',         'ğŸ‘¶', 10, true),
  ('pasta',           'Ä°talyan PastalarÄ±',    'Ğ˜Ñ‚Ğ°Ğ»ÑŒÑĞ½ÑĞºĞ°Ñ Ğ¿Ğ°ÑÑ‚Ğ°',      'Italian Pasta',     'ğŸ', 11, true),
  ('sides',           'Qarnir',               'Ğ“Ğ°Ñ€Ğ½Ğ¸Ñ€',                 'Sides',             'ğŸŸ', 12, true),
  ('desserts',        'Dessert',              'Ğ”ĞµÑĞµÑ€Ñ‚Ñ‹',                'Desserts',          'ğŸ°', 13, true),
  ('cocktails',       'KokteyllÉ™r',           'ĞšĞ¾ĞºÑ‚ĞµĞ¹Ğ»Ğ¸',               'Cocktails',         'ğŸ¸', 14, true),
  ('coffee-tea',      'Kofe & Ã‡ay',           'ĞšĞ¾Ñ„Ğµ Ğ¸ Ğ§Ğ°Ğ¹',             'Coffee & Tea',      'â˜•', 15, true),
  ('drinks',          'Alkoqolsuz Ä°Ã§kilÉ™r',   'Ğ‘ĞµĞ·Ğ°Ğ»ĞºĞ¾Ğ³Ğ¾Ğ»ÑŒĞ½Ñ‹Ğµ Ğ½Ğ°Ğ¿Ğ¸Ñ‚ĞºĞ¸', 'Soft Drinks',       'ğŸ¥¤', 16, true),
  ('alcohol',         'Alkoqollu Ä°Ã§kilÉ™r',    'ĞĞ»ĞºĞ¾Ğ³Ğ¾Ğ»ÑŒĞ½Ñ‹Ğµ Ğ½Ğ°Ğ¿Ğ¸Ñ‚ĞºĞ¸',    'Alcohol',           'ğŸ·', 17, true)
) AS v(slug, name_az, name_ru, name_en, icon, sort_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.menu_categories LIMIT 1);

-- ============================================================
-- SEED: Default ÅŸablon
-- ============================================================
INSERT INTO public.menu_templates (name, description, is_default)
SELECT 'Tam Menyu', 'BÃ¼tÃ¼n kateqoriyalarÄ± É™hatÉ™ edÉ™n É™sas menyu ÅŸablonu', true
WHERE NOT EXISTS (SELECT 1 FROM public.menu_templates WHERE is_default = true);

-- BÃ¼tÃ¼n aktiv kateqoriyalarÄ± default ÅŸablona qoÅŸ
INSERT INTO public.template_categories (template_id, category_id, sort_order, is_visible)
SELECT t.id, c.id, c.sort_order, true
FROM public.menu_templates t
CROSS JOIN public.menu_categories c
WHERE t.is_default = true AND c.is_active = true
ON CONFLICT (template_id, category_id) DO NOTHING;

-- BÃ¼tÃ¼n masalarÄ± default ÅŸablona qoÅŸ (tÉ™yin olunmayanlarÄ±)
UPDATE public.restaurant_tables
SET template_id = (SELECT id FROM public.menu_templates WHERE is_default = true LIMIT 1)
WHERE template_id IS NULL;

-- ============================================================
-- SEED: Real qalereya ÅŸÉ™killÉ™ri (yalnÄ±z boÅŸdursa)
-- ============================================================
INSERT INTO public.gallery (url, category, title, caption_az, caption_ru, caption_en, sort_order)
SELECT * FROM (VALUES
  ('https://monyo.az/v4/uploads/a_238_202202201143261201897352.jpg',  'interior', 'Æsas zal',           'Æsas zal',              'Ğ“Ğ»Ğ°Ğ²Ğ½Ñ‹Ğ¹ Ğ·Ğ°Ğ»',              'Main Hall',                1),
  ('https://monyo.az/v4/uploads/a_238_20220220114340612710257.jpg',   'interior', 'GÃ¶zÉ™l interyÉ™r',     'GÃ¶zÉ™l interyÉ™r',        'ĞšÑ€Ğ°ÑĞ¸Ğ²Ñ‹Ğ¹ Ğ¸Ğ½Ñ‚ĞµÑ€ÑŒĞµÑ€',        'Beautiful Interior',       2),
  ('https://monyo.az/v4/uploads/a_238_202202201143561494530995.jpg',  'interior', 'ZalÄ±n gÃ¶rÃ¼nÃ¼ÅŸÃ¼',     'ZalÄ±n gÃ¶rÃ¼nÃ¼ÅŸÃ¼',        'Ğ’Ğ¸Ğ´ Ğ·Ğ°Ğ»Ğ°',                 'Hall View',                3),
  ('https://monyo.az/v4/uploads/a_238_20220220114411296776468.jpg',   'interior', 'Restoran atmosferi', 'Restoran atmosferi',    'ĞÑ‚Ğ¼Ğ¾ÑÑ„ĞµÑ€Ğ° Ñ€ĞµÑÑ‚Ğ¾Ñ€Ğ°Ğ½Ğ°',      'Restaurant Atmosphere',    4),
  ('https://monyo.az/v4/uploads/a_238_20220220114427851654744.jpg',   'interior', 'Dekorasiya',         'Dekorasiya',            'Ğ”ĞµĞºĞ¾Ñ€Ğ°Ñ†Ğ¸Ğ¸',                'Decoration',               5),
  ('https://monyo.az/v4/uploads/a_238_20220307210049580247944.jpg',   'food',     'DadlÄ± yemÉ™klÉ™r',     'DadlÄ± yemÉ™klÉ™r',        'Ğ’ĞºÑƒÑĞ½Ñ‹Ğµ Ğ±Ğ»ÑĞ´Ğ°',            'Delicious Food',           6),
  ('https://monyo.az/v4/uploads/a_238_202203072101051490665555.jpg',  'food',     'Milli xÃ¶rÉ™klÉ™r',     'Milli xÃ¶rÉ™klÉ™r',        'ĞĞ°Ñ†Ğ¸Ğ¾Ğ½Ğ°Ğ»ÑŒĞ½Ñ‹Ğµ Ğ±Ğ»ÑĞ´Ğ°',       'National Dishes',          7),
  ('https://monyo.az/v4/uploads/a_238_202203072101141136582201.jpg',  'food',     'QÉ™lyanaltÄ±lar',      'QÉ™lyanaltÄ±lar',         'Ğ—Ğ°ĞºÑƒÑĞºĞ¸',                  'Appetizers',               8),
  ('https://monyo.az/v4/uploads/a_238_20220307210121796259456.jpg',   'interior', 'VIP otaq',           'VIP otaq',              'Ğ’Ğ˜ĞŸ Ğ·Ğ°Ğ»',                  'VIP Room',                 9),
  ('https://monyo.az/v4/uploads/a_238_20220307210152218462329.jpg',   'terrace',  'Yay terrasÄ±',        'Yay terrasÄ±',           'Ğ›ĞµÑ‚Ğ½ÑÑ Ñ‚ĞµÑ€Ñ€Ğ°ÑĞ°',           'Summer Terrace',          10),
  ('https://monyo.az/v4/uploads/a_238_202203072102032070033541.jpg',  'events',   'XÃ¼susi tÉ™dbirlÉ™r',   'XÃ¼susi tÉ™dbirlÉ™r',      'Ğ¡Ğ¿ĞµÑ†Ğ¸Ğ°Ğ»ÑŒĞ½Ñ‹Ğµ Ğ¼ĞµÑ€Ğ¾Ğ¿Ñ€Ğ¸ÑÑ‚Ğ¸Ñ',  'Special Events',          11),
  ('https://monyo.az/v4/uploads/a_238_2022030721021095367034.jpg',    'interior', 'AxÅŸam atmosferi',    'AxÅŸam atmosferi',       'Ğ’ĞµÑ‡ĞµÑ€Ğ½ÑÑ Ğ°Ñ‚Ğ¼Ğ¾ÑÑ„ĞµÑ€Ğ°',       'Evening Atmosphere',      12),
  ('https://monyo.az/v4/uploads/a_238_202203072102161962856230.jpg',  'food',     'Ä°Ã§kilÉ™r',            'Ä°Ã§kilÉ™r',               'ĞĞ°Ğ¿Ğ¸Ñ‚ĞºĞ¸',                  'Beverages',               13)
) AS v(url, category, title, caption_az, caption_ru, caption_en, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.gallery LIMIT 1);

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
  ('branding', '{"logo_url":"","currency":"â‚¼","restaurant_name":"QoÅŸa Qala"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 1. gallery cÉ™dvÉ™linÉ™ media_type sÃ¼tunu (video dÉ™stÉ™yi)
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'image';
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- 2. Kateqoriyalar
INSERT INTO public.menu_categories (slug, name_az, name_ru, name_en, icon, sort_order) VALUES
('breakfast',     'SÉ™hÉ™r YemÉ™yi',              'Ğ—Ğ°Ğ²Ñ‚Ñ€Ğ°Ğº',           'Breakfast',         'ğŸŒ…', 0),
('cold-app',      'Soyuq QÉ™lyanaltÄ±lar',       'Ğ¥Ğ¾Ğ»Ğ¾Ğ´Ğ½Ñ‹Ğµ Ğ·Ğ°ĞºÑƒÑĞºĞ¸',  'Cold Appetizers',   'ğŸ¥—', 1),
('salads',        'Salatlar',                  'Ğ¡Ğ°Ğ»Ğ°Ñ‚Ñ‹',            'Salads',            'ğŸ¥™', 2),
('hot-app',       'Ä°sti QÉ™lyanaltÄ±lar',        'Ğ“Ğ¾Ñ€ÑÑ‡Ğ¸Ğµ Ğ·Ğ°ĞºÑƒÑĞºĞ¸',   'Hot Appetizers',    'ğŸ”¥', 3),
('soups',         'Åorbalar',                  'Ğ¡ÑƒĞ¿Ñ‹',              'Soups',             'ğŸ²', 4),
('mains',         'Æsas XÃ¶rÉ™klÉ™r',             'ĞÑĞ½Ğ¾Ğ²Ğ½Ñ‹Ğµ Ğ±Ğ»ÑĞ´Ğ°',    'Main Dishes',       'ğŸ–', 5),
('steaks',        'SteyklÉ™r',                  'Ğ¡Ñ‚ĞµĞ¹ĞºĞ¸',            'Steaks',            'ğŸ¥©', 6),
('bbq',           'BarbekÃ¼ & Mangal',          'Ğ‘Ğ°Ñ€Ğ±ĞµĞºÑ & ĞœĞ°Ğ½Ğ³Ğ°Ğ»',  'BBQ & Grill',       'ğŸ”¥', 7),
('seafood',       'DÉ™niz MÉ™hsullarÄ±',          'ĞœĞ¾Ñ€ĞµĞ¿Ñ€Ğ¾Ğ´ÑƒĞºÑ‚Ñ‹',      'Seafood',           'ğŸŸ', 8),
('pasta',         'XÉ™mir / Ä°talyan PastalarÄ±', 'ĞŸĞ°ÑÑ‚Ğ° / Ğ¢ĞµÑÑ‚Ğ¾',     'Pasta / Dough',     'ğŸ', 9),
('sides',         'Qarnir',                    'Ğ“Ğ°Ñ€Ğ½Ğ¸Ñ€Ñ‹',           'Side Dishes',       'ğŸŸ', 10),
('desserts',      'Åirniyyatlar',              'Ğ”ĞµÑĞµÑ€Ñ‚Ñ‹',           'Desserts',          'ğŸ°', 11),
('beverages',     'Ä°Ã§kilÉ™r',                   'ĞĞ°Ğ¿Ğ¸Ñ‚ĞºĞ¸',           'Beverages',         'ğŸ¥¤', 12),
('alcohol',       'SÉ™rxoÅŸedici Ä°Ã§kilÉ™r',       'ĞĞ»ĞºĞ¾Ğ³Ğ¾Ğ»ÑŒĞ½Ñ‹Ğµ Ğ½Ğ°Ğ¿Ğ¸Ñ‚ĞºĞ¸','Alcoholic Drinks', 'ğŸ·', 13),
('kids',          'UÅŸaq Menyusu',              'Ğ”ĞµÑ‚ÑĞºĞ¾Ğµ Ğ¼ĞµĞ½Ñ',      'Kids Menu',         'ğŸ‘¶', 14);

-- 3. Menyu mÉ™hsullarÄ± (real Monyo.az datasÄ±)
WITH cats AS (SELECT id, slug FROM public.menu_categories)
INSERT INTO public.menu_items (category, category_id, name_az, desc_az, price, image_url, badges, is_featured, sort_order)
SELECT * FROM (VALUES
  -- SÉ™hÉ™r YemÉ™yi
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Set SÉ™pmÉ™ (1-4 nÉ™fÉ™rlik)', 'Blini, daÄŸ balÄ±, kÉ™nd xamasÄ±, qaymaq, kÉ™smik, Qazax pomidoru, XaÃ§maz xiyarÄ±, qatÄ±laÅŸdÄ±rÄ±lmÄ±ÅŸ sÃ¼d, kÉ™nd pendiri, motal, holland pendiri, É™ncir mÃ¼rÉ™bbÉ™si, nehrÉ™ yaÄŸÄ±, sÃ¼tlac, tÉ™ndir Ã§Ã¶rÉ™yi, simit', 68.50, 'https://monyo.az/v4/uploads2/uploads2026-02/a_238_202602061202551362876341.jpg', ARRAY['popular'], true, 0),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Mixlama', '', 12.00, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_202605292051081630107618.jpg', ARRAY[]::text[], false, 1),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Sucuq ilÉ™ KÉ™nd YumurtasÄ±ndan QayÄŸanaq', '', 6.00, 'https://monyo.az/v4/uploads2/uploads2023-05/a_238_202305091444431704512694.jpg', ARRAY[]::text[], false, 2),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'KÉ™nd YumurtasÄ±ndan Omlet', '', 7.00, 'https://monyo.az/v4/uploads2/uploads2023-04/a_238_202304202020221104232697.jpg', ARRAY[]::text[], false, 3),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'KÉ™ndsayaÄŸÄ± Pomidor Yumurta', '', 6.00, 'https://monyo.az/v4/uploads2/uploads2023-04/a_238_20230420190449580506759.jpg', ARRAY[]::text[], false, 4),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Sosis XaÃ§mas Pomidor Sousunda', '', 7.00, 'https://monyo.az/v4/uploads2/uploads2023-04/a_238_20230419202201839596183.jpg', ARRAY[]::text[], false, 5),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'KÉ™nd Yumurta Ä°spanax ilÉ™', '', 6.00, 'https://monyo.az/v4/uploads2/uploads2023-04/a_238_202304202006411547910304.jpg', ARRAY[]::text[], false, 6),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'XaÃ§apuri Adjar SayaÄŸÄ±', '', 12.00, 'https://monyo.az/v4/uploads2/uploads2023-05/a_238_20230508202253538216893.jpg', ARRAY[]::text[], false, 7),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'BlinÃ§ik Æt/KÉ™smik (1 É™dÉ™d)', '', 2.50, 'https://monyo.az/v4/uploads/a_238_202204262013081293453608.jpg', ARRAY[]::text[], false, 8),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Sosiska "Vyana" (2 É™dÉ™d)', '', 8.50, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_202605132135221498367294.jpg', ARRAY[]::text[], false, 9),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Bal (100qr)', '', 4.30, 'https://monyo.az/v4/uploads2/uploads2025-05/a_238_20250530203440224616732.jpg', ARRAY[]::text[], false, 10),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'SÄ±rnik', '', 6.00, 'https://monyo.az/v4/uploads2/uploads2023-04/a_238_20230420211216911747553.jpg', ARRAY[]::text[], false, 11),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'YaÄŸ', '', 4.80, 'https://monyo.az/v4/uploads2/uploads2025-12/a_238_20251221202629971028928.jpg', ARRAY[]::text[], false, 12),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Qaymaq', '', 3.80, 'https://monyo.az/v4/uploads2/uploads2025-05/a_238_20250530205403842517424.jpg', ARRAY[]::text[], false, 13),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Xama (100qr)', '', 3.80, 'https://monyo.az/v4/uploads2/uploads2025-12/a_238_20251221202702546437894.jpg', ARRAY[]::text[], false, 14),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Pendir Brinza (100qr)', '', 6.00, 'https://monyo.az/v4/uploads2/uploads2025-05/a_238_20250530203647121903527.jpg', ARRAY[]::text[], false, 15),
  -- Soyuq QÉ™lyanaltÄ±lar
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'AÃ§Ä±lÄ± ÆzmÉ™', '', 6.50, 'https://monyo.az/v4/uploads2/uploads2025-12/a_238_202512211919381296222126.jpg', ARRAY[]::text[], false, 0),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'TÉ™rÉ™vÉ™zli Heydari', '', 6.50, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_20260510155623302071641.jpg', ARRAY[]::text[], false, 1),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'BadÄ±mcan Qoz ilÉ™', '', 8.00, 'https://monyo.az/v4/uploads/a_238_202202211717241659183804.jpg', ARRAY[]::text[], false, 2),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'Qazax TÉ™rÉ™vÉ™zi', 'Qazax pomidoru, yerpenek xiyar, acÄ± biber, soÄŸan, gÃ¶yÉ™rti Ã§eÅŸidlÉ™ri', 8.50, 'https://monyo.az/v4/uploads2/uploads2025-02/a_238_202502151941161190194399.jpg', ARRAY[]::text[], false, 3),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'Ã‡iy KÃ¶ftÉ™', '', 7.00, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_202605132047262114719674.jpg', ARRAY[]::text[], false, 4),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'TÉ™rÉ™vÉ™z Assorti', '', 8.50, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_20260513205130943485421.jpg', ARRAY[]::text[], false, 5),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'Meze Set', '', 29.80, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_20260513204926242483616.jpg', ARRAY['popular'], false, 6),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'ÅÉ™ki DÃ¶ymÉ™ci', '', 8.50, 'https://monyo.az/v4/uploads/a_238_202202211653201191943445.jpg', ARRAY[]::text[], false, 7),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'Pendir Ã‡eÅŸidlÉ™ri', '', 18.00, 'https://monyo.az/v4/uploads2/uploads2025-12/a_238_20251226200936717089009.jpg', ARRAY[]::text[], false, 8),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'BalÄ±q Ã‡eÅŸidlÉ™ri', '', 52.50, 'https://monyo.az/v4/uploads2/uploads2025-12/a_238_20251221201041317174464.jpg', ARRAY['premium'], false, 9),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'Æt Ã‡eÅŸidlÉ™ri', '', 34.50, 'https://monyo.az/v4/uploads2/uploads2025-12/a_238_202512211907151599367390.jpg', ARRAY['popular'], false, 10),
  -- Salatlar
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'QÄ±rmÄ±zÄ± Lobya SalatÄ±', '', 7.50, 'https://monyo.az/v4/uploads2/uploads2025-12/a_238_202512212009361416836065.jpg', ARRAY[]::text[], false, 0),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Paytaxt SalatÄ±', '', 7.50, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_20260513205411758899176.jpg', ARRAY[]::text[], false, 1),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Manqal SalatÄ±', '', 7.50, 'https://monyo.az/v4/uploads2/uploads2025-12/a_238_202512212029532092605551.jpg', ARRAY[]::text[], false, 2),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'AlbalÄ± Salat', '', 9.20, 'https://monyo.az/v4/uploads/a_238_20220221170531494495241.jpg', ARRAY[]::text[], false, 3),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Ä°stanbul', '', 7.50, 'https://monyo.az/v4/uploads/a_238_202202211709361404796557.jpg', ARRAY[]::text[], false, 4),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'KÉ™nd Salat', '', 9.80, 'https://monyo.az/v4/uploads2/uploads2023-05/a_238_20230510163410964307725.jpg', ARRAY[]::text[], false, 5),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Sezar (Toyuq / Krevet)', '', 14.20, 'https://monyo.az/v4/uploads/a_238_202202211712381344802282.jpg', ARRAY['popular'], false, 6),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Popcorn SalatÄ±', '', 16.20, 'https://monyo.az/v4/uploads2/uploads2023-05/a_238_202305092033181315266338.jpg', ARRAY[]::text[], false, 7),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Buratto Salat', '', 17.50, 'https://monyo.az/v4/uploads2/uploads2025-05/a_238_20250531200255762603968.jpg', ARRAY['new'], false, 8),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'QoÅŸa-Qala SalatÄ±', '', 16.00, 'https://monyo.az/v4/uploads2/uploads2023-05/a_238_20230509154904241030747.jpg', ARRAY['popular','chef-special'], true, 9),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Helium SalatÄ±', '', 12.25, 'https://monyo.az/v4/uploads2/uploads2024-04/a_238_202404202041491080149000.jpg', ARRAY[]::text[], false, 10),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'BadÄ±mcan XÄ±rt-XÄ±rt', '', 12.50, 'https://monyo.az/v4/uploads/a_238_20220429185730807671710.jpg', ARRAY[]::text[], false, 11),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Avokado Karides ilÉ™', '', 15.85, 'https://monyo.az/v4/uploads2/uploads2023-05/a_238_2023050921502540957035.jpg', ARRAY[]::text[], false, 12),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Brusketa Salat', '', 14.15, 'https://monyo.az/v4/uploads2/uploads2024-12/a_238_20241212184202448005012.jpg', ARRAY[]::text[], false, 13),
  -- Ä°sti QÉ™lyanaltÄ±lar
  ('hot-app', (SELECT id FROM cats WHERE slug='hot-app'), 'VarlÄ± DolmasÄ±', '', 12.50, 'https://monyo.az/v4/uploads2/uploads2026-06/a_238_20260601181244153494345.jpg', ARRAY[]::text[], false, 0),
  ('hot-app', (SELECT id FROM cats WHERE slug='hot-app'), 'Kraker Krevet', '', 17.00, 'https://monyo.az/v4/uploads/a_238_202202211730031774074000.jpg', ARRAY[]::text[], false, 1),
  ('hot-app', (SELECT id FROM cats WHERE slug='hot-app'), 'KÉ™rÉ™ YaÄŸÄ±nda Krevet', '', 20.00, 'https://monyo.az/v4/uploads/a_238_202202211729241512847507.jpg', ARRAY['popular'], false, 2),
  ('hot-app', (SELECT id FROM cats WHERE slug='hot-app'), 'Dolma Yarpaq', '', 12.50, 'https://monyo.az/v4/uploads/a_238_20220417025450985699392.jpg', ARRAY[]::text[], false, 3),
  -- Åorbalar
  ('soups', (SELECT id FROM cats WHERE slug='soups'), 'DÃ¼ÅŸbÉ™rÉ™', '', 7.00, 'https://monyo.az/v4/uploads/a_238_20220221173838935458639.jpg', ARRAY[]::text[], false, 0),
  ('soups', (SELECT id FROM cats WHERE slug='soups'), 'MÉ™rci', '', 7.00, 'https://monyo.az/v4/uploads/a_238_2022022117411945095560.jpg', ARRAY[]::text[], false, 1),
  ('soups', (SELECT id FROM cats WHERE slug='soups'), 'Ã‡olpa', '', 7.00, 'https://monyo.az/v4/uploads/a_238_20220221174155667423688.jpg', ARRAY[]::text[], false, 2),
  -- Æsas XÃ¶rÉ™klÉ™r
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Qaymaqla KÉ™nd ToyuÄŸu', '', 25.50, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_202605132158041987729214.jpg', ARRAY[]::text[], false, 0),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Yarpaq CiyÉ™r', 'Quzu ciyÉ™r, kartof', 16.50, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_20260514191252124807293.jpg', ARRAY[]::text[], false, 1),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Faxitos', '', 27.50, 'https://monyo.az/v4/uploads2/uploads2023-06/a_238_202306271732431499459773.jpg', ARRAY[]::text[], false, 2),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Vyana Ånitsel', '', 15.50, 'https://monyo.az/v4/uploads/a_238_202202211812141203556805.jpg', ARRAY[]::text[], false, 3),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'CÄ±z BÄ±z', '', 18.00, 'https://monyo.az/v4/uploads/a_238_202202211958302105109875.jpg', ARRAY[]::text[], false, 4),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Limonlu BeÃ§É™', '', 25.50, 'https://monyo.az/v4/uploads2/uploads2023-06/a_238_20230616181624661945457.jpg', ARRAY[]::text[], false, 5),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Limonlu Can Æti', '', 27.90, 'https://monyo.az/v4/uploads/a_238_20220429170742957917600.jpg', ARRAY[]::text[], false, 6),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Can Æti AlbalÄ± Sousu ilÉ™', '', 28.80, 'https://monyo.az/v4/uploads2/uploads2023-11/a_238_202311031457301844966828.jpg', ARRAY[]::text[], false, 7),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Ã‡olpa Sac', '', 35.00, 'https://monyo.az/v4/uploads2/uploads2023-06/a_238_202306161909491532919201.jpg', ARRAY['popular'], false, 8),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Dana Sac', '', 42.00, 'https://monyo.az/v4/uploads2/uploads2023-11/a_238_20231102211608840556385.jpg', ARRAY[]::text[], false, 9),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'QoÅŸa Qala Sac', '', 45.00, NULL, ARRAY['popular','chef-special'], true, 10),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'TikÉ™ BatÄ±rma Xoruz', '', 35.00, 'https://monyo.az/v4/uploads2/uploads2024-12/a_238_20241212154012753441210.jpg', ARRAY['new'], false, 11),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Quzu Sac', '', 42.00, 'https://monyo.az/v4/uploads/a_238_20220417025952968763022.jpg', ARRAY[]::text[], false, 12),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Kefli BeÃ§É™', '', 27.80, 'https://monyo.az/v4/uploads/a_238_20220429170950416041566.jpg', ARRAY[]::text[], false, 13),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'HisÉ™ VerilmiÅŸ Dana', '', 31.00, 'https://monyo.az/v4/uploads2/uploads2024-12/a_238_202412121836031367265236.jpg', ARRAY[]::text[], false, 14),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'KÃ¼rÉ™dÉ™ Quzu', '', 35.00, NULL, ARRAY[]::text[], false, 15),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'ÅefdÉ™n Ã–zÉ™l Quzu', '', 95.00, 'https://monyo.az/v4/uploads2/uploads2024-12/a_238_20241212184009503847279.jpg', ARRAY['premium','chef-special'], true, 16),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Nar Qovurma (NÉ™rÉ™)', '', 65.00, 'https://monyo.az/v4/uploads/a_238_202204291711122002084946.jpg', ARRAY['premium'], false, 17),
  -- SteyklÉ™r
  ('steaks', (SELECT id FROM cats WHERE slug='steaks'), 'Steak Ribay Premium', '', 85.00, NULL, ARRAY['premium'], true, 0),
  ('steaks', (SELECT id FROM cats WHERE slug='steaks'), 'Lokum Can Æti Premium', '', 60.00, 'https://monyo.az/v4/uploads/a_238_202202211818532057977623.jpg', ARRAY['premium'], false, 1),
  -- BarbekÃ¼ & Mangal
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'Toyuq KababÄ±', '', 9.80, 'https://monyo.az/v4/uploads/a_238_202204090838581759369082.jpg', ARRAY[]::text[], false, 0),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'Tac QabÄ±rÄŸa KababÄ±', '', 12.00, 'https://monyo.az/v4/uploads2/uploads2025-06/a_238_2025062920165811467683.jpg', ARRAY[]::text[], false, 1),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'Quzu Ä°Ã§alat', '', 9.50, 'https://monyo.az/v4/uploads/a_238_202203072028312132065147.jpg', ARRAY[]::text[], false, 2),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'KÉ™nd Ã‡olpa TurÅŸu Sousunda', '', 25.00, 'https://monyo.az/v4/uploads/a_238_202204170300441073889459.jpg', ARRAY[]::text[], false, 3),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'Berj', '', 39.00, 'https://monyo.az/v4/uploads/a_238_20220221195141897782747.jpg', ARRAY['popular'], false, 4),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'TÉ™rÉ™vÉ™z KababÄ±', '', 6.00, 'https://monyo.az/v4/uploads/a_238_20220429172120369715383.jpg', ARRAY[]::text[], false, 5),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'LÃ¼lÉ™ Kabab', '', 13.90, 'https://monyo.az/v4/uploads/a_238_20220429171833724526956.jpg', ARRAY['popular'], false, 6),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'TikÉ™ Kabab', '', 14.15, 'https://monyo.az/v4/uploads/a_238_202204291720281726231737.jpg', ARRAY[]::text[], false, 7),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'Quzu Antrikot', '', 15.10, 'https://monyo.az/v4/uploads/a_238_20220429171930811146845.jpg', ARRAY[]::text[], false, 8),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'Dana BasdÄ±rma CanÆtindÉ™n', '', 17.90, 'https://monyo.az/v4/uploads/a_238_202204291715401401754201.jpg', ARRAY[]::text[], false, 9)
) AS t(category, category_id, name_az, desc_az, price, image_url, badges, is_featured, sort_order);

-- 4. Qalereya (15 ÅŸÉ™kil + 1 video)
INSERT INTO public.gallery (url, thumbnail_url, media_type, category, caption_az, caption_ru, caption_en, sort_order) VALUES
('https://monyo.az/v4/uploads/a_238_202202201143261201897352.jpg',  NULL, 'image', 'interior', 'Æsas zal',                'Ğ“Ğ»Ğ°Ğ²Ğ½Ñ‹Ğ¹ Ğ·Ğ°Ğ»',           'Main hall',           0),
('https://monyo.az/v4/uploads/a_238_20220220114340612710257.jpg',   NULL, 'image', 'interior', 'Restoran gÃ¶rÃ¼nÃ¼ÅŸÃ¼',       'Ğ’Ğ¸Ğ´ Ñ€ĞµÑÑ‚Ğ¾Ñ€Ğ°Ğ½Ğ°',         'Restaurant view',     1),
('https://monyo.az/v4/uploads/a_238_202202201143561494530995.jpg',  NULL, 'image', 'interior', 'ZalÄ±n dekorasiyasÄ±',      'Ğ”ĞµĞºĞ¾Ñ€Ğ°Ñ†Ğ¸Ñ Ğ·Ğ°Ğ»Ğ°',        'Hall decoration',     2),
('https://monyo.az/v4/uploads/a_238_20220220114411296776468.jpg',   NULL, 'image', 'interior', 'AxÅŸam atmosferi',         'Ğ’ĞµÑ‡ĞµÑ€Ğ½ÑÑ Ğ°Ñ‚Ğ¼Ğ¾ÑÑ„ĞµÑ€Ğ°',    'Evening atmosphere',  3),
('https://monyo.az/v4/uploads/a_238_20220220114427851654744.jpg',   NULL, 'image', 'interior', 'Restoran interyoru',      'Ğ˜Ğ½Ñ‚ĞµÑ€ÑŒĞµÑ€ Ñ€ĞµÑÑ‚Ğ¾Ñ€Ğ°Ğ½Ğ°',    'Restaurant interior', 4),
('https://monyo.az/v4/uploads/a_238_20220307210049580247944.jpg',   NULL, 'image', 'food',     'DadlÄ± yemÉ™klÉ™r',          'Ğ’ĞºÑƒÑĞ½Ñ‹Ğµ Ğ±Ğ»ÑĞ´Ğ°',         'Delicious dishes',    5),
('https://monyo.az/v4/uploads/a_238_202203072101051490665555.jpg',  NULL, 'image', 'food',     'Milli xÃ¶rÉ™klÉ™r',          'ĞĞ°Ñ†Ğ¸Ğ¾Ğ½Ğ°Ğ»ÑŒĞ½Ñ‹Ğµ Ğ±Ğ»ÑĞ´Ğ°',    'National dishes',     6),
('https://monyo.az/v4/uploads/a_238_202203072101141136582201.jpg',  NULL, 'image', 'food',     'QÉ™lyanaltÄ±lar',           'Ğ—Ğ°ĞºÑƒÑĞºĞ¸',               'Appetizers',          7),
('https://monyo.az/v4/uploads/a_238_20220307210121796259456.jpg',   NULL, 'image', 'interior', 'VIP zal',                 'VIP Ğ·Ğ°Ğ»',               'VIP hall',            8),
('https://monyo.az/v4/uploads/a_238_20220307210152218462329.jpg',   NULL, 'image', 'terrace',  'Yay terrasÄ±',             'Ğ›ĞµÑ‚Ğ½ÑÑ Ñ‚ĞµÑ€Ñ€Ğ°ÑĞ°',        'Summer terrace',      9),
('https://monyo.az/v4/uploads/a_238_202203072102032070033541.jpg',  NULL, 'image', 'events',   'XÃ¼susi tÉ™dbirlÉ™r',        'ĞÑĞ¾Ğ±Ñ‹Ğµ Ğ¼ĞµÑ€Ğ¾Ğ¿Ñ€Ğ¸ÑÑ‚Ğ¸Ñ',    'Special events',      10),
('https://monyo.az/v4/uploads/a_238_2022030721021095367034.jpg',    NULL, 'image', 'interior', 'GecÉ™ atmosferi',          'ĞĞ¾Ñ‡Ğ½Ğ°Ñ Ğ°Ñ‚Ğ¼Ğ¾ÑÑ„ĞµÑ€Ğ°',      'Night atmosphere',    11),
('https://monyo.az/v4/uploads/a_238_202203072102161962856230.jpg',  NULL, 'image', 'food',     'Ä°Ã§kilÉ™r',                 'ĞĞ°Ğ¿Ğ¸Ñ‚ĞºĞ¸',               'Beverages',           12),
('https://monyo.az/v4/uploads/a_238_2022030721023877377598.jpg',    NULL, 'image', 'interior', 'Zal gÃ¶rÃ¼nÃ¼ÅŸÃ¼',            'Ğ’Ğ¸Ğ´ Ğ·Ğ°Ğ»Ğ°',              'Hall view',           13),
('https://monyo.az/v4/uploads/a_238_20220307210248549694465.jpg',   NULL, 'image', 'terrace',  'Terras bÃ¶lmÉ™si',          'Ğ¢ĞµÑ€Ñ€Ğ°ÑĞ°',               'Terrace section',     14),
('https://monyo.az/v4/uploads-video/pv_2384d6a4d34_profile.mp4?x=1683810091',
 'https://monyo.az/v4/uploads/a_238_202202201143261201897352.jpg',
 'video', 'video', 'QoÅŸa Qala tanÄ±tÄ±m videosu', 'Ğ’Ğ¸Ğ´ĞµĞ¾ Ğ¿Ñ€ĞµĞ·ĞµĞ½Ñ‚Ğ°Ñ†Ğ¸Ñ QoÅŸa Qala', 'QoÅŸa Qala Presentation Video', 15);

-- 5. SaytÄ±n É™laqÉ™ vÉ™ iÅŸ saatlarÄ± mÉ™lumatlarÄ±
INSERT INTO public.site_settings (key, value) VALUES
('contact_info', jsonb_build_object(
  'phone1', '+994 50 615 88 88',
  'phone2', '+994 50 790 88 88',
  'email', 'qoshaqalam1@gmail.com',
  'address_az', 'Buzovna-MÉ™rdÉ™kan ÅŸossesi, MÉ™rdÉ™kan, BakÄ±',
  'address_ru', 'Ğ¨Ğ¾ÑÑĞµ Ğ‘ÑƒĞ·Ğ¾Ğ²Ğ½Ğ°-ĞœĞ°Ñ€Ğ´Ğ°ĞºĞ°Ğ½, ĞœĞ°Ñ€Ğ´Ğ°ĞºĞ°Ğ½, Ğ‘Ğ°ĞºÑƒ',
  'address_en', 'Buzovna-Mardakan highway, Mardakan, Baku',
  'maps_lat', 40.51218,
  'maps_lng', 50.13811,
  'instagram', 'https://instagram.com/qoshaqala',
  'facebook', 'https://m.facebook.com/QoshaQala/',
  'whatsapp', 'https://wa.me/994506158888',
  'dress_code', true,
  'service_charge', 10
)),
('working_hours', jsonb_build_object(
  'monday',    jsonb_build_object('open', '10:00', 'close', '01:00'),
  'tuesday',   jsonb_build_object('open', '10:00', 'close', '01:00'),
  'wednesday', jsonb_build_object('open', '10:00', 'close', '01:00'),
  'thursday',  jsonb_build_object('open', '10:00', 'close', '01:00'),
  'friday',    jsonb_build_object('open', '10:00', 'close', '01:00'),
  'saturday',  jsonb_build_object('open', '10:00', 'close', '01:00'),
  'sunday',    jsonb_build_object('open', '10:00', 'close', '01:00')
));

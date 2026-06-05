-- =====================================================================
-- QOŞA QALA — TAM VERİLƏNLƏR BAZASI QURULUM SQL-i
-- Supabase SQL Editor-ə yapışdırın və Run edin
-- =====================================================================

-- ============ 1. ROLES SYSTEM ============
DROP TABLE IF EXISTS public.waiter_calls CASCADE;
DROP TABLE IF EXISTS public.audit_log CASCADE;
DROP TABLE IF EXISTS public.menu_item_extras CASCADE;
DROP TABLE IF EXISTS public.menu_item_variants CASCADE;
DROP TABLE IF EXISTS public.template_categories CASCADE;
DROP TABLE IF EXISTS public.menu_templates CASCADE;
DROP TABLE IF EXISTS public.reservations CASCADE;
DROP TABLE IF EXISTS public.restaurant_tables CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.menu_items CASCADE;
DROP TABLE IF EXISTS public.menu_categories CASCADE;
DROP TABLE IF EXISTS public.gallery CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.qr_settings CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;

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

-- ============ 2. MENU ITEMS ============
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_az TEXT NOT NULL,
  name_ru TEXT NOT NULL DEFAULT '',
  name_en TEXT NOT NULL DEFAULT '',
  desc_az TEXT NOT NULL DEFAULT '',
  desc_ru TEXT NOT NULL DEFAULT '',
  desc_en TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  old_price NUMERIC(10,2),
  category TEXT NOT NULL,
  category_id UUID,
  image_url TEXT,
  weight_grams INTEGER,
  calories INTEGER,
  cooking_time INTEGER,
  spicy_level INTEGER DEFAULT 0 CHECK (spicy_level BETWEEN 0 AND 3),
  allergens TEXT[] NOT NULL DEFAULT '{}',
  badges TEXT[] NOT NULL DEFAULT '{}',
  badge TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view active menu" ON public.menu_items FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admin manage menu" ON public.menu_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ 3. REVIEWS ============
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  content TEXT NOT NULL,
  content_az TEXT NOT NULL DEFAULT '',
  content_ru TEXT NOT NULL DEFAULT '',
  content_en TEXT NOT NULL DEFAULT '',
  review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  source TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view approved reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "Admin manage reviews" ON public.reviews FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ 4. GALLERY ============
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  media_type TEXT NOT NULL DEFAULT 'image',
  category TEXT NOT NULL DEFAULT 'interior',
  title TEXT NOT NULL DEFAULT '',
  caption_az TEXT NOT NULL DEFAULT '',
  caption_ru TEXT NOT NULL DEFAULT '',
  caption_en TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.gallery TO anon, authenticated;
GRANT ALL ON public.gallery TO service_role;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admin manage gallery" ON public.gallery FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ 5. MENU CATEGORIES ============
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

ALTER TABLE public.menu_items
  ADD CONSTRAINT menu_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.menu_categories(id) ON DELETE SET NULL;

-- ============ 6. SITE SETTINGS ============
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ 7. RESTAURANT TABLES ============
CREATE TABLE public.restaurant_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number INTEGER NOT NULL UNIQUE,
  table_name TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT 'İçəri',
  capacity INTEGER NOT NULL DEFAULT 4,
  custom_message TEXT NOT NULL DEFAULT '',
  qr_active BOOLEAN NOT NULL DEFAULT true,
  qr_version INTEGER NOT NULL DEFAULT 1,
  menu_filter TEXT[] NOT NULL DEFAULT '{all}',
  template_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.restaurant_tables TO anon, authenticated;
GRANT ALL ON public.restaurant_tables TO service_role;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view active tables" ON public.restaurant_tables FOR SELECT TO anon, authenticated USING (qr_active = true);
CREATE POLICY "Admin manage tables" ON public.restaurant_tables FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ 8. RESERVATIONS ============
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guests INTEGER NOT NULL DEFAULT 2 CHECK (guests BETWEEN 1 AND 50),
  occasion TEXT,
  note TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  table_id UUID REFERENCES public.restaurant_tables(id) ON DELETE SET NULL,
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

-- ============ 9. STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public) VALUES
  ('menu-images', 'menu-images', true),
  ('gallery-images', 'gallery-images', true)
ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "Public read menu images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload menu images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update menu images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete menu images" ON storage.objects;

DROP POLICY IF EXISTS "Public read gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete gallery images" ON storage.objects;

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

-- ============ 10. UPDATED_AT TRIGGER ============
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER menu_items_touch_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER site_settings_touch_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER restaurant_tables_touch_updated_at
  BEFORE UPDATE ON public.restaurant_tables
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ 11. MENU TEMPLATES ============
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
CREATE POLICY "Public view templates" ON public.menu_templates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage templates" ON public.menu_templates FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE UNIQUE INDEX one_default_template ON public.menu_templates (is_default) WHERE is_default = true;

-- ============ 12. TEMPLATE CATEGORIES ============
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
CREATE POLICY "Public view template_categories" ON public.template_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage template_categories" ON public.template_categories FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.restaurant_tables
  ADD CONSTRAINT restaurant_tables_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.menu_templates(id) ON DELETE SET NULL;

-- ============ 13. MENU ITEM VARIANTS & EXTRAS ============
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
CREATE POLICY "Public view variants" ON public.menu_item_variants FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage variants" ON public.menu_item_variants FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

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
CREATE POLICY "Public view extras" ON public.menu_item_extras FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage extras" ON public.menu_item_extras FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============ 14. AUDIT LOG ============
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

-- ============ 15. WAITER CALLS ============
CREATE TABLE public.waiter_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number integer NOT NULL,
  table_id uuid,
  kind text NOT NULL DEFAULT 'waiter',
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.waiter_calls TO authenticated;
GRANT SELECT, INSERT ON public.waiter_calls TO anon;
GRANT ALL ON public.waiter_calls TO service_role;

ALTER TABLE public.waiter_calls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can call waiter" ON public.waiter_calls FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin manage waiter calls" ON public.waiter_calls FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============ 16. REALTIME ============
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_tables;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_templates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.template_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_item_variants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_item_extras;
ALTER PUBLICATION supabase_realtime ADD TABLE public.waiter_calls;

ALTER TABLE public.menu_items REPLICA IDENTITY FULL;
ALTER TABLE public.menu_categories REPLICA IDENTITY FULL;
ALTER TABLE public.restaurant_tables REPLICA IDENTITY FULL;
ALTER TABLE public.gallery REPLICA IDENTITY FULL;
ALTER TABLE public.reviews REPLICA IDENTITY FULL;
ALTER TABLE public.menu_templates REPLICA IDENTITY FULL;
ALTER TABLE public.waiter_calls REPLICA IDENTITY FULL;

-- ============================================================
-- 17. SEED: KATEQORİYALAR (CSV-dən real UUID-lərlə)
-- ============================================================
INSERT INTO public.menu_categories (id, slug, name_az, name_ru, name_en, icon, sort_order, is_active) VALUES
  ('85212989-7920-4f02-a76e-62b4a01898d0','breakfast','Səhər Yeməyi','Завтрак','Breakfast','🌅',0,true),
  ('d529eff7-c1bc-4550-aca1-2b24f42ee5fc','cold-app','Soyuq Qəlyanaltılar','Холодные закуски','Cold Appetizers','🥗',1,true),
  ('74c5fc7e-31a6-4f78-9511-114848374f79','salads','Salatlar','Салаты','Salads','🥙',2,true),
  ('7e9ea21c-9302-4340-be09-91d698277168','hot-app','İsti Qəlyanaltılar','Горячие закуски','Hot Appetizers','🔥',3,true),
  ('d6b3e1e1-21a7-485b-b109-e107012b25b4','soups','Şorbalar','Супы','Soups','🍲',4,true),
  ('d3a23871-be5b-4dff-ac83-2440ff0b1fd0','mains','Əsas Xörəklər','Основные блюда','Main Dishes','🍖',5,true),
  ('121f55e0-67ee-4f27-b2be-482dd4047a67','steaks','Steyklər','Стейки','Steaks','🥩',6,true),
  ('d298686f-f91a-4039-aad7-7eaa930a2c55','bbq','Barbekü & Mangal','Барбекю & Мангал','BBQ & Grill','🔥',7,true),
  ('8da830dc-c350-41f6-8a42-d470a8254328','seafood','Dəniz Məhsulları','Морепродукты','Seafood','🐟',8,true),
  ('7e691395-885a-4082-befc-db0257f09a6a','pasta','Xəmir / İtalyan Pastaları','Паста / Тесто','Pasta / Dough','🍝',9,true),
  ('16ca8ff8-3573-4ed8-8b35-b620faf23c55','sides','Qarnir','Гарниры','Side Dishes','🍟',10,true),
  ('42a1eb82-c021-4e63-a0ee-298921aabec0','desserts','Şirniyyatlar','Десерты','Desserts','🍰',11,true),
  ('869b6cfa-4e49-414a-91b7-83d01bfdcd55','beverages','İçkilər','Напитки','Beverages','🥤',12,true),
  ('3ab0cd98-7489-405e-99df-2b168434573f','alcohol','Sərxoşedici İçkilər','Алкогольные напитки','Alcoholic Drinks','🍷',13,true),
  ('2e910324-54b9-44e1-9f62-bb3bb90d2739','kids','Uşaq Menyusu','Детское меню','Kids Menu','👶',14,true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 18. SEED: MENYU MƏHSULLARi (CSV-dən 78 real məhsul)
-- ============================================================
INSERT INTO public.menu_items (id, name_az, desc_az, price, category, category_id, image_url, badges, is_featured, sort_order) VALUES
-- SƏHƏR YEMƏYİ
('0f232679-5692-4615-9517-f71410637b78','Set Səpmə (1-4 nəfərlik)','Blini, dağ balı, kənd xaması, qaymaq, kəsmik, Qazax pomidoru, Xaçmaz xiyarı, qatılaşdırılmış süd, kənd pendiri, motal, holland pendiri, əncir mürəbbəsi, nehrə yağı, sütlac, təndir çörəyi, simit',68.50,'breakfast','85212989-7920-4f02-a76e-62b4a01898d0','https://monyo.az/v4/uploads2/uploads2026-02/a_238_202602061202551362876341.jpg','{"popular"}',true,0),
('e1258aa7-1a98-484d-b988-bfe7b0c549d9','Mixlama','',12.00,'breakfast','85212989-7920-4f02-a76e-62b4a01898d0','https://monyo.az/v4/uploads2/uploads2026-05/a_238_202605292051081630107618.jpg','{}',false,1),
('1bed0716-d9da-450c-acb7-ae04a969c4ab','Sucuq ilə Kənd Yumurtasından Qayğanaq','',6.00,'breakfast','85212989-7920-4f02-a76e-62b4a01898d0','https://monyo.az/v4/uploads2/uploads2023-05/a_238_202305091444431704512694.jpg','{}',false,2),
('21d9502a-a314-48eb-9313-ccb6fb100aab','Kənd Yumurtasından Omlet','',7.00,'breakfast','85212989-7920-4f02-a76e-62b4a01898d0','https://monyo.az/v4/uploads2/uploads2023-04/a_238_202304202020221104232697.jpg','{}',false,3),
('c07c83d5-0142-457a-8ac1-a30281106e29','Kəndsayağı Pomidor Yumurta','',6.00,'breakfast','85212989-7920-4f02-a76e-62b4a01898d0','https://monyo.az/v4/uploads2/uploads2023-04/a_238_20230420190449580506759.jpg','{}',false,4),
('89e308db-997f-4b10-a48e-8ff0430d3094','Sosis Xaçmas Pomidor Sousunda','',7.00,'breakfast','85212989-7920-4f02-a76e-62b4a01898d0','https://monyo.az/v4/uploads2/uploads2023-04/a_238_20230419202201839596183.jpg','{}',false,5),
('629a736a-53bc-4308-babf-1998591a54d7','Kənd Yumurta İspanax ilə','',6.00,'breakfast','85212989-7920-4f02-a76e-62b4a01898d0','https://monyo.az/v4/uploads2/uploads2023-04/a_238_202304202006411547910304.jpg','{}',false,6),
('f8092e2f-5e49-4238-870e-c908d7561b74','Xaçapuri Adjar Sayağı','',12.00,'breakfast','85212989-7920-4f02-a76e-62b4a01898d0','https://monyo.az/v4/uploads2/uploads2023-05/a_238_20230508202253538216893.jpg','{}',false,7),
('f4f03bd3-28bd-4f33-b221-976b3506f744','Blinçik Ət/Kəsmik (1 ədəd)','',2.50,'breakfast','85212989-7920-4f02-a76e-62b4a01898d0','https://monyo.az/v4/uploads/a_238_202204262013081293453608.jpg','{}',false,8),
('810e51ce-2e44-41e3-a4b2-28b044548a33','Sosiska "Vyana" (2 ədəd)','',8.50,'breakfast','85212989-7920-4f02-a76e-62b4a01898d0','https://monyo.az/v4/uploads2/uploads2026-05/a_238_202605132135221498367294.jpg','{}',false,9),
('32f7ac8b-d238-4f90-8741-4b7078359909','Bal (100qr)','',4.30,'breakfast','85212989-7920-4f02-a76e-62b4a01898d0','https://monyo.az/v4/uploads2/uploads2025-05/a_238_20250530203440224616732.jpg','{}',false,10),
('828e85f4-018a-4928-8836-426745075c74','Sırnik','',6.00,'breakfast','85212989-7920-4f02-a76e-62b4a01898d0','https://monyo.az/v4/uploads2/uploads2023-04/a_238_20230420211216911747553.jpg','{}',false,11),
('9ef1153b-efba-4fdb-b2b9-47a6c3baebef','Yağ','',4.80,'breakfast','85212989-7920-4f02-a76e-62b4a01898d0','https://monyo.az/v4/uploads2/uploads2025-12/a_238_20251221202629971028928.jpg','{}',false,12),
('b4f256c4-2cc3-450f-88c6-7e649d0b7cec','Qaymaq','',3.80,'breakfast','85212989-7920-4f02-a76e-62b4a01898d0','https://monyo.az/v4/uploads2/uploads2025-05/a_238_20250530205403842517424.jpg','{}',false,13),
('e3083a0e-485d-4ec4-8d69-02e639383db4','Xama (100qr)','',3.80,'breakfast','85212989-7920-4f02-a76e-62b4a01898d0','https://monyo.az/v4/uploads2/uploads2025-12/a_238_20251221202702546437894.jpg','{}',false,14),
('90e134f2-b9f9-49a8-a90a-7e8e685af1b7','Pendir Brinza (100qr)','',6.00,'breakfast','85212989-7920-4f02-a76e-62b4a01898d0','https://monyo.az/v4/uploads2/uploads2025-05/a_238_20250530203647121903527.jpg','{}',false,15),
-- SOYUQ QƏLYANALTIlAR
('60884f56-3613-4de6-b994-4edd0308440f','Açılı Əzmə','',6.50,'cold-app','d529eff7-c1bc-4550-aca1-2b24f42ee5fc','https://monyo.az/v4/uploads2/uploads2025-12/a_238_202512211919381296222126.jpg','{}',false,0),
('e09c8424-10e5-4c8a-8ee2-90968f80c5b3','Tərəvəzli Heydari','',6.50,'cold-app','d529eff7-c1bc-4550-aca1-2b24f42ee5fc','https://monyo.az/v4/uploads2/uploads2026-05/a_238_20260510155623302071641.jpg','{}',false,1),
('9420bd3e-04bc-4640-8910-ad088d916449','Badımcan Qoz ilə','',8.00,'cold-app','d529eff7-c1bc-4550-aca1-2b24f42ee5fc','https://monyo.az/v4/uploads/a_238_202202211717241659183804.jpg','{}',false,2),
('dd815c8b-6db4-4929-9219-da1997153035','Qazax Tərəvəzi','Qazax pomidoru, yerpenek xiyar, acı biber, soğan, göyərti çeşidləri',8.50,'cold-app','d529eff7-c1bc-4550-aca1-2b24f42ee5fc','https://monyo.az/v4/uploads2/uploads2025-02/a_238_202502151941161190194399.jpg','{}',false,3),
('43a38bc0-58d7-4c8c-a9e6-99e5449d7303','Çiy Köftə','',7.00,'cold-app','d529eff7-c1bc-4550-aca1-2b24f42ee5fc','https://monyo.az/v4/uploads2/uploads2026-05/a_238_202605132047262114719674.jpg','{}',false,4),
('b173df7b-10cc-408f-a322-ab89b70443e4','Tərəvəz Assorti','',8.50,'cold-app','d529eff7-c1bc-4550-aca1-2b24f42ee5fc','https://monyo.az/v4/uploads2/uploads2026-05/a_238_20260513205130943485421.jpg','{}',false,5),
('2f83453f-a7f1-4db8-ab56-30e25dac27a5','Meze Set','',29.80,'cold-app','d529eff7-c1bc-4550-aca1-2b24f42ee5fc','https://monyo.az/v4/uploads2/uploads2026-05/a_238_20260513204926242483616.jpg','{"popular"}',false,6),
('557a9d78-9e5d-401a-a1ed-06b1b4234b29','Şəki Döyməci','',8.50,'cold-app','d529eff7-c1bc-4550-aca1-2b24f42ee5fc','https://monyo.az/v4/uploads/a_238_202202211653201191943445.jpg','{}',false,7),
('c4016b9e-1025-4784-b8ca-d3b9f7f5a357','Pendir Çeşidləri','',18.00,'cold-app','d529eff7-c1bc-4550-aca1-2b24f42ee5fc','https://monyo.az/v4/uploads2/uploads2025-12/a_238_20251226200936717089009.jpg','{}',false,8),
('660e126d-4417-4206-8bb1-ac9d127d02c5','Balıq Çeşidləri','',52.50,'cold-app','d529eff7-c1bc-4550-aca1-2b24f42ee5fc','https://monyo.az/v4/uploads2/uploads2025-12/a_238_20251221201041317174464.jpg','{"premium"}',false,9),
('2666c8fd-f71c-4805-834c-381b68108a83','Ət Çeşidləri','',34.50,'cold-app','d529eff7-c1bc-4550-aca1-2b24f42ee5fc','https://monyo.az/v4/uploads2/uploads2025-12/a_238_202512211907151599367390.jpg','{"popular"}',false,10),
-- SALATLAR
('0e487d53-160e-454a-a7b4-78295d7528df','Qırmızı Lobya Salatı','',7.50,'salads','74c5fc7e-31a6-4f78-9511-114848374f79','https://monyo.az/v4/uploads2/uploads2025-12/a_238_202512212009361416836065.jpg','{}',false,0),
('1f1bd859-f4d3-4787-a345-e5b6364b7c46','Paytaxt Salatı','',7.50,'salads','74c5fc7e-31a6-4f78-9511-114848374f79','https://monyo.az/v4/uploads2/uploads2026-05/a_238_20260513205411758899176.jpg','{}',false,1),
('7c09e7b4-5682-4229-98e8-d718d179c7f9','Manqal Salatı','',7.50,'salads','74c5fc7e-31a6-4f78-9511-114848374f79','https://monyo.az/v4/uploads2/uploads2025-12/a_238_202512212029532092605551.jpg','{}',false,2),
('c47e70aa-ffb1-443c-aa91-fe388d0ba1dd','Albalı Salat','',9.20,'salads','74c5fc7e-31a6-4f78-9511-114848374f79','https://monyo.az/v4/uploads/a_238_20220221170531494495241.jpg','{}',false,3),
('1e7e3f46-cb6d-44b5-a83a-085aebacac2b','İstanbul','',7.50,'salads','74c5fc7e-31a6-4f78-9511-114848374f79','https://monyo.az/v4/uploads/a_238_202202211709361404796557.jpg','{}',false,4),
('f9a2575e-3f19-4da6-819f-c67f80dd17a7','Kənd Salat','',9.80,'salads','74c5fc7e-31a6-4f78-9511-114848374f79','https://monyo.az/v4/uploads2/uploads2023-05/a_238_20230510163410964307725.jpg','{}',false,5),
('eba86d4a-2065-4591-a18d-5437d9fc895e','Sezar (Toyuq / Krevet)','',14.20,'salads','74c5fc7e-31a6-4f78-9511-114848374f79','https://monyo.az/v4/uploads/a_238_202202211712381344802282.jpg','{"popular"}',false,6),
('7c891aba-bfa3-4173-96e6-17fab0038045','Popcorn Salatı','',16.20,'salads','74c5fc7e-31a6-4f78-9511-114848374f79','https://monyo.az/v4/uploads2/uploads2023-05/a_238_202305092033181315266338.jpg','{}',false,7),
('1d93965c-43bf-4fd3-aacc-ca8d90796818','Buratto Salat','',17.50,'salads','74c5fc7e-31a6-4f78-9511-114848374f79','https://monyo.az/v4/uploads2/uploads2025-05/a_238_20250531200255762603968.jpg','{"new"}',false,8),
('eadd1c5b-0b8e-4606-a357-6780d39a7475','Qoşa-Qala Salatı','',16.00,'salads','74c5fc7e-31a6-4f78-9511-114848374f79','https://monyo.az/v4/uploads2/uploads2023-05/a_238_20230509154904241030747.jpg','{"popular","chef-special"}',true,9),
('437483e4-5e59-45fc-8438-26a8eeeefb30','Helium Salatı','',12.25,'salads','74c5fc7e-31a6-4f78-9511-114848374f79','https://monyo.az/v4/uploads2/uploads2024-04/a_238_202404202041491080149000.jpg','{}',false,10),
('8c8589c4-b6f0-4bf8-848a-b90010a60ff6','Badımcan Xırt-Xırt','',12.50,'salads','74c5fc7e-31a6-4f78-9511-114848374f79','https://monyo.az/v4/uploads/a_238_20220429185730807671710.jpg','{}',false,11),
('6c0e9f9c-7bea-44e1-aad9-615892e35de8','Avokado Karides ilə','',15.85,'salads','74c5fc7e-31a6-4f78-9511-114848374f79','https://monyo.az/v4/uploads2/uploads2023-05/a_238_2023050921502540957035.jpg','{}',false,12),
('9f74fd6d-289c-44cd-bb45-d8b7676f53fe','Brusketa Salat','',14.15,'salads','74c5fc7e-31a6-4f78-9511-114848374f79','https://monyo.az/v4/uploads2/uploads2024-12/a_238_20241212184202448005012.jpg','{}',false,13),
-- İSTİ QƏLYANALTIlAR
('a6ca703f-0128-4103-a56d-dbb115eb865e','Varlı Dolması','',12.50,'hot-app','7e9ea21c-9302-4340-be09-91d698277168','https://monyo.az/v4/uploads2/uploads2026-06/a_238_20260601181244153494345.jpg','{}',false,0),
('4a4f6d49-991a-434e-baf3-8454315d6149','Kraker Krevet','',17.00,'hot-app','7e9ea21c-9302-4340-be09-91d698277168','https://monyo.az/v4/uploads/a_238_202202211730031774074000.jpg','{}',false,1),
('7b38bd7f-24ba-4698-907f-49f5f43809c1','Kərə Yağında Krevet','',20.00,'hot-app','7e9ea21c-9302-4340-be09-91d698277168','https://monyo.az/v4/uploads/a_238_202202211729241512847507.jpg','{"popular"}',false,2),
('f2075b18-d77b-4d2f-9495-d7737fac3e1b','Dolma Yarpaq','',12.50,'hot-app','7e9ea21c-9302-4340-be09-91d698277168','https://monyo.az/v4/uploads/a_238_20220417025450985699392.jpg','{}',false,3),
-- ŞORBALAR
('d651efaf-d3e0-4c95-901e-fec8e71f81d8','Düşbərə','',7.00,'soups','d6b3e1e1-21a7-485b-b109-e107012b25b4','https://monyo.az/v4/uploads/a_238_20220221173838935458639.jpg','{}',false,0),
('77c259af-38bc-4f4c-b3f0-6771285900dd','Mərci','',7.00,'soups','d6b3e1e1-21a7-485b-b109-e107012b25b4','https://monyo.az/v4/uploads/a_238_2022022117411945095560.jpg','{}',false,1),
('a81cbb47-86d0-4777-a3fe-65b21a251e7a','Çolpa','',7.00,'soups','d6b3e1e1-21a7-485b-b109-e107012b25b4','https://monyo.az/v4/uploads/a_238_20220221174155667423688.jpg','{}',false,2),
-- ƏSAS XÖRƏKLƏRi
('f71f88a6-25f0-4e92-a765-67b88dd1afef','Qaymaqla Kənd Toyuğu','',25.50,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0','https://monyo.az/v4/uploads2/uploads2026-05/a_238_202605132158041987729214.jpg','{}',false,0),
('e6846c7f-da64-4afb-9e72-05c08bc0bf1a','Yarpaq Ciyər','Quzu ciyər, kartof',16.50,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0','https://monyo.az/v4/uploads2/uploads2026-05/a_238_20260514191252124807293.jpg','{}',false,1),
('1e69348a-fba0-496b-aded-b4a1f5bce9bb','Faxitos','',27.50,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0','https://monyo.az/v4/uploads2/uploads2023-06/a_238_202306271732431499459773.jpg','{}',false,2),
('1b168f25-d95d-45ea-9b0d-08077e88ff63','Vyana Şnitsel','',15.50,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0','https://monyo.az/v4/uploads/a_238_202202211812141203556805.jpg','{}',false,3),
('70356ed2-07fd-4c23-98a0-bef5486fc2f2','Cız Bız','',18.00,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0','https://monyo.az/v4/uploads/a_238_202202211958302105109875.jpg','{}',false,4),
('6c366580-5544-4cde-a37f-b01435607859','Limonlu Beçə','',25.50,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0','https://monyo.az/v4/uploads2/uploads2023-06/a_238_20230616181624661945457.jpg','{}',false,5),
('fb2ca670-6742-45c2-a4c0-3bb9514bc9f0','Limonlu Can Əti','',27.90,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0','https://monyo.az/v4/uploads/a_238_20220429170742957917600.jpg','{}',false,6),
('392ed6aa-7ed3-4859-82a0-3829e853eb48','Can Əti Albalı Sousu ilə','',28.80,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0','https://monyo.az/v4/uploads2/uploads2023-11/a_238_202311031457301844966828.jpg','{}',false,7),
('19e91939-aaa5-484e-bc10-2348b4359766','Çolpa Sac','',35.00,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0','https://monyo.az/v4/uploads2/uploads2023-06/a_238_202306161909491532919201.jpg','{"popular"}',false,8),
('78d1f404-eacb-492f-9504-e7e3d025ff64','Dana Sac','',42.00,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0','https://monyo.az/v4/uploads2/uploads2023-11/a_238_20231102211608840556385.jpg','{}',false,9),
('65f9e169-d279-4f84-8a05-40dc5b89699c','Qoşa Qala Sac','',45.00,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0',NULL,'{"popular","chef-special"}',true,10),
('b5be9edd-daaa-41a0-8eb1-4a1d263ba4e4','Tikə Batırma Xoruz','',35.00,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0','https://monyo.az/v4/uploads2/uploads2024-12/a_238_20241212154012753441210.jpg','{"new"}',false,11),
('60e40da9-2426-45de-9020-b82f4d98829d','Quzu Sac','',42.00,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0','https://monyo.az/v4/uploads/a_238_20220417025952968763022.jpg','{}',false,12),
('c3ca33d3-da11-4bc3-bb84-0a03fc8622ad','Kefli Beçə','',27.80,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0','https://monyo.az/v4/uploads/a_238_20220429170950416041566.jpg','{}',false,13),
('f5f97865-1ea5-41a3-8daf-94d92522dbf3','Hisə Verilmiş Dana','',31.00,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0','https://monyo.az/v4/uploads2/uploads2024-12/a_238_202412121836031367265236.jpg','{}',false,14),
('5f9b3e21-4fb2-4cfe-9a97-6f341654475a','Kürədə Quzu','',35.00,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0',NULL,'{}',false,15),
('453a1ea7-7d9d-4837-b922-f16792c4ac50','Şefdən Özəl Quzu','',95.00,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0','https://monyo.az/v4/uploads2/uploads2024-12/a_238_20241212184009503847279.jpg','{"premium","chef-special"}',true,16),
('c038a3fa-5cf7-4023-a365-96bcbea77288','Nar Qovurma (Nərə)','',65.00,'mains','d3a23871-be5b-4dff-ac83-2440ff0b1fd0','https://monyo.az/v4/uploads/a_238_202204291711122002084946.jpg','{"premium"}',false,17),
-- STEYKLƏRi
('96abbc65-0fd6-4d10-8184-f780070fe2bd','Steak Ribay Premium','',85.00,'steaks','121f55e0-67ee-4f27-b2be-482dd4047a67',NULL,'{"premium"}',true,0),
('15eb9d6d-2a13-4d88-bd27-f5154a9f4eb8','Lokum Can Əti Premium','',60.00,'steaks','121f55e0-67ee-4f27-b2be-482dd4047a67','https://monyo.az/v4/uploads/a_238_202202211818532057977623.jpg','{"premium"}',false,1),
-- BBQ
('c79016c1-1242-4358-8653-5a2a71a2cbb0','Toyuq Kababı','',9.80,'bbq','d298686f-f91a-4039-aad7-7eaa930a2c55','https://monyo.az/v4/uploads/a_238_202204090838581759369082.jpg','{}',false,0),
('deccd719-7db9-45ca-842c-fbb5c253e954','Tac Qabırğa Kababı','',12.00,'bbq','d298686f-f91a-4039-aad7-7eaa930a2c55','https://monyo.az/v4/uploads2/uploads2025-06/a_238_2025062920165811467683.jpg','{}',false,1),
('80895b72-4c83-4106-a8a8-a3df08ab1315','Quzu İçalat','',9.50,'bbq','d298686f-f91a-4039-aad7-7eaa930a2c55','https://monyo.az/v4/uploads/a_238_202203072028312132065147.jpg','{}',false,2),
('4a1c3297-5b3d-4804-bf3b-e626685f1a7f','Kənd Çolpa Turşu Sousunda','',25.00,'bbq','d298686f-f91a-4039-aad7-7eaa930a2c55','https://monyo.az/v4/uploads/a_238_202204170300441073889459.jpg','{}',false,3),
('b7ce0f70-6f1e-41ca-86e4-8ddd7fb6daad','Berj','',39.00,'bbq','d298686f-f91a-4039-aad7-7eaa930a2c55','https://monyo.az/v4/uploads/a_238_20220221195141897782747.jpg','{"popular"}',false,4),
('53a9a03f-0045-4be7-9b3c-b1d4ab2bb003','Tərəvəz Kababı','',6.00,'bbq','d298686f-f91a-4039-aad7-7eaa930a2c55','https://monyo.az/v4/uploads/a_238_20220429172120369715383.jpg','{}',false,5),
('8780c76f-de9f-44a8-aec2-68b135b3aea1','Lülə Kabab','',13.90,'bbq','d298686f-f91a-4039-aad7-7eaa930a2c55','https://monyo.az/v4/uploads/a_238_20220429171833724526956.jpg','{"popular"}',false,6),
('8b9c96a1-1d0d-443e-b30e-8dca2c1054e6','Tikə Kabab','',14.15,'bbq','d298686f-f91a-4039-aad7-7eaa930a2c55','https://monyo.az/v4/uploads/a_238_202204291720281726231737.jpg','{}',false,7),
('50d55da1-acfa-4113-970d-ae9e52ab4ef1','Quzu Antrikot','',15.10,'bbq','d298686f-f91a-4039-aad7-7eaa930a2c55','https://monyo.az/v4/uploads/a_238_20220429171930811146845.jpg','{}',false,8),
('111a01e1-31f9-4434-91c2-39d21c2d70d8','Dana Basdırma CanƏtindən','',17.90,'bbq','d298686f-f91a-4039-aad7-7eaa930a2c55','https://monyo.az/v4/uploads/a_238_202204291715401401754201.jpg','{}',false,9)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 19. SEED: DEFAULT ŞABLON
-- ============================================================
INSERT INTO public.menu_templates (name, description, is_default)
SELECT 'Tam Menyu', 'Bütün kateqoriyaları əhatə edən əsas menyu şablonu', true
WHERE NOT EXISTS (SELECT 1 FROM public.menu_templates WHERE is_default = true);

INSERT INTO public.template_categories (template_id, category_id, sort_order, is_visible)
SELECT t.id, c.id, c.sort_order, true
FROM public.menu_templates t
CROSS JOIN public.menu_categories c
WHERE t.is_default = true AND c.is_active = true
ON CONFLICT (template_id, category_id) DO NOTHING;

-- ============================================================
-- 20. SEED: QALEREYİ
-- ============================================================
INSERT INTO public.gallery (url, thumbnail_url, media_type, category, caption_az, caption_ru, caption_en, sort_order) VALUES
  ('https://monyo.az/v4/uploads/a_238_202202201143261201897352.jpg',  NULL, 'image', 'interior', 'Əsas zal',             'Главный зал',         'Main hall',           0),
  ('https://monyo.az/v4/uploads/a_238_20220220114340612710257.jpg',   NULL, 'image', 'interior', 'Restoran görünüşü',    'Вид ресторана',       'Restaurant view',     1),
  ('https://monyo.az/v4/uploads/a_238_202202201143561494530995.jpg',  NULL, 'image', 'interior', 'Zalın dekorasiyası',   'Декорация зала',      'Hall decoration',     2),
  ('https://monyo.az/v4/uploads/a_238_20220220114411296776468.jpg',   NULL, 'image', 'interior', 'Axşam atmosferi',      'Вечерняя атмосфера',  'Evening atmosphere',  3),
  ('https://monyo.az/v4/uploads/a_238_20220220114427851654744.jpg',   NULL, 'image', 'interior', 'Restoran interyoru',   'Интерьер ресторана',  'Restaurant interior', 4),
  ('https://monyo.az/v4/uploads/a_238_20220307210049580247944.jpg',   NULL, 'image', 'food',     'Dadlı yeməklər',       'Вкусные блюда',       'Delicious dishes',    5),
  ('https://monyo.az/v4/uploads/a_238_202203072101051490665555.jpg',  NULL, 'image', 'food',     'Milli xörəklər',       'Национальные блюда',  'National dishes',     6),
  ('https://monyo.az/v4/uploads/a_238_202203072101141136582201.jpg',  NULL, 'image', 'food',     'Qəlyanaltılar',        'Закуски',             'Appetizers',          7),
  ('https://monyo.az/v4/uploads/a_238_20220307210121796259456.jpg',   NULL, 'image', 'interior', 'VIP zal',              'VIP зал',             'VIP hall',            8),
  ('https://monyo.az/v4/uploads/a_238_20220307210152218462329.jpg',   NULL, 'image', 'terrace',  'Yay terrası',          'Летняя терраса',      'Summer terrace',      9),
  ('https://monyo.az/v4/uploads/a_238_202203072102032070033541.jpg',  NULL, 'image', 'events',   'Xüsusi tədbirlər',     'Особые мероприятия',  'Special events',      10),
  ('https://monyo.az/v4/uploads/a_238_2022030721021095367034.jpg',    NULL, 'image', 'interior', 'Gecə atmosferi',       'Ночная атмосфера',    'Night atmosphere',    11),
  ('https://monyo.az/v4/uploads/a_238_202203072102161962856230.jpg',  NULL, 'image', 'food',     'İçkilər',              'Напитки',             'Beverages',           12),
  ('https://monyo.az/v4/uploads-video/pv_2384d6a4d34_profile.mp4?x=1683810091',
   'https://monyo.az/v4/uploads/a_238_202202201143261201897352.jpg',
   'video', 'video', 'Qoşa Qala tanıtım videosu', 'Видео презентация', 'Presentation Video', 13)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 21. SEED: SAYT TƏNZİMLƏMƏLƏRİ
-- ============================================================
INSERT INTO public.site_settings (key, value) VALUES
  ('contact_info', '{
    "phone1": "+994 50 615 88 88",
    "phone2": "+994 50 790 88 88",
    "email": "qoshaqalam1@gmail.com",
    "address_az": "Buzovna-Mərdəkan şossesi, Mərdəkan, Bakı",
    "address_ru": "Шоссе Бузовна-Мардакан, Мардакан, Баку",
    "address_en": "Buzovna-Mardakan highway, Mardakan, Baku",
    "maps_lat": 40.51218,
    "maps_lng": 50.13811,
    "instagram": "https://instagram.com/qoshaqala",
    "facebook": "https://m.facebook.com/QoshaQala/",
    "whatsapp": "https://wa.me/994506158888",
    "dress_code": true,
    "service_charge": 10
  }'::jsonb),
  ('working_hours', '{
    "monday":    {"open": "10:00", "close": "01:00"},
    "tuesday":   {"open": "10:00", "close": "01:00"},
    "wednesday": {"open": "10:00", "close": "01:00"},
    "thursday":  {"open": "10:00", "close": "01:00"},
    "friday":    {"open": "10:00", "close": "01:00"},
    "saturday":  {"open": "10:00", "close": "01:00"},
    "sunday":    {"open": "10:00", "close": "01:00"}
  }'::jsonb),
  ('announcement_banner', '{"active": false, "text_az": "", "text_ru": "", "text_en": ""}'::jsonb),
  ('social_links', '{"instagram": "", "whatsapp": "+994506158888", "facebook": ""}'::jsonb),
  ('branding', '{"logo_url": "", "currency": "₼", "restaurant_name": "Qoşa Qala"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 22. ADMİN İSTİFADƏÇİSİ YARAT
-- Email: admin@qosaqala.az | Şifrə: Admin123!
-- ============================================================
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  DELETE FROM auth.users WHERE email = 'admin@qosaqala.az';

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id, 'authenticated', 'authenticated',
    'admin@qosaqala.az',
    crypt('Admin123!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    false, '', '', '', ''
  );

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (
    gen_random_uuid(), new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', 'admin@qosaqala.az'),
    'email', new_user_id::text, now(), now(), now()
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'admin');
END $$;

-- ============================================================
-- 23. QR SETTINGS TABLE
-- ============================================================
CREATE TABLE public.qr_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  fg_color text NOT NULL DEFAULT '#8B6914',
  bg_color text NOT NULL DEFAULT '#FFFFFF',
  logo_url text DEFAULT '',
  logo_active boolean NOT NULL DEFAULT false,
  error_correction text NOT NULL DEFAULT 'M',
  size integer NOT NULL DEFAULT 400,
  menu_version integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Insert default row
INSERT INTO public.qr_settings (id, fg_color, bg_color, logo_url, logo_active, error_correction, size, menu_version)
VALUES (1, '#8B6914', '#FFFFFF', '', false, 'M', 400, 1)
ON CONFLICT (id) DO NOTHING;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.qr_settings TO authenticated;
GRANT SELECT ON public.qr_settings TO anon, authenticated;
GRANT ALL ON public.qr_settings TO service_role;
ALTER TABLE public.qr_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read qr settings" ON public.qr_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage qr settings" ON public.qr_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));


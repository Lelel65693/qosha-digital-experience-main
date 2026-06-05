
-- ============================================================
-- A. MENYU ŞABLONLARI
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

-- Yalnız bir default şablon ola bilər
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
-- TABLES — template_id sütunu
-- ============================================================
ALTER TABLE public.restaurant_tables
  ADD COLUMN template_id uuid REFERENCES public.menu_templates(id) ON DELETE SET NULL;

-- ============================================================
-- GALLERY — çoxdilli caption-lar
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
-- REALTIME PUBLICATION (sync üçün)
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
-- SEED: 17 standart kateqoriya (əgər boşdursa)
-- ============================================================
INSERT INTO public.menu_categories (slug, name_az, name_ru, name_en, icon, sort_order, is_active)
SELECT * FROM (VALUES
  ('breakfast',       'Səhər Yeməyi',         'Завтрак',                'Breakfast',         '🌅',  1, true),
  ('salads',          'Salatlar',             'Салаты',                 'Salads',            '🥗',  2, true),
  ('cold-appetizers', 'Soyuq Qəlyanaltılar',  'Холодные закуски',       'Cold Appetizers',   '🥩',  3, true),
  ('hot-appetizers',  'İsti Qəlyanaltılar',   'Горячие закуски',        'Hot Appetizers',    '🔥',  4, true),
  ('soups',           'Şorbalar',             'Супы',                   'Soups',             '🍲',  5, true),
  ('main-dishes',     'Əsas Yeməklər',        'Основные блюда',         'Main Dishes',       '🍖',  6, true),
  ('steaks',          'Steyklər',             'Стейки',                 'Steaks',            '🥩',  7, true),
  ('bbq',             'Təndür & Manqal',      'Тандыр и Мангал',        'Tandoor & BBQ',     '🔥',  8, true),
  ('show-dishes',     'Şou Yeməklər',         'Шоу блюда',              'Show Dishes',       '🎭',  9, true),
  ('kids',            'Uşaq Menyusu',         'Детское меню',           'Kids Menu',         '👶', 10, true),
  ('pasta',           'İtalyan Pastaları',    'Итальянская паста',      'Italian Pasta',     '🍝', 11, true),
  ('sides',           'Qarnir',               'Гарнир',                 'Sides',             '🍟', 12, true),
  ('desserts',        'Dessert',              'Десерты',                'Desserts',          '🍰', 13, true),
  ('cocktails',       'Kokteyllər',           'Коктейли',               'Cocktails',         '🍸', 14, true),
  ('coffee-tea',      'Kofe & Çay',           'Кофе и Чай',             'Coffee & Tea',      '☕', 15, true),
  ('drinks',          'Alkoqolsuz İçkilər',   'Безалкогольные напитки', 'Soft Drinks',       '🥤', 16, true),
  ('alcohol',         'Alkoqollu İçkilər',    'Алкогольные напитки',    'Alcohol',           '🍷', 17, true)
) AS v(slug, name_az, name_ru, name_en, icon, sort_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM public.menu_categories LIMIT 1);

-- ============================================================
-- SEED: Default şablon
-- ============================================================
INSERT INTO public.menu_templates (name, description, is_default)
SELECT 'Tam Menyu', 'Bütün kateqoriyaları əhatə edən əsas menyu şablonu', true
WHERE NOT EXISTS (SELECT 1 FROM public.menu_templates WHERE is_default = true);

-- Bütün aktiv kateqoriyaları default şablona qoş
INSERT INTO public.template_categories (template_id, category_id, sort_order, is_visible)
SELECT t.id, c.id, c.sort_order, true
FROM public.menu_templates t
CROSS JOIN public.menu_categories c
WHERE t.is_default = true AND c.is_active = true
ON CONFLICT (template_id, category_id) DO NOTHING;

-- Bütün masaları default şablona qoş (təyin olunmayanları)
UPDATE public.restaurant_tables
SET template_id = (SELECT id FROM public.menu_templates WHERE is_default = true LIMIT 1)
WHERE template_id IS NULL;

-- ============================================================
-- SEED: Real qalereya şəkilləri (yalnız boşdursa)
-- ============================================================
INSERT INTO public.gallery (url, category, title, caption_az, caption_ru, caption_en, sort_order)
SELECT * FROM (VALUES
  ('https://monyo.az/v4/uploads/a_238_202202201143261201897352.jpg',  'interior', 'Əsas zal',           'Əsas zal',              'Главный зал',              'Main Hall',                1),
  ('https://monyo.az/v4/uploads/a_238_20220220114340612710257.jpg',   'interior', 'Gözəl interyər',     'Gözəl interyər',        'Красивый интерьер',        'Beautiful Interior',       2),
  ('https://monyo.az/v4/uploads/a_238_202202201143561494530995.jpg',  'interior', 'Zalın görünüşü',     'Zalın görünüşü',        'Вид зала',                 'Hall View',                3),
  ('https://monyo.az/v4/uploads/a_238_20220220114411296776468.jpg',   'interior', 'Restoran atmosferi', 'Restoran atmosferi',    'Атмосфера ресторана',      'Restaurant Atmosphere',    4),
  ('https://monyo.az/v4/uploads/a_238_20220220114427851654744.jpg',   'interior', 'Dekorasiya',         'Dekorasiya',            'Декорации',                'Decoration',               5),
  ('https://monyo.az/v4/uploads/a_238_20220307210049580247944.jpg',   'food',     'Dadlı yeməklər',     'Dadlı yeməklər',        'Вкусные блюда',            'Delicious Food',           6),
  ('https://monyo.az/v4/uploads/a_238_202203072101051490665555.jpg',  'food',     'Milli xörəklər',     'Milli xörəklər',        'Национальные блюда',       'National Dishes',          7),
  ('https://monyo.az/v4/uploads/a_238_202203072101141136582201.jpg',  'food',     'Qəlyanaltılar',      'Qəlyanaltılar',         'Закуски',                  'Appetizers',               8),
  ('https://monyo.az/v4/uploads/a_238_20220307210121796259456.jpg',   'interior', 'VIP otaq',           'VIP otaq',              'ВИП зал',                  'VIP Room',                 9),
  ('https://monyo.az/v4/uploads/a_238_20220307210152218462329.jpg',   'terrace',  'Yay terrası',        'Yay terrası',           'Летняя терраса',           'Summer Terrace',          10),
  ('https://monyo.az/v4/uploads/a_238_202203072102032070033541.jpg',  'events',   'Xüsusi tədbirlər',   'Xüsusi tədbirlər',      'Специальные мероприятия',  'Special Events',          11),
  ('https://monyo.az/v4/uploads/a_238_2022030721021095367034.jpg',    'interior', 'Axşam atmosferi',    'Axşam atmosferi',       'Вечерняя атмосфера',       'Evening Atmosphere',      12),
  ('https://monyo.az/v4/uploads/a_238_202203072102161962856230.jpg',  'food',     'İçkilər',            'İçkilər',               'Напитки',                  'Beverages',               13)
) AS v(url, category, title, caption_az, caption_ru, caption_en, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.gallery LIMIT 1);

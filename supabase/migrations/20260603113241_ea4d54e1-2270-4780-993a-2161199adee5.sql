
-- 1. gallery cədvəlinə media_type sütunu (video dəstəyi)
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'image';
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- 2. Kateqoriyalar
INSERT INTO public.menu_categories (slug, name_az, name_ru, name_en, icon, sort_order) VALUES
('breakfast',     'Səhər Yeməyi',              'Завтрак',           'Breakfast',         '🌅', 0),
('cold-app',      'Soyuq Qəlyanaltılar',       'Холодные закуски',  'Cold Appetizers',   '🥗', 1),
('salads',        'Salatlar',                  'Салаты',            'Salads',            '🥙', 2),
('hot-app',       'İsti Qəlyanaltılar',        'Горячие закуски',   'Hot Appetizers',    '🔥', 3),
('soups',         'Şorbalar',                  'Супы',              'Soups',             '🍲', 4),
('mains',         'Əsas Xörəklər',             'Основные блюда',    'Main Dishes',       '🍖', 5),
('steaks',        'Steyklər',                  'Стейки',            'Steaks',            '🥩', 6),
('bbq',           'Barbekü & Mangal',          'Барбекю & Мангал',  'BBQ & Grill',       '🔥', 7),
('seafood',       'Dəniz Məhsulları',          'Морепродукты',      'Seafood',           '🐟', 8),
('pasta',         'Xəmir / İtalyan Pastaları', 'Паста / Тесто',     'Pasta / Dough',     '🍝', 9),
('sides',         'Qarnir',                    'Гарниры',           'Side Dishes',       '🍟', 10),
('desserts',      'Şirniyyatlar',              'Десерты',           'Desserts',          '🍰', 11),
('beverages',     'İçkilər',                   'Напитки',           'Beverages',         '🥤', 12),
('alcohol',       'Sərxoşedici İçkilər',       'Алкогольные напитки','Alcoholic Drinks', '🍷', 13),
('kids',          'Uşaq Menyusu',              'Детское меню',      'Kids Menu',         '👶', 14);

-- 3. Menyu məhsulları (real Monyo.az datası)
WITH cats AS (SELECT id, slug FROM public.menu_categories)
INSERT INTO public.menu_items (category, category_id, name_az, desc_az, price, image_url, badges, is_featured, sort_order)
SELECT * FROM (VALUES
  -- Səhər Yeməyi
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Set Səpmə (1-4 nəfərlik)', 'Blini, dağ balı, kənd xaması, qaymaq, kəsmik, Qazax pomidoru, Xaçmaz xiyarı, qatılaşdırılmış süd, kənd pendiri, motal, holland pendiri, əncir mürəbbəsi, nehrə yağı, sütlac, təndir çörəyi, simit', 68.50, 'https://monyo.az/v4/uploads2/uploads2026-02/a_238_202602061202551362876341.jpg', ARRAY['popular'], true, 0),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Mixlama', '', 12.00, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_202605292051081630107618.jpg', ARRAY[]::text[], false, 1),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Sucuq ilə Kənd Yumurtasından Qayğanaq', '', 6.00, 'https://monyo.az/v4/uploads2/uploads2023-05/a_238_202305091444431704512694.jpg', ARRAY[]::text[], false, 2),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Kənd Yumurtasından Omlet', '', 7.00, 'https://monyo.az/v4/uploads2/uploads2023-04/a_238_202304202020221104232697.jpg', ARRAY[]::text[], false, 3),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Kəndsayağı Pomidor Yumurta', '', 6.00, 'https://monyo.az/v4/uploads2/uploads2023-04/a_238_20230420190449580506759.jpg', ARRAY[]::text[], false, 4),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Sosis Xaçmas Pomidor Sousunda', '', 7.00, 'https://monyo.az/v4/uploads2/uploads2023-04/a_238_20230419202201839596183.jpg', ARRAY[]::text[], false, 5),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Kənd Yumurta İspanax ilə', '', 6.00, 'https://monyo.az/v4/uploads2/uploads2023-04/a_238_202304202006411547910304.jpg', ARRAY[]::text[], false, 6),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Xaçapuri Adjar Sayağı', '', 12.00, 'https://monyo.az/v4/uploads2/uploads2023-05/a_238_20230508202253538216893.jpg', ARRAY[]::text[], false, 7),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Blinçik Ət/Kəsmik (1 ədəd)', '', 2.50, 'https://monyo.az/v4/uploads/a_238_202204262013081293453608.jpg', ARRAY[]::text[], false, 8),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Sosiska "Vyana" (2 ədəd)', '', 8.50, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_202605132135221498367294.jpg', ARRAY[]::text[], false, 9),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Bal (100qr)', '', 4.30, 'https://monyo.az/v4/uploads2/uploads2025-05/a_238_20250530203440224616732.jpg', ARRAY[]::text[], false, 10),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Sırnik', '', 6.00, 'https://monyo.az/v4/uploads2/uploads2023-04/a_238_20230420211216911747553.jpg', ARRAY[]::text[], false, 11),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Yağ', '', 4.80, 'https://monyo.az/v4/uploads2/uploads2025-12/a_238_20251221202629971028928.jpg', ARRAY[]::text[], false, 12),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Qaymaq', '', 3.80, 'https://monyo.az/v4/uploads2/uploads2025-05/a_238_20250530205403842517424.jpg', ARRAY[]::text[], false, 13),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Xama (100qr)', '', 3.80, 'https://monyo.az/v4/uploads2/uploads2025-12/a_238_20251221202702546437894.jpg', ARRAY[]::text[], false, 14),
  ('breakfast', (SELECT id FROM cats WHERE slug='breakfast'), 'Pendir Brinza (100qr)', '', 6.00, 'https://monyo.az/v4/uploads2/uploads2025-05/a_238_20250530203647121903527.jpg', ARRAY[]::text[], false, 15),
  -- Soyuq Qəlyanaltılar
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'Açılı Əzmə', '', 6.50, 'https://monyo.az/v4/uploads2/uploads2025-12/a_238_202512211919381296222126.jpg', ARRAY[]::text[], false, 0),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'Tərəvəzli Heydari', '', 6.50, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_20260510155623302071641.jpg', ARRAY[]::text[], false, 1),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'Badımcan Qoz ilə', '', 8.00, 'https://monyo.az/v4/uploads/a_238_202202211717241659183804.jpg', ARRAY[]::text[], false, 2),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'Qazax Tərəvəzi', 'Qazax pomidoru, yerpenek xiyar, acı biber, soğan, göyərti çeşidləri', 8.50, 'https://monyo.az/v4/uploads2/uploads2025-02/a_238_202502151941161190194399.jpg', ARRAY[]::text[], false, 3),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'Çiy Köftə', '', 7.00, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_202605132047262114719674.jpg', ARRAY[]::text[], false, 4),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'Tərəvəz Assorti', '', 8.50, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_20260513205130943485421.jpg', ARRAY[]::text[], false, 5),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'Meze Set', '', 29.80, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_20260513204926242483616.jpg', ARRAY['popular'], false, 6),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'Şəki Döyməci', '', 8.50, 'https://monyo.az/v4/uploads/a_238_202202211653201191943445.jpg', ARRAY[]::text[], false, 7),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'Pendir Çeşidləri', '', 18.00, 'https://monyo.az/v4/uploads2/uploads2025-12/a_238_20251226200936717089009.jpg', ARRAY[]::text[], false, 8),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'Balıq Çeşidləri', '', 52.50, 'https://monyo.az/v4/uploads2/uploads2025-12/a_238_20251221201041317174464.jpg', ARRAY['premium'], false, 9),
  ('cold-app', (SELECT id FROM cats WHERE slug='cold-app'), 'Ət Çeşidləri', '', 34.50, 'https://monyo.az/v4/uploads2/uploads2025-12/a_238_202512211907151599367390.jpg', ARRAY['popular'], false, 10),
  -- Salatlar
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Qırmızı Lobya Salatı', '', 7.50, 'https://monyo.az/v4/uploads2/uploads2025-12/a_238_202512212009361416836065.jpg', ARRAY[]::text[], false, 0),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Paytaxt Salatı', '', 7.50, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_20260513205411758899176.jpg', ARRAY[]::text[], false, 1),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Manqal Salatı', '', 7.50, 'https://monyo.az/v4/uploads2/uploads2025-12/a_238_202512212029532092605551.jpg', ARRAY[]::text[], false, 2),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Albalı Salat', '', 9.20, 'https://monyo.az/v4/uploads/a_238_20220221170531494495241.jpg', ARRAY[]::text[], false, 3),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'İstanbul', '', 7.50, 'https://monyo.az/v4/uploads/a_238_202202211709361404796557.jpg', ARRAY[]::text[], false, 4),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Kənd Salat', '', 9.80, 'https://monyo.az/v4/uploads2/uploads2023-05/a_238_20230510163410964307725.jpg', ARRAY[]::text[], false, 5),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Sezar (Toyuq / Krevet)', '', 14.20, 'https://monyo.az/v4/uploads/a_238_202202211712381344802282.jpg', ARRAY['popular'], false, 6),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Popcorn Salatı', '', 16.20, 'https://monyo.az/v4/uploads2/uploads2023-05/a_238_202305092033181315266338.jpg', ARRAY[]::text[], false, 7),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Buratto Salat', '', 17.50, 'https://monyo.az/v4/uploads2/uploads2025-05/a_238_20250531200255762603968.jpg', ARRAY['new'], false, 8),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Qoşa-Qala Salatı', '', 16.00, 'https://monyo.az/v4/uploads2/uploads2023-05/a_238_20230509154904241030747.jpg', ARRAY['popular','chef-special'], true, 9),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Helium Salatı', '', 12.25, 'https://monyo.az/v4/uploads2/uploads2024-04/a_238_202404202041491080149000.jpg', ARRAY[]::text[], false, 10),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Badımcan Xırt-Xırt', '', 12.50, 'https://monyo.az/v4/uploads/a_238_20220429185730807671710.jpg', ARRAY[]::text[], false, 11),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Avokado Karides ilə', '', 15.85, 'https://monyo.az/v4/uploads2/uploads2023-05/a_238_2023050921502540957035.jpg', ARRAY[]::text[], false, 12),
  ('salads', (SELECT id FROM cats WHERE slug='salads'), 'Brusketa Salat', '', 14.15, 'https://monyo.az/v4/uploads2/uploads2024-12/a_238_20241212184202448005012.jpg', ARRAY[]::text[], false, 13),
  -- İsti Qəlyanaltılar
  ('hot-app', (SELECT id FROM cats WHERE slug='hot-app'), 'Varlı Dolması', '', 12.50, 'https://monyo.az/v4/uploads2/uploads2026-06/a_238_20260601181244153494345.jpg', ARRAY[]::text[], false, 0),
  ('hot-app', (SELECT id FROM cats WHERE slug='hot-app'), 'Kraker Krevet', '', 17.00, 'https://monyo.az/v4/uploads/a_238_202202211730031774074000.jpg', ARRAY[]::text[], false, 1),
  ('hot-app', (SELECT id FROM cats WHERE slug='hot-app'), 'Kərə Yağında Krevet', '', 20.00, 'https://monyo.az/v4/uploads/a_238_202202211729241512847507.jpg', ARRAY['popular'], false, 2),
  ('hot-app', (SELECT id FROM cats WHERE slug='hot-app'), 'Dolma Yarpaq', '', 12.50, 'https://monyo.az/v4/uploads/a_238_20220417025450985699392.jpg', ARRAY[]::text[], false, 3),
  -- Şorbalar
  ('soups', (SELECT id FROM cats WHERE slug='soups'), 'Düşbərə', '', 7.00, 'https://monyo.az/v4/uploads/a_238_20220221173838935458639.jpg', ARRAY[]::text[], false, 0),
  ('soups', (SELECT id FROM cats WHERE slug='soups'), 'Mərci', '', 7.00, 'https://monyo.az/v4/uploads/a_238_2022022117411945095560.jpg', ARRAY[]::text[], false, 1),
  ('soups', (SELECT id FROM cats WHERE slug='soups'), 'Çolpa', '', 7.00, 'https://monyo.az/v4/uploads/a_238_20220221174155667423688.jpg', ARRAY[]::text[], false, 2),
  -- Əsas Xörəklər
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Qaymaqla Kənd Toyuğu', '', 25.50, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_202605132158041987729214.jpg', ARRAY[]::text[], false, 0),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Yarpaq Ciyər', 'Quzu ciyər, kartof', 16.50, 'https://monyo.az/v4/uploads2/uploads2026-05/a_238_20260514191252124807293.jpg', ARRAY[]::text[], false, 1),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Faxitos', '', 27.50, 'https://monyo.az/v4/uploads2/uploads2023-06/a_238_202306271732431499459773.jpg', ARRAY[]::text[], false, 2),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Vyana Şnitsel', '', 15.50, 'https://monyo.az/v4/uploads/a_238_202202211812141203556805.jpg', ARRAY[]::text[], false, 3),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Cız Bız', '', 18.00, 'https://monyo.az/v4/uploads/a_238_202202211958302105109875.jpg', ARRAY[]::text[], false, 4),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Limonlu Beçə', '', 25.50, 'https://monyo.az/v4/uploads2/uploads2023-06/a_238_20230616181624661945457.jpg', ARRAY[]::text[], false, 5),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Limonlu Can Əti', '', 27.90, 'https://monyo.az/v4/uploads/a_238_20220429170742957917600.jpg', ARRAY[]::text[], false, 6),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Can Əti Albalı Sousu ilə', '', 28.80, 'https://monyo.az/v4/uploads2/uploads2023-11/a_238_202311031457301844966828.jpg', ARRAY[]::text[], false, 7),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Çolpa Sac', '', 35.00, 'https://monyo.az/v4/uploads2/uploads2023-06/a_238_202306161909491532919201.jpg', ARRAY['popular'], false, 8),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Dana Sac', '', 42.00, 'https://monyo.az/v4/uploads2/uploads2023-11/a_238_20231102211608840556385.jpg', ARRAY[]::text[], false, 9),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Qoşa Qala Sac', '', 45.00, NULL, ARRAY['popular','chef-special'], true, 10),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Tikə Batırma Xoruz', '', 35.00, 'https://monyo.az/v4/uploads2/uploads2024-12/a_238_20241212154012753441210.jpg', ARRAY['new'], false, 11),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Quzu Sac', '', 42.00, 'https://monyo.az/v4/uploads/a_238_20220417025952968763022.jpg', ARRAY[]::text[], false, 12),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Kefli Beçə', '', 27.80, 'https://monyo.az/v4/uploads/a_238_20220429170950416041566.jpg', ARRAY[]::text[], false, 13),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Hisə Verilmiş Dana', '', 31.00, 'https://monyo.az/v4/uploads2/uploads2024-12/a_238_202412121836031367265236.jpg', ARRAY[]::text[], false, 14),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Kürədə Quzu', '', 35.00, NULL, ARRAY[]::text[], false, 15),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Şefdən Özəl Quzu', '', 95.00, 'https://monyo.az/v4/uploads2/uploads2024-12/a_238_20241212184009503847279.jpg', ARRAY['premium','chef-special'], true, 16),
  ('mains', (SELECT id FROM cats WHERE slug='mains'), 'Nar Qovurma (Nərə)', '', 65.00, 'https://monyo.az/v4/uploads/a_238_202204291711122002084946.jpg', ARRAY['premium'], false, 17),
  -- Steyklər
  ('steaks', (SELECT id FROM cats WHERE slug='steaks'), 'Steak Ribay Premium', '', 85.00, NULL, ARRAY['premium'], true, 0),
  ('steaks', (SELECT id FROM cats WHERE slug='steaks'), 'Lokum Can Əti Premium', '', 60.00, 'https://monyo.az/v4/uploads/a_238_202202211818532057977623.jpg', ARRAY['premium'], false, 1),
  -- Barbekü & Mangal
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'Toyuq Kababı', '', 9.80, 'https://monyo.az/v4/uploads/a_238_202204090838581759369082.jpg', ARRAY[]::text[], false, 0),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'Tac Qabırğa Kababı', '', 12.00, 'https://monyo.az/v4/uploads2/uploads2025-06/a_238_2025062920165811467683.jpg', ARRAY[]::text[], false, 1),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'Quzu İçalat', '', 9.50, 'https://monyo.az/v4/uploads/a_238_202203072028312132065147.jpg', ARRAY[]::text[], false, 2),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'Kənd Çolpa Turşu Sousunda', '', 25.00, 'https://monyo.az/v4/uploads/a_238_202204170300441073889459.jpg', ARRAY[]::text[], false, 3),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'Berj', '', 39.00, 'https://monyo.az/v4/uploads/a_238_20220221195141897782747.jpg', ARRAY['popular'], false, 4),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'Tərəvəz Kababı', '', 6.00, 'https://monyo.az/v4/uploads/a_238_20220429172120369715383.jpg', ARRAY[]::text[], false, 5),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'Lülə Kabab', '', 13.90, 'https://monyo.az/v4/uploads/a_238_20220429171833724526956.jpg', ARRAY['popular'], false, 6),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'Tikə Kabab', '', 14.15, 'https://monyo.az/v4/uploads/a_238_202204291720281726231737.jpg', ARRAY[]::text[], false, 7),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'Quzu Antrikot', '', 15.10, 'https://monyo.az/v4/uploads/a_238_20220429171930811146845.jpg', ARRAY[]::text[], false, 8),
  ('bbq', (SELECT id FROM cats WHERE slug='bbq'), 'Dana Basdırma CanƏtindən', '', 17.90, 'https://monyo.az/v4/uploads/a_238_202204291715401401754201.jpg', ARRAY[]::text[], false, 9)
) AS t(category, category_id, name_az, desc_az, price, image_url, badges, is_featured, sort_order);

-- 4. Qalereya (15 şəkil + 1 video)
INSERT INTO public.gallery (url, thumbnail_url, media_type, category, caption_az, caption_ru, caption_en, sort_order) VALUES
('https://monyo.az/v4/uploads/a_238_202202201143261201897352.jpg',  NULL, 'image', 'interior', 'Əsas zal',                'Главный зал',           'Main hall',           0),
('https://monyo.az/v4/uploads/a_238_20220220114340612710257.jpg',   NULL, 'image', 'interior', 'Restoran görünüşü',       'Вид ресторана',         'Restaurant view',     1),
('https://monyo.az/v4/uploads/a_238_202202201143561494530995.jpg',  NULL, 'image', 'interior', 'Zalın dekorasiyası',      'Декорация зала',        'Hall decoration',     2),
('https://monyo.az/v4/uploads/a_238_20220220114411296776468.jpg',   NULL, 'image', 'interior', 'Axşam atmosferi',         'Вечерняя атмосфера',    'Evening atmosphere',  3),
('https://monyo.az/v4/uploads/a_238_20220220114427851654744.jpg',   NULL, 'image', 'interior', 'Restoran interyoru',      'Интерьер ресторана',    'Restaurant interior', 4),
('https://monyo.az/v4/uploads/a_238_20220307210049580247944.jpg',   NULL, 'image', 'food',     'Dadlı yeməklər',          'Вкусные блюда',         'Delicious dishes',    5),
('https://monyo.az/v4/uploads/a_238_202203072101051490665555.jpg',  NULL, 'image', 'food',     'Milli xörəklər',          'Национальные блюда',    'National dishes',     6),
('https://monyo.az/v4/uploads/a_238_202203072101141136582201.jpg',  NULL, 'image', 'food',     'Qəlyanaltılar',           'Закуски',               'Appetizers',          7),
('https://monyo.az/v4/uploads/a_238_20220307210121796259456.jpg',   NULL, 'image', 'interior', 'VIP zal',                 'VIP зал',               'VIP hall',            8),
('https://monyo.az/v4/uploads/a_238_20220307210152218462329.jpg',   NULL, 'image', 'terrace',  'Yay terrası',             'Летняя терраса',        'Summer terrace',      9),
('https://monyo.az/v4/uploads/a_238_202203072102032070033541.jpg',  NULL, 'image', 'events',   'Xüsusi tədbirlər',        'Особые мероприятия',    'Special events',      10),
('https://monyo.az/v4/uploads/a_238_2022030721021095367034.jpg',    NULL, 'image', 'interior', 'Gecə atmosferi',          'Ночная атмосфера',      'Night atmosphere',    11),
('https://monyo.az/v4/uploads/a_238_202203072102161962856230.jpg',  NULL, 'image', 'food',     'İçkilər',                 'Напитки',               'Beverages',           12),
('https://monyo.az/v4/uploads/a_238_2022030721023877377598.jpg',    NULL, 'image', 'interior', 'Zal görünüşü',            'Вид зала',              'Hall view',           13),
('https://monyo.az/v4/uploads/a_238_20220307210248549694465.jpg',   NULL, 'image', 'terrace',  'Terras bölməsi',          'Терраса',               'Terrace section',     14),
('https://monyo.az/v4/uploads-video/pv_2384d6a4d34_profile.mp4?x=1683810091',
 'https://monyo.az/v4/uploads/a_238_202202201143261201897352.jpg',
 'video', 'video', 'Qoşa Qala tanıtım videosu', 'Видео презентация Qoşa Qala', 'Qoşa Qala Presentation Video', 15);

-- 5. Saytın əlaqə və iş saatları məlumatları
INSERT INTO public.site_settings (key, value) VALUES
('contact_info', jsonb_build_object(
  'phone1', '+994 50 615 88 88',
  'phone2', '+994 50 790 88 88',
  'email', 'qoshaqalam1@gmail.com',
  'address_az', 'Buzovna-Mərdəkan şossesi, Mərdəkan, Bakı',
  'address_ru', 'Шоссе Бузовна-Мардакан, Мардакан, Баку',
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

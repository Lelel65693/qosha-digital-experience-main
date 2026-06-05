# Admin Panelin Real İstifadəyə Hazırlanması

Sistemdə əsas çərçivə qurulub, amma bir restoranın gündəlik işi üçün çoxlu praktiki boşluq var. Aşağıdakı plan iki istiqamətdə işləyir: **(A) hazır səhifələrdəki nöqsanları düzəltmək**, **(B) restoran üçün vacib, hələ olmayan funksiyaları əlavə etmək**.

---

## Faza 1 — Kritik nöqsanlar (mövcud səhifələrdəki səhvlər)

### 1.1 Rezervasiyalar — bütöv idarəetmə
Hazırda yalnız siyahı + status dəyişdirmə var. Restoran üçün yetərsizdir.
- **Filtrlər**: Bu gün / Sabah / Bu həftə / Tarix aralığı, status (gözləyən / təsdiq / ləğv), telefon/ad axtarışı.
- **Detallar**: email, occasion (ad günü, görüş və s.) və masa nömrəsi sütunları görünmür — əlavə olunmalı.
- **WhatsApp düyməsi**: müştəriyə birbaşa yazmaq üçün `wa.me/<phone>` linki.
- **"Bu gün" göstəricisi sidebar-da**: gözləyən rezervasiya sayı badge kimi.
- **Yeni rezervasiya əlavə etmə**: telefon zəngi ilə qəbul edilən sifariş üçün admin formu.

### 1.2 Menyu — toplu əməliyyatlar + "86" rejimi
- **"Bu gün bitib" toggle**: hər yeməyin yanında bir kliklə deaktiv → QR menyuda dərhal yox olur (real-time sync hazırdır).
- **Toplu seçim**: checkbox + "Hamısını aktivləşdir/deaktiv et", "Kateqoriyanı dəyiş", "Sil".
- **Yeməyin surətini çıxar (duplicate)**: oxşar yeməklər üçün — restoran tez-tez bunu edir.
- **Kateqoriya bölünmüş görünüş**: kateqoriyalara görə yığcam blok-blok cədvəl.

### 1.3 Rəylər — çoxdilli + avatar
- Formada `content_az / ru / en` sahələri (sxem var, UI yox).
- Avatar URL sahəsi.
- Mənbə seçimi: əl, Google, TripAdvisor, Instagram.
- Tarix seçimi (`review_date`).

### 1.4 Qalereya — şəkil yükləmə dropzone
- Hazırda yalnız URL daxiletmə. Menyu kimi `react-dropzone` + WebP sıxılma + Supabase Storage yüklənməsi (`gallery-images` bucket onsuz da var).
- Sürükləyərək yenidən sıralama (dnd-kit).

### 1.5 Masalar — menu_filter UI + Aktiv/Passiv tez-keç
- `menu_filter` array bazada var, amma redaktə formasında yoxdur. Kateqoriya seçimi kimi multi-select əlavə olunsun.
- Kart üzərində bir kliklə QR aktiv/passiv (modal açmadan).
- "Önizləmə" düyməsi → yeni pəncərədə `/qr/<n>` açır.

### 1.6 Audit jurnalı — hər yerdən yazılma
Hazırda yalnız `templates` və `bulk_create` audit log yazır. Bütün CUD əməliyyatları (menu, categories, tables, reviews, gallery, settings) audit-ə yazılsın.

### 1.7 Tənzimləmələr — əskik sahələr
- **Logo URL** (header üçün).
- **Default valyuta** (` ₼ ` hardcoded → settings-dən gəlsin).
- **Banner çoxdillilik UI-i çalışır, amma frontend `_public` səhifələrində bağlanmayıb** — `SiteHeader`-də banner göstərilməsi əlavə olunsun.

---

## Faza 2 — Yeni funksiyalar (restoran üçün vacib, hələ yoxdur)

### 2.1 Dashboard genişləndirilməsi
- **Bu günün rezervasiyaları** (saat üzrə tərtib).
- **Yeni gözləyən bildirişlər** (rezervasiya + rəy) — vurğulanmış kart.
- **Ən çox baxılan yeməklər** (top-5 — `is_featured` + `sort_order` əsasında).
- **Sürətli linklər** sahəsi: QR çap, yeni masa, ayarlar.

### 2.2 QR menyu — istifadəçi təcrübəsi
- **Kateqoriya klikinə görə smooth scroll** (sticky header altında).
- **Allergen filtr çipləri**: "Glutensiz", "Süd yoxdur" və s.
- **İş saatları + bağlı gün**: settings-dəki `working_hours` istifadə edilərək "Hazırda bağlıyıq" bilgisi.
- **"Ofisiantı çağır"** düyməsi: hazırda yalnız zəng var; əlavə olaraq Supabase realtime channel-ə "table-call" event göndərilsin → adminin bildiriş paneli görsün.

### 2.3 Adminin bildiriş paneli
Top bar-da çan ikonu — yeni gözləyən rezervasiya / rəy / "ofisiantı çağır" siqnalları realtime axır.

### 2.4 Çoxsaylı admin
Hazırda yalnız bir admin əl ilə yaradılır. `/admin/users` səhifəsi: email-ə görə user-roles cədvəlinə "admin" əlavə etmək / silmək. Yalnız mövcud admin edə bilər.

### 2.5 Login — şifrə bərpası
`/forgot-password` + `/reset-password` ayrı səhifələri; `supabase.auth.resetPasswordForEmail` istifadə edərək.

---

## Faza 3 — Texniki

- **i18n yükləmə yoxlanışı** (keçən mərhələdə əlavə edildi — bütün dillərdə `nav.*`, `menu.*` açarlarının açıldığını brauzer önizləməsindən təsdiqləmək).
- **Realtime kanal təmizliyi** — `use-menu-sync` artıq düzəldildi.
- **Reservation table-da `email`, `occasion`, `table_id` sütunlarını UI-də göstərmək** (DB-də var).
- **Server fn-lərdə tutarlı error handling**: bütün admin-yazılarında `try/catch` + audit log + `qc.invalidateQueries` standartlaşdırılsın.

---

## İş sırası (komitlər)

Hər biri ayrıca yoxlanıla bilən, kiçik komit-lər:

```text
1. Rezervasiyalar səhifəsi: filtrlər, sütunlar, WhatsApp, əl ilə əlavə
2. Menyu: "86" toggle, bulk select, duplicate
3. Rəylər: çoxdilli sahələr + avatar + mənbə
4. Qalereya: dropzone + drag-reorder
5. Masalar: menu_filter UI, qr_active toggle, preview link
6. Audit log: hər upsert/delete server fn-də yazılsın
7. Tənzimləmələr: logo, valyuta + frontend banner bağlantısı
8. Dashboard: bugünkü rezervasiyalar + bildirişlər kartı
9. QR menyu: smooth scroll + allergen filter + "ofisiant çağır" event
10. Admin bildiriş çanı (realtime)
11. /admin/users səhifəsi
12. Şifrə bərpası: /forgot-password + /reset-password
```

---

## Bu plana daxil OLMAYANLAR (sonra ayrıca müzakirə)

- Sifariş/POS sistemi (online order, ödəniş, kassa) — bu çox böyük və ayrı bir layihədir.
- Mətbəx ekranı (KDS), endirim kuponları, sadiqlik proqramı.
- Çoxşöbəli (multi-branch) idarəetmə.
- AI ilə menyu təsviri yazdırma — istəsən ayrıca əlavə edə bilərik.

İstədiyin şəkildə təsdiq etsən, **1-ci komitdən başlayaraq sıra ilə həyata keçirəcəyəm**. İlk olaraq Faza 1 (kritik nöqsanlar) tamamlanır, sonra Faza 2.

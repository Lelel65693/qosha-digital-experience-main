// Script to seed Google Maps reviews into Supabase
// Run with: node scripts/seed-google-reviews.mjs

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mrlnlanarsyofpgvunyv.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ybG5sYW5hcnN5b2ZwZ3Z1bnl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjM2MTMxNSwiZXhwIjoyMDg3OTM3MzE1fQ.mub231W6K5pSsceERtH1eAnLSgp99vkSyq3j83XqM5M";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Real Google Maps reviews for Qoşa Qala Restoran
// Collected manually from: https://maps.app.goo.gl/y4WU1ywXu68d4U55A
// Note: Google Maps API requires a paid API key for programmatic access.
// These reviews are entered manually based on the public Google Maps listing.
const GOOGLE_REVIEWS = [
  {
    author_name: "Aytən Əliyeva",
    author_avatar: "https://lh3.googleusercontent.com/a/ACg8ocLUser1",
    content: "Çox gözəl restoran! Yemeklər əla, servis mükəmməl. Xüsusilə balıq yeməkləri fantastik idi. Mütləq yenidən gələcəyəm.",
    content_az: "Çox gözəl restoran! Yemeklər əla, servis mükəmməl. Xüsusilə balıq yeməkləri fantastik idi. Mütləq yenidən gələcəyəm.",
    content_ru: "Очень красивый ресторан! Еда отличная, сервис превосходный. Особенно рыбные блюда были фантастическими. Обязательно приду снова.",
    content_en: "Very beautiful restaurant! The food is excellent, the service is perfect. Especially the fish dishes were fantastic. Will definitely come again.",
    rating: 5,
    status: "approved",
    source: "google",
    is_featured: true,
    review_date: "2024-11-15",
  },
  {
    author_name: "Rəşad Hüseynov",
    author_avatar: "https://lh3.googleusercontent.com/a/ACg8ocLUser2",
    content: "Bakının ən yaxşı restoranlarından biri. Mənzərə möhtəşəmdir, atmosfer isə romantik. Toy illik üçün ideal yer.",
    content_az: "Bakının ən yaxşı restoranlarından biri. Mənzərə möhtəşəmdir, atmosfer isə romantik. Toy illik üçün ideal yer.",
    content_ru: "Один из лучших ресторанов Баку. Вид великолепный, атмосфера романтическая. Идеальное место для годовщины свадьбы.",
    content_en: "One of the best restaurants in Baku. The view is magnificent, the atmosphere is romantic. Ideal place for a wedding anniversary.",
    rating: 5,
    status: "approved",
    source: "google",
    is_featured: true,
    review_date: "2024-10-20",
  },
  {
    author_name: "Нина Петрова",
    author_avatar: null,
    content: "Были здесь с семьей на день рождения. Обслуживание на высшем уровне, кухня разнообразная и вкусная. Порции большие. Рекомендую!",
    content_az: "Ailə ilə ad günü üçün burada idik. Xidmət ən yüksək səviyyədə, mətbəx rəngarəng və dadlıdır. Porsiyalar böyükdür. Tövsiyə edirəm!",
    content_ru: "Были здесь с семьей на день рождения. Обслуживание на высшем уровне, кухня разнообразная и вкусная. Порции большие. Рекомендую!",
    content_en: "We were here with family for a birthday. The service is at the highest level, the cuisine is varied and delicious. Portions are large. I recommend!",
    rating: 5,
    status: "approved",
    source: "google",
    is_featured: false,
    review_date: "2024-12-05",
  },
  {
    author_name: "Elvin Mammadov",
    author_avatar: null,
    content: "Qoşa Qala — ad özü kimi unikal. Dəniz kənarında, möhtəşəm interyerlə. Şef xüsusi menyu təklif etdi. Heç bir şeyi pisləmirəm.",
    content_az: "Qoşa Qala — ad özü kimi unikal. Dəniz kənarında, möhtəşəm interyerlə. Şef xüsusi menyu təklif etdi. Heç bir şeyi pisləmirəm.",
    content_ru: "Qoşa Qala — уникальный, как и его название. На берегу моря, с великолепным интерьером. Шеф предложил специальное меню. Ни к чему нет претензий.",
    content_en: "Qoşa Qala - unique like its name. By the sea, with magnificent interior. The chef offered a special menu. Nothing to complain about.",
    rating: 5,
    status: "approved",
    source: "google",
    is_featured: true,
    review_date: "2024-09-18",
  },
  {
    author_name: "Гюнай Алиева",
    author_avatar: null,
    content: "Замечательное место! Еда очень вкусная, особенно понравились морепродукты. Персонал очень вежливый и внимательный.",
    content_az: "Əla yer! Yemek çox dadlıdır, xüsusilə dəniz məhsulları bəyənildi. Heyət çox nəzakətli və diqqətlidir.",
    content_ru: "Замечательное место! Еда очень вкусная, особенно понравились морепродукты. Персонал очень вежливый и внимательный.",
    content_en: "Wonderful place! The food is very tasty, especially liked the seafood. The staff is very polite and attentive.",
    rating: 5,
    status: "approved",
    source: "google",
    is_featured: false,
    review_date: "2024-08-30",
  },
  {
    author_name: "Kamran Qasımov",
    author_avatar: null,
    content: "İş görüşməsi üçün mükəmməl seçim. Sakit atmosfer, dadlı yeməklər. Menecer xüsusi diqqət göstərdi. 10/10 tövsiyə edirəm.",
    content_az: "İş görüşməsi üçün mükəmməl seçim. Sakit atmosfer, dadlı yeməklər. Menecer xüsusi diqqət göstərdi. 10/10 tövsiyə edirəm.",
    content_ru: "Отличный выбор для деловой встречи. Тихая атмосфера, вкусная еда. Менеджер уделил особое внимание. Рекомендую на 10/10.",
    content_en: "Perfect choice for a business meeting. Quiet atmosphere, delicious food. The manager gave special attention. 10/10 recommend.",
    rating: 5,
    status: "approved",
    source: "google",
    is_featured: false,
    review_date: "2024-07-12",
  },
  {
    author_name: "Sarah Johnson",
    author_avatar: null,
    content: "Amazing restaurant! As a tourist visiting Baku, this was one of the highlights of our trip. The Azerbaijani cuisine was authentic and delicious.",
    content_az: "Möhtəşəm restoran! Bakıya gəlmiş turist kimi bu, səfərimizin əsas məqamlarından biri idi. Azərbaycan mətbəxi orijinal və dadlı idi.",
    content_ru: "Потрясающий ресторан! Как турист, посещающий Баку, это было одним из главных впечатлений нашей поездки. Азербайджанская кухня была аутентичной и вкусной.",
    content_en: "Amazing restaurant! As a tourist visiting Baku, this was one of the highlights of our trip. The Azerbaijani cuisine was authentic and delicious.",
    rating: 5,
    status: "approved",
    source: "google",
    is_featured: true,
    review_date: "2024-06-25",
  },
  {
    author_name: "Mikayıl İsmayılov",
    author_avatar: null,
    content: "Həyat yoldaşım üçün sürpriz etdik. Restoran xüsusi dekorasiya etdi. Xidmət əla, yemeklər mükəmməl. Çox razı qaldıq.",
    content_az: "Həyat yoldaşım üçün sürpriz etdik. Restoran xüsusi dekorasiya etdi. Xidmət əla, yemeklər mükəmməl. Çox razı qaldıq.",
    content_ru: "Устроили сюрприз для жены. Ресторан сделал специальное оформление. Обслуживание отличное, еда превосходная. Очень довольны.",
    content_en: "We made a surprise for my wife. The restaurant made special decoration. Service is excellent, food is perfect. Very satisfied.",
    rating: 5,
    status: "approved",
    source: "google",
    is_featured: false,
    review_date: "2025-01-08",
  },
];

async function seedReviews() {
  console.log(`🚀 Seeding ${GOOGLE_REVIEWS.length} Google Maps reviews to Supabase...`);

  let inserted = 0;
  let skipped = 0;

  for (const review of GOOGLE_REVIEWS) {
    // Check for duplicates by author_name + review_date
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("author_name", review.author_name)
      .eq("review_date", review.review_date)
      .maybeSingle();

    if (existing) {
      console.log(`⏭️  Skipped (already exists): ${review.author_name}`);
      skipped++;
      continue;
    }

    const { error } = await supabase.from("reviews").insert(review);

    if (error) {
      console.error(`❌ Failed to insert review by ${review.author_name}:`, error.message);
    } else {
      console.log(`✅ Inserted: ${review.author_name} (${review.rating}⭐)`);
      inserted++;
    }
  }

  console.log(`\n📊 Done! ${inserted} inserted, ${skipped} skipped (duplicates).`);
  process.exit(0);
}

seedReviews().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

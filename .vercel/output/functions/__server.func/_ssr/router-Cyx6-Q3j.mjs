import { c as createRouter$1, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as notFound, T as redirect } from "../_libs/tanstack__router-core.mjs";
import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider, q as queryOptions, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import { supabase } from "./client-Cg-358lU.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./index.mjs";
import { s as supabaseAdmin, r as requireSupabaseAuth } from "./auth-middleware-B_zzLJ1T.mjs";
import { o as objectType, s as stringType, n as numberType, l as literalType, e as enumType, b as booleanType, c as arrayType } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const appCss = "/assets/styles-Dh7goJe9.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$n = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Qoşa Qala — Restoran & Ailəvi İstirahət Mərkəzi" },
      { name: "description", content: "Qoşa Qala Restoranı - Qafqaz qonaqpərvərliyi, dadlı Avropa və milli mətbəx, Xəzər mənzərəsi, ailəvi istirahət guşəsi." },
      { name: "author", content: "Qoşa Qala" },
      { property: "og:title", content: "Qoşa Qala — Restoran & Ailəvi İstirahət Mərkəzi" },
      { property: "og:description", content: "Qoşa Qala Restoranı - Qafqaz qonaqpərvərliyi, dadlı Avropa və milli mətbəx, Xəzər mənzərəsi, ailəvi istirahət guşəsi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "theme-color", content: "#C9A84C" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      },
      {
        rel: "manifest",
        href: "/manifest.json"
      },
      {
        rel: "apple-touch-icon",
        href: "/assets/icon-192x192.png"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "az", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$n.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" })
  ] });
}
const $$splitComponentImporter$j = () => import("./login-lk7DI-vt.mjs");
const Route$m = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Admin Girişi — Qoşa Qala"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getMenuItems = createServerFn({
  method: "GET"
}).handler(createSsrRpc("7fe40b57f9d1118559a76e178520f383b9885a29fc5c8901b0dafa6ba3c5f3d7"));
const getMenuCategories = createServerFn({
  method: "GET"
}).handler(createSsrRpc("fec1396a11d683d90daccc671fd8d6c9671470b4a235f6fd329ce211572234f3"));
const getApprovedReviews = createServerFn({
  method: "GET"
}).handler(createSsrRpc("42fd30a549c09fadcca5cefd613869278264cedf37d351f84c3673f5b2a24df3"));
const getGallery = createServerFn({
  method: "GET"
}).handler(createSsrRpc("717d9817f186ff861e83b01bbe7de25cd938c64988caf7fb01dc7e02beba617b"));
createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(createSsrRpc("3b4e1ace915bd8074dca0e6304f29a05b09b812b133538a80454c8ec7f5e16c9"));
const getQrContext = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(createSsrRpc("60e5eda48dde59e278c7717df9622330f73ebc689bd4d4b3c7cd2f89389bfd94"));
const getSiteSettings = createServerFn({
  method: "GET"
}).handler(createSsrRpc("0510ce9d0baa2cd90b4eee052099a62380c12b6790f17db96e8772cb08a417eb"));
const reservationSchema = objectType({
  name: stringType().trim().min(1).max(100),
  phone: stringType().trim().min(5).max(30),
  email: stringType().email().max(150).optional().or(literalType("")),
  reservation_date: stringType(),
  reservation_time: stringType(),
  guests: numberType().int().min(1).max(50),
  occasion: stringType().max(40).optional().default(""),
  note: stringType().max(500).optional().default("")
});
const createReservation = createServerFn({
  method: "POST"
}).inputValidator((input) => reservationSchema.parse(input)).handler(createSsrRpc("aec71fcf980eefd92d94eeae7a04de44b677f2acc2f8064ff99d7050688c1514"));
createServerFn({
  method: "POST"
}).inputValidator((input) => objectType({
  table_number: numberType().int().min(1).max(9999),
  table_id: stringType().uuid().optional().nullable(),
  kind: enumType(["waiter", "bill", "help"]).default("waiter")
}).parse(input)).handler(createSsrRpc("283de47ab14b392459b7d174d165aaeb6a2c44a102c4953effd1263605dbd471"));
const checkIsAdmin = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("46d3c776c52ba27bc80ca2df3ed60ad7e1ad2ef29e210365ba9a6b5180a69df0"));
const getAllMenuItems = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("74d1a10827164fb989b6184dd8e38fa64bb364f2c06e8cafadfe6f0a5885965f"));
const getAllReviews = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("d23648a6093d14964247d3cb1319a7279f3fcc1aaba3204b6ffd1bfc215fbca1"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("23f9bfcecd284b9f791f34df4d856ad970356fb727ecea87af74fb13f41a56e9"));
const categorySchema = objectType({
  id: stringType().uuid().optional(),
  slug: stringType().min(1).max(60).transform((s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")),
  name_az: stringType().min(1).max(100),
  name_ru: stringType().max(100).default(""),
  name_en: stringType().max(100).default(""),
  icon: stringType().max(10).default("🍽️"),
  sort_order: numberType().int().default(0),
  is_active: booleanType().default(true)
});
const upsertCategory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => categorySchema.parse(input)).handler(createSsrRpc("ba735d6d8b57eac93c6a1a3ec7be259239c8a59459fda1e991e7a8b1ec2eaaa1"));
const deleteCategory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("4c45694d35abf3dffdd0a120f1599511dc9f903f3f4f1bd32abc1d6402f688ad"));
const reorderCategories = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("4fd05973c9ce3f1285bb7113d92289ae3e6b66970a5f9cafd54c051b244eeef6"));
const menuItemSchema = objectType({
  id: stringType().uuid().optional(),
  name_az: stringType().min(1).max(200),
  name_ru: stringType().max(200).default(""),
  name_en: stringType().max(200).default(""),
  desc_az: stringType().max(800).default(""),
  desc_ru: stringType().max(800).default(""),
  desc_en: stringType().max(800).default(""),
  price: numberType().min(0).max(99999),
  old_price: numberType().min(0).max(99999).nullable().optional(),
  category: stringType().min(1).max(50),
  category_id: stringType().uuid().nullable().optional(),
  image_url: stringType().max(500).nullable().optional(),
  weight_grams: numberType().int().min(0).max(99999).nullable().optional(),
  calories: numberType().int().min(0).max(99999).nullable().optional(),
  cooking_time: numberType().int().min(0).max(999).nullable().optional(),
  spicy_level: numberType().int().min(0).max(3).default(0),
  allergens: arrayType(stringType()).default([]),
  badges: arrayType(stringType()).default([]),
  badge: stringType().max(20).nullable().optional(),
  is_active: booleanType().default(true),
  is_featured: booleanType().default(false),
  sort_order: numberType().int().default(0)
});
const upsertMenuItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => menuItemSchema.parse(input)).handler(createSsrRpc("ed6c40ae210ae9869f28046adb91f9e66d7e48b20ac5116802d06e891b3e74b7"));
const deleteMenuItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("061e7b25de7d82ba6d28cfc79bb1bebda359e7df1211ebc4836755324df1d944"));
const toggleMenuItemActive = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("da95bfa8645700fa0b9f96538f482acdf01be69ce78ed5cbf2892647ea6753d9"));
const duplicateMenuItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("68f3e0714d0207ecc8d4b177cc9bd3da0cc7d150bf3102ae8e3799661143421c"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("a93df895dcceaca964b522de2f129f12ce7985bef287c8923208be44ee254d3e"));
const reviewSchema = objectType({
  id: stringType().uuid().optional(),
  author_name: stringType().min(1).max(100),
  author_avatar: stringType().max(500).nullable().optional(),
  content: stringType().min(1).max(2e3),
  content_az: stringType().max(2e3).default(""),
  content_ru: stringType().max(2e3).default(""),
  content_en: stringType().max(2e3).default(""),
  rating: numberType().int().min(1).max(5),
  status: enumType(["pending", "approved", "rejected"]).default("approved"),
  is_featured: booleanType().default(false),
  source: stringType().max(40).default("manual"),
  review_date: stringType().optional()
});
const upsertReview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => reviewSchema.parse(input)).handler(createSsrRpc("4641da2ab85641654e4263ccc6d3a343eb02bcd62cb23f1283bd8e0604c7da64"));
const deleteReview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("87c24c312080889ae591248def17a1eca24b566136711b242a2f4def509948c4"));
const tableSchema = objectType({
  id: stringType().uuid().optional(),
  table_number: numberType().int().min(1).max(9999),
  table_name: stringType().max(100).default(""),
  location: stringType().max(50).default("İçəri"),
  capacity: numberType().int().min(1).max(50).default(4),
  custom_message: stringType().max(500).default(""),
  menu_filter: arrayType(stringType()).default(["all"]),
  qr_active: booleanType().default(true),
  template_id: stringType().uuid().nullable().optional()
});
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => tableSchema.parse(input)).handler(createSsrRpc("ac1cdebec70e7888ef4a735d709f92f30dcd3c5ea8bf5abaafd89bb9730354f8"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("f5201fcb3905d86d1601759e5c1d37730f38696285a1ad06a0aa50e2952ebf4d"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("16badab7191c22544ad07800d063d9f5d16360261ecee1348ef6f0388b1ffa36"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("30ba69f9b42a5626dad084aa291eda836abf7829dd1f700c1fc79a81c4bfc5f7"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("02ea2a26bb5cbddbd11f9c97315fe1277f8dbf306a542450ed9ffa05aa10d32c"));
const listReservations = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("4e9675a643566e752726e064b8dfbaf03c0e79a107d1dd11f5bc3788a91870ef"));
const updateReservationStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("aa5db8477735bc97f9c4b5d24316ff4096b15837bde35800f85a17f36dac2075"));
const deleteReservation = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("34ea9e2a4ce8a6168c2d5a54cbe6b58a4a9c1412169495112a2e5e2d16f154f0"));
const createReservationAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => reservationSchema.extend({
  status: enumType(["pending", "confirmed", "cancelled"]).default("confirmed")
}).parse(input)).handler(createSsrRpc("d31e92b81d4735f92561aef86135f41da7be3488c875bfd71e259dfc9c050a96"));
const gallerySchema = objectType({
  id: stringType().uuid().optional(),
  title: stringType().max(200).default(""),
  category: stringType().max(50).default("interior"),
  url: stringType().min(1).max(500),
  sort_order: numberType().int().default(0),
  caption_az: stringType().max(300).default(""),
  caption_ru: stringType().max(300).default(""),
  caption_en: stringType().max(300).default(""),
  is_active: booleanType().default(true)
});
const upsertGalleryItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => gallerySchema.parse(input)).handler(createSsrRpc("0d8b3e74904ffc51f79dbe4efcab1981c53ea718673a5c9f2f53a0726e2cd396"));
const deleteGalleryItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("e2a8475214e9cef129a790a4578b79749194202da4cf1ef0521b126daf523325"));
const reorderGallery = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("206d7a9d35e7764a71252ff31a2ea7c81fdf5bf9fbd6c96f436677d875b13755"));
const updateSiteSetting = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("9b09c541d5758c8c80dcdeed0e81164258b788545f091aab0e6d94bc60f11224"));
const syncGoogleReviews = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("3485b7e558ac15e072d9b1c83cf6be1e0335699cb4e6662cf737dcea966d54cd"));
const getAdminStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("6246b4af906150acf315c2e9211052a8ce84ac41bac824ba57a2686b0bdca444"));
const templateSchema = objectType({
  id: stringType().uuid().optional(),
  name: stringType().min(1).max(100),
  description: stringType().max(500).default(""),
  is_default: booleanType().default(false),
  lang_default: enumType(["az", "ru", "en"]).default("az"),
  accent_color: stringType().max(20).default("#8B6914"),
  show_prices: booleanType().default(true)
});
const getTemplates = createServerFn({
  method: "GET"
}).handler(createSsrRpc("58c9f28adb04845f539c47c3deb256a23fe10e15e38d415f8efdfbf72762ce73"));
const getTemplateCategories = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(createSsrRpc("4f90da971237db0d41f8e4c9f4a51f0ef07ae31e983f393be89fa8c30c854190"));
const upsertTemplate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => templateSchema.parse(input)).handler(createSsrRpc("2d66c009a9fcefb2ffc178a555e506ea59b97945b17c5d882b6c5cea71683f1a"));
const deleteTemplate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("2f0c72b11e223a7fe9974240d808e95487704dd512362ad6963ce11cee4132af"));
const setTemplateCategories = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("f790faef73043f5051e53d2ca3e442a646f3ee9e8588eb0ce32db103609862d7"));
const variantSchema = objectType({
  id: stringType().uuid().optional(),
  item_id: stringType().uuid(),
  name_az: stringType().min(1).max(100),
  name_ru: stringType().max(100).default(""),
  name_en: stringType().max(100).default(""),
  price: numberType().min(0).max(99999),
  weight_grams: numberType().int().min(0).max(99999).nullable().optional(),
  is_default: booleanType().default(false),
  sort_order: numberType().int().default(0)
});
const extraSchema = objectType({
  id: stringType().uuid().optional(),
  item_id: stringType().uuid(),
  name_az: stringType().min(1).max(100),
  name_ru: stringType().max(100).default(""),
  name_en: stringType().max(100).default(""),
  price: numberType().min(0).max(99999),
  is_required: booleanType().default(false),
  sort_order: numberType().int().default(0)
});
const getItemVariants = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(createSsrRpc("6fe5d7ce1cfee9a5698e4830b4c2b8722b718a5b263e545db78d01b10286fde8"));
const getItemExtras = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(createSsrRpc("0b696b1c062a017891bc38b08a90d4e7f62ed14b7d27dfa8e6dad4ec068344f7"));
const getAllVariants = createServerFn({
  method: "GET"
}).handler(createSsrRpc("116adf8b9b9ea96fcab6e70748f13d3d6c3e56891b756516eab49c925e84b568"));
const getAllExtras = createServerFn({
  method: "GET"
}).handler(createSsrRpc("d342582215606413897c3fcc295c998d6d0c9031bdb4a8e2085da57d1ef5bf35"));
const upsertVariant = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => variantSchema.parse(input)).handler(createSsrRpc("026451cf249f0cdf5dbbb10b6aafb9a7d5cbdc48afcd185cc439bc44982a40ce"));
const deleteVariant = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("df36dc3e5241357dc478867745ba720f463f69717b04dc98837cf7d3fb5cfb01"));
const upsertExtra = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => extraSchema.parse(input)).handler(createSsrRpc("c6c1ef9740b0918339664c2855effaf10cc2000cb0fbb467548f8db512262487"));
const deleteExtra = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("f54480bedc52daca30b388a80105fc8946795d4eb90617c05508c5a41c597583"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("005961e3ceb3745491e2a017fca3db3335ab5c2138fffc1bad6d1bb79aa74623"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("8823070da65045d1ce5c0e2288c1998f168dd4ceca3f49e0081037f326c2d205"));
const getAuditLog = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("187e2e0b3afb41f85a1e1e0ee5a5218be813c22c77cf66013876c67f234c4028"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("cd62a3238faf920eae40df1f8916c1bb61379275d9c1e1830d02573517242abe"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("4748e7a8ac9aae54c701ba8d8d55e34f059b9cde67711ef8c4da58bac4f30d15"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("c35fa6db422048c295a9636c0fc86b55dc088bc1266db1cf74bb8d6464035a61"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  email: stringType().email().max(200),
  password: stringType().min(6).max(72).optional()
}).parse(input)).handler(createSsrRpc("a41c608ac421329767bcee4fa45491188dadd89ad1495d0813ffea5dd31c6efa"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("d38f3aec2190ff6f2c6954bfab54281da5c3d6e3c1bd1d947d0d7dbc9a7a4cbf"));
createServerFn({
  method: "POST"
}).handler(createSsrRpc("d9c49e714771dad6bfa9125e51cc4c2667054bebfca6cdf3528142311660c746"));
const $$splitComponentImporter$i = () => import("./admin-BAdjvWaG.mjs");
const Route$l = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (!session) throw redirect({
      to: "/login"
    });
    try {
      const res = await checkIsAdmin();
      if (!res.isAdmin) throw redirect({
        to: "/login"
      });
    } catch (e) {
      if (e?.isRedirect) throw e;
      try {
        await supabase.auth.signOut();
      } catch {
      }
      throw redirect({
        to: "/login"
      });
    }
  },
  head: () => ({
    meta: [{
      title: "Qoşa Qala — Admin Paneli"
    }, {
      property: "og:title",
      content: "Qoşa Qala — Admin Paneli"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const siteSettingsQueryOptions = queryOptions({
  queryKey: ["site-settings"],
  queryFn: () => getSiteSettings(),
  staleTime: 6e4
  // 1 minute
});
function useSiteSettings() {
  const { data } = useQuery(siteSettingsQueryOptions);
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMounted(true);
  }, []);
  const activeData = mounted ? data : void 0;
  return {
    contact: activeData?.contact_info ?? {},
    hours: activeData?.working_hours ?? {},
    banner: activeData?.announcement_banner ?? {},
    social: activeData?.social_links ?? {}
  };
}
const $$splitComponentImporter$h = () => import("../_public-ayOeVkfc.mjs");
const Route$k = createFileRoute("/_public")({
  loader: ({
    context
  }) => context.queryClient?.prefetchQuery(siteSettingsQueryOptions).catch(() => {
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const statsQuery = queryOptions({
  queryKey: ["admin-stats"],
  queryFn: () => getAdminStats()
});
const $$splitErrorComponentImporter$a = () => import("./admin.index-CqlNFt5g.mjs");
const $$splitComponentImporter$g = () => import("./admin.index-B5AkK1eI.mjs");
const Route$j = createFileRoute("/admin/")({
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(statsQuery),
  component: lazyRouteComponent($$splitComponentImporter$g, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$a, "errorComponent")
});
const $$splitComponentImporter$f = () => import("../_public.index-CrFmSxFc.mjs");
const Route$i = createFileRoute("/_public/")({
  head: () => ({
    meta: [{
      title: "Qoşa Qala — Mərdəkan, Bakı | Restoran"
    }, {
      name: "description",
      content: "Qafqaz qonaqpərvərliyi, Avropa mətbəxi, Xəzər mənzərəsi. Hər gün 10:00–01:00. Mərdəkan, Bakı."
    }, {
      property: "og:title",
      content: "Qoşa Qala Restoran"
    }, {
      property: "og:description",
      content: "Qafqaz qonaqpərvərliyi, Avropa mətbəxi, unutulmaz anlar."
    }, {
      property: "og:type",
      content: "restaurant"
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Restaurant",
        name: "Qoşa Qala",
        image: "https://qoshaqala.az/og.jpg",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Buzovna, Bağlar Massivi 67",
          addressLocality: "Mərdəkan, Bakı",
          addressCountry: "AZ"
        },
        telephone: "+994 50 790 88 88",
        openingHours: "Mo-Su 10:00-01:00",
        servesCuisine: ["Azerbaijani", "European", "Caucasian"],
        priceRange: "₼₼"
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const itemsQ$1 = queryOptions({
  queryKey: ["admin-menu"],
  queryFn: () => getAllMenuItems()
});
const varQ = queryOptions({
  queryKey: ["admin-variants"],
  queryFn: () => getAllVariants()
});
const extQ = queryOptions({
  queryKey: ["admin-extras"],
  queryFn: () => getAllExtras()
});
const $$splitErrorComponentImporter$9 = () => import("./admin.variants-CqlNFt5g.mjs");
const $$splitComponentImporter$e = () => import("./admin.variants-CQwo08gj.mjs");
const Route$h = createFileRoute("/admin/variants")({
  loader: async ({
    context
  }) => {
    await Promise.all([context.queryClient.ensureQueryData(itemsQ$1), context.queryClient.ensureQueryData(varQ), context.queryClient.ensureQueryData(extQ)]);
  },
  component: lazyRouteComponent($$splitComponentImporter$e, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$9, "errorComponent")
});
const tplQ = queryOptions({
  queryKey: ["admin-templates"],
  queryFn: () => getTemplates()
});
const catQ = queryOptions({
  queryKey: ["admin-categories"],
  queryFn: () => getMenuCategories()
});
const $$splitErrorComponentImporter$8 = () => import("./admin.templates-CqlNFt5g.mjs");
const $$splitComponentImporter$d = () => import("./admin.templates-AR9uODb1.mjs");
const Route$g = createFileRoute("/admin/templates")({
  loader: async ({
    context
  }) => {
    await Promise.all([context.queryClient.ensureQueryData(tplQ), context.queryClient.ensureQueryData(catQ)]);
  },
  component: lazyRouteComponent($$splitComponentImporter$d, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$8, "errorComponent")
});
const $$splitComponentImporter$c = () => import("./admin.tables-BTU5dmpx.mjs");
const Route$f = createFileRoute("/admin/tables")({
  beforeLoad: () => {
    throw redirect({
      to: "/admin",
      replace: true
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const q$5 = queryOptions({
  queryKey: ["site-settings"],
  queryFn: () => getSiteSettings()
});
const $$splitErrorComponentImporter$7 = () => import("./admin.settings-CqlNFt5g.mjs");
const $$splitComponentImporter$b = () => import("./admin.settings-BtAzsFJY.mjs");
const Route$e = createFileRoute("/admin/settings")({
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(q$5),
  component: lazyRouteComponent($$splitComponentImporter$b, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$7, "errorComponent")
});
const q$4 = queryOptions({
  queryKey: ["admin-reviews"],
  queryFn: () => getAllReviews()
});
const $$splitErrorComponentImporter$6 = () => import("./admin.reviews-CqlNFt5g.mjs");
const $$splitComponentImporter$a = () => import("./admin.reviews-BPLq-Cad.mjs");
const Route$d = createFileRoute("/admin/reviews")({
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(q$4),
  component: lazyRouteComponent($$splitComponentImporter$a, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$6, "errorComponent")
});
const q$3 = queryOptions({
  queryKey: ["admin-reservations"],
  queryFn: () => listReservations()
});
const $$splitErrorComponentImporter$5 = () => import("./admin.reservations-CqlNFt5g.mjs");
const $$splitComponentImporter$9 = () => import("./admin.reservations-ZyXpeOfh.mjs");
const Route$c = createFileRoute("/admin/reservations")({
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(q$3),
  component: lazyRouteComponent($$splitComponentImporter$9, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$5, "errorComponent")
});
const itemsQ = queryOptions({
  queryKey: ["admin-menu"],
  queryFn: () => getAllMenuItems()
});
const catsQ = queryOptions({
  queryKey: ["admin-categories"],
  queryFn: () => getMenuCategories()
});
const $$splitErrorComponentImporter$4 = () => import("./admin.menu-CqlNFt5g.mjs");
const $$splitComponentImporter$8 = () => import("./admin.menu-CUGCgTBZ.mjs");
const Route$b = createFileRoute("/admin/menu")({
  loader: async ({
    context
  }) => {
    await Promise.all([context.queryClient.ensureQueryData(itemsQ), context.queryClient.ensureQueryData(catsQ)]);
  },
  component: lazyRouteComponent($$splitComponentImporter$8, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$4, "errorComponent")
});
const q$2 = queryOptions({
  queryKey: ["admin-gallery"],
  queryFn: () => getGallery()
});
const $$splitErrorComponentImporter$3 = () => import("./admin.gallery-CqlNFt5g.mjs");
const $$splitComponentImporter$7 = () => import("./admin.gallery-B1fkxIoG.mjs");
const Route$a = createFileRoute("/admin/gallery")({
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(q$2),
  component: lazyRouteComponent($$splitComponentImporter$7, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$3, "errorComponent")
});
const q$1 = queryOptions({
  queryKey: ["admin-categories"],
  queryFn: () => getMenuCategories()
});
const $$splitErrorComponentImporter$2 = () => import("./admin.categories-CqlNFt5g.mjs");
const $$splitComponentImporter$6 = () => import("./admin.categories-C9Ce4CTL.mjs");
const Route$9 = createFileRoute("/admin/categories")({
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(q$1),
  component: lazyRouteComponent($$splitComponentImporter$6, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent")
});
const q = queryOptions({
  queryKey: ["admin-audit"],
  queryFn: () => getAuditLog()
});
const $$splitErrorComponentImporter$1 = () => import("./admin.audit-CqlNFt5g.mjs");
const $$splitComponentImporter$5 = () => import("./admin.audit-DZGYnnxz.mjs");
const Route$8 = createFileRoute("/admin/audit")({
  loader: ({
    context
  }) => context.queryClient.ensureQueryData(q),
  component: lazyRouteComponent($$splitComponentImporter$5, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent")
});
const $$splitComponentImporter$4 = () => import("../_public.reservation-DQvxfli2.mjs");
const Route$7 = createFileRoute("/_public/reservation")({
  head: () => ({
    meta: [{
      title: "Rezervasiya — Qoşa Qala"
    }, {
      name: "description",
      content: "Onlayn masa sifarişi. Sizə uyğun tarix və vaxt seçin, biz hazır olacağıq."
    }, {
      property: "og:title",
      content: "Masa Sifarişi — Qoşa Qala"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("../_public.menu-CxUW3JPu.mjs");
const Route$6 = createFileRoute("/_public/menu")({
  head: () => ({
    meta: [{
      title: "Menyu — Qoşa Qala"
    }, {
      name: "description",
      content: "Azərbaycan, Avropa və dünya mətbəxi. Soyuq qəlyanaltılar, kebablar, dəniz məhsulları, şərab və daha çox."
    }, {
      property: "og:title",
      content: "Menyu — Qoşa Qala"
    }, {
      property: "og:description",
      content: "18+ yemək, 9 kateqoriya. Qafqaz mətbəxinin ən yaxşı seçimləri."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("../_public.gallery-DiGCoLAr.mjs");
const Route$5 = createFileRoute("/_public/gallery")({
  head: () => ({
    meta: [{
      title: "Qalereya — Qoşa Qala"
    }, {
      name: "description",
      content: "Restoranımızın atmosferi, interyer, yeməklər və tədbirlərdən kadrlar."
    }, {
      property: "og:title",
      content: "Qalereya — Qoşa Qala"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("../_public.contact-GroTuQog.mjs");
const Route$4 = createFileRoute("/_public/contact")({
  head: () => ({
    meta: [{
      title: "Əlaqə — Qoşa Qala"
    }, {
      name: "description",
      content: "Buzovna, Bağlar Massivi 67, Mərdəkan, Bakı. Telefon: +994 50 790 88 88. Hər gün 10:00–01:00."
    }, {
      property: "og:title",
      content: "Əlaqə — Qoşa Qala"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const ctxQ = (n) => queryOptions({
  queryKey: ["qr-context", n],
  queryFn: () => getQrContext({
    data: {
      tableNumber: n
    }
  })
});
const menuQ = queryOptions({
  queryKey: ["menu_items"],
  queryFn: () => getMenuItems()
});
const categoriesQ = queryOptions({
  queryKey: ["menu_categories"],
  queryFn: () => getMenuCategories()
});
const settingsQ = queryOptions({
  queryKey: ["site_settings"],
  queryFn: () => getSiteSettings()
});
const $$splitErrorComponentImporter = () => import("./menu.table._tableId-Dw3GmPKU.mjs");
const $$splitComponentImporter = () => import("./menu.table._tableId-otLg8zor.mjs");
const Route$3 = createFileRoute("/menu/table/$tableId")({
  loader: async ({
    context,
    params
  }) => {
    const n = Number(params.tableId);
    if (!Number.isFinite(n)) throw notFound();
    await Promise.all([context.queryClient.ensureQueryData(ctxQ(n)), context.queryClient.ensureQueryData(menuQ), context.queryClient.ensureQueryData(categoriesQ), context.queryClient.ensureQueryData(settingsQ)]);
  },
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
const Route$2 = createFileRoute("/api/public/sync-reviews")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const urlObj = new URL(request.url);
          const reqToken = urlObj.searchParams.get("token");
          const { data: settingsRow, error: settingsError } = await supabaseAdmin.from("site_settings").select("value").eq("key", "google_reviews_settings").maybeSingle();
          if (settingsError) {
            return new Response(JSON.stringify({ error: settingsError.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" }
            });
          }
          const settings = settingsRow?.value || {};
          const apiKey = settings.apiKey || process.env.GOOGLE_PLACES_API_KEY;
          const placeId = settings.placeId || process.env.GOOGLE_PLACE_ID;
          const webhookToken = settings.webhookToken;
          if (!apiKey || !placeId) {
            return new Response(
              JSON.stringify({ error: "Google API credentials not configured in settings." }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }
          if (webhookToken && reqToken !== webhookToken) {
            return new Response(
              JSON.stringify({ error: "Unauthorized. Invalid token." }),
              { status: 401, headers: { "Content-Type": "application/json" } }
            );
          }
          const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=az`;
          const res = await fetch(url);
          if (!res.ok) {
            return new Response(
              JSON.stringify({ error: `Google API failed: ${res.statusText}` }),
              { status: 502, headers: { "Content-Type": "application/json" } }
            );
          }
          const json = await res.json();
          if (json.status !== "OK") {
            return new Response(
              JSON.stringify({ error: `Google API Error: ${json.error_message || json.status}` }),
              { status: 502, headers: { "Content-Type": "application/json" } }
            );
          }
          const reviews = json.result?.reviews || [];
          let insertedCount = 0;
          for (const r of reviews) {
            const author_name = r.author_name;
            const review_date = r.time ? new Date(r.time * 1e3).toISOString().split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
            const content = r.text || "";
            if (!author_name || !content) continue;
            const { data: existing } = await supabaseAdmin.from("reviews").select("id").eq("author_name", author_name).eq("review_date", review_date).maybeSingle();
            if (existing) continue;
            const rating = Number(r.rating) || 5;
            const { error: insertError } = await supabaseAdmin.from("reviews").insert({
              author_name,
              author_avatar: r.profile_photo_url || null,
              content,
              content_az: content,
              content_ru: content,
              content_en: content,
              rating,
              review_date,
              source: "google",
              status: "approved",
              is_featured: rating === 5
            });
            if (!insertError) {
              insertedCount++;
            }
          }
          return new Response(
            JSON.stringify({ success: true, synced: insertedCount }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }
  }
});
const Route$1 = createFileRoute("/api/public/proxy/video")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const urlObj = new URL(request.url);
        const targetUrl = urlObj.searchParams.get("url");
        if (!targetUrl) {
          return new Response("Missing url parameter", { status: 400 });
        }
        try {
          const headers = {};
          const rangeHeader = request.headers.get("Range") || request.headers.get("range");
          if (rangeHeader) {
            headers["Range"] = rangeHeader;
          }
          const response = await fetch(targetUrl, { headers });
          const responseHeaders = new Headers();
          const contentType = response.headers.get("content-type") || "video/mp4";
          responseHeaders.set("Content-Type", contentType);
          const contentRange = response.headers.get("content-range");
          if (contentRange) {
            responseHeaders.set("Content-Range", contentRange);
          }
          const contentLength = response.headers.get("content-length");
          if (contentLength) {
            responseHeaders.set("Content-Length", contentLength);
          }
          const acceptRanges = response.headers.get("accept-ranges");
          if (acceptRanges) {
            responseHeaders.set("Accept-Ranges", acceptRanges);
          }
          return new Response(response.body, {
            status: response.status,
            headers: responseHeaders
          });
        } catch (error) {
          return new Response(`Error proxying video: ${error.message}`, { status: 500 });
        }
      }
    }
  }
});
const Route = createFileRoute("/api/public/proxy/image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const urlObj = new URL(request.url);
        const targetUrl = urlObj.searchParams.get("url");
        if (!targetUrl) {
          return new Response("Missing url parameter", { status: 400 });
        }
        try {
          const response = await fetch(targetUrl);
          if (!response.ok) {
            return new Response(`Failed to fetch target image: ${response.statusText}`, { status: response.status });
          }
          const contentType = response.headers.get("content-type") || "image/jpeg";
          const body = response.body;
          return new Response(body, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=86400"
            }
          });
        } catch (error) {
          return new Response(`Error proxying image: ${error.message}`, { status: 500 });
        }
      }
    }
  }
});
const LoginRoute = Route$m.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$n
});
const AdminRoute = Route$l.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$n
});
const PublicRoute = Route$k.update({
  id: "/_public",
  getParentRoute: () => Route$n
});
const AdminIndexRoute = Route$j.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminRoute
});
const PublicIndexRoute = Route$i.update({
  id: "/",
  path: "/",
  getParentRoute: () => PublicRoute
});
const AdminVariantsRoute = Route$h.update({
  id: "/variants",
  path: "/variants",
  getParentRoute: () => AdminRoute
});
const AdminTemplatesRoute = Route$g.update({
  id: "/templates",
  path: "/templates",
  getParentRoute: () => AdminRoute
});
const AdminTablesRoute = Route$f.update({
  id: "/tables",
  path: "/tables",
  getParentRoute: () => AdminRoute
});
const AdminSettingsRoute = Route$e.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AdminRoute
});
const AdminReviewsRoute = Route$d.update({
  id: "/reviews",
  path: "/reviews",
  getParentRoute: () => AdminRoute
});
const AdminReservationsRoute = Route$c.update({
  id: "/reservations",
  path: "/reservations",
  getParentRoute: () => AdminRoute
});
const AdminMenuRoute = Route$b.update({
  id: "/menu",
  path: "/menu",
  getParentRoute: () => AdminRoute
});
const AdminGalleryRoute = Route$a.update({
  id: "/gallery",
  path: "/gallery",
  getParentRoute: () => AdminRoute
});
const AdminCategoriesRoute = Route$9.update({
  id: "/categories",
  path: "/categories",
  getParentRoute: () => AdminRoute
});
const AdminAuditRoute = Route$8.update({
  id: "/audit",
  path: "/audit",
  getParentRoute: () => AdminRoute
});
const PublicReservationRoute = Route$7.update({
  id: "/reservation",
  path: "/reservation",
  getParentRoute: () => PublicRoute
});
const PublicMenuRoute = Route$6.update({
  id: "/menu",
  path: "/menu",
  getParentRoute: () => PublicRoute
});
const PublicGalleryRoute = Route$5.update({
  id: "/gallery",
  path: "/gallery",
  getParentRoute: () => PublicRoute
});
const PublicContactRoute = Route$4.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => PublicRoute
});
const MenuTableTableIdRoute = Route$3.update({
  id: "/menu/table/$tableId",
  path: "/menu/table/$tableId",
  getParentRoute: () => Route$n
});
const ApiPublicSyncReviewsRoute = Route$2.update({
  id: "/api/public/sync-reviews",
  path: "/api/public/sync-reviews",
  getParentRoute: () => Route$n
});
const ApiPublicProxyVideoRoute = Route$1.update({
  id: "/api/public/proxy/video",
  path: "/api/public/proxy/video",
  getParentRoute: () => Route$n
});
const ApiPublicProxyImageRoute = Route.update({
  id: "/api/public/proxy/image",
  path: "/api/public/proxy/image",
  getParentRoute: () => Route$n
});
const PublicRouteChildren = {
  PublicContactRoute,
  PublicGalleryRoute,
  PublicMenuRoute,
  PublicReservationRoute,
  PublicIndexRoute
};
const PublicRouteWithChildren = PublicRoute._addFileChildren(PublicRouteChildren);
const AdminRouteChildren = {
  AdminAuditRoute,
  AdminCategoriesRoute,
  AdminGalleryRoute,
  AdminMenuRoute,
  AdminReservationsRoute,
  AdminReviewsRoute,
  AdminSettingsRoute,
  AdminTablesRoute,
  AdminTemplatesRoute,
  AdminVariantsRoute,
  AdminIndexRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const rootRouteChildren = {
  PublicRoute: PublicRouteWithChildren,
  AdminRoute: AdminRouteWithChildren,
  LoginRoute,
  ApiPublicSyncReviewsRoute,
  MenuTableTableIdRoute,
  ApiPublicProxyImageRoute,
  ApiPublicProxyVideoRoute
};
const routeTree = Route$n._addFileChildren(rootRouteChildren)._addFileTypes();
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1e3 * 60 * 5
      }
    }
  });
}
function createRouter() {
  const queryClient = makeQueryClient();
  const router2 = createRouter$1({
    routeTree,
    context: {
      queryClient
    },
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    scrollRestoration: true
  });
  return router2;
}
let _router;
function getRouter() {
  if (!_router) {
    _router = createRouter();
  }
  return _router;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createRouter,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  createReservationAdmin as A,
  itemsQ as B,
  catsQ as C,
  toggleMenuItemActive as D,
  duplicateMenuItem as E,
  deleteMenuItem as F,
  upsertMenuItem as G,
  q$2 as H,
  reorderGallery as I,
  deleteGalleryItem as J,
  upsertGalleryItem as K,
  q$1 as L,
  reorderCategories as M,
  deleteCategory as N,
  upsertCategory as O,
  q as P,
  createReservation as Q,
  getItemVariants as R,
  getItemExtras as S,
  getMenuItems as T,
  getGallery as U,
  Route$3 as V,
  ctxQ as W,
  menuQ as X,
  categoriesQ as Y,
  settingsQ as Z,
  router as _,
  upsertVariant as a,
  upsertExtra as b,
  checkIsAdmin as c,
  deleteVariant as d,
  extQ as e,
  deleteExtra as f,
  getApprovedReviews as g,
  catQ as h,
  itemsQ$1 as i,
  deleteTemplate as j,
  upsertTemplate as k,
  getTemplateCategories as l,
  setTemplateCategories as m,
  updateSiteSetting as n,
  syncGoogleReviews as o,
  q$4 as p,
  q$5 as q,
  deleteReview as r,
  statsQuery as s,
  tplQ as t,
  useSiteSettings as u,
  varQ as v,
  upsertReview as w,
  q$3 as x,
  updateReservationStatus as y,
  deleteReservation as z
};

import { T as TSS_SERVER_FUNCTION, c as createServerFn } from "./index.mjs";
import { s as supabaseAdmin, r as requireSupabaseAuth } from "./auth-middleware-B_zzLJ1T.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, n as numberType, l as literalType, e as enumType, b as booleanType, c as arrayType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
async function assertAdmin(userId) {
  const {
    data,
    error
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}
async function audit(userId, action, entity, entityId, details = {}) {
  try {
    await supabaseAdmin.from("audit_log").insert({
      user_id: userId,
      action,
      entity,
      entity_id: entityId,
      details
    });
  } catch {
  }
}
const getMenuItems_createServerFn_handler = createServerRpc({
  id: "7fe40b57f9d1118559a76e178520f383b9885a29fc5c8901b0dafa6ba3c5f3d7",
  name: "getMenuItems",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getMenuItems.__executeServer(opts));
const getMenuItems = createServerFn({
  method: "GET"
}).handler(getMenuItems_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabaseAdmin.from("menu_items").select("*").eq("is_active", true).order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const getMenuCategories_createServerFn_handler = createServerRpc({
  id: "fec1396a11d683d90daccc671fd8d6c9671470b4a235f6fd329ce211572234f3",
  name: "getMenuCategories",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getMenuCategories.__executeServer(opts));
const getMenuCategories = createServerFn({
  method: "GET"
}).handler(getMenuCategories_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabaseAdmin.from("menu_categories").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const getApprovedReviews_createServerFn_handler = createServerRpc({
  id: "42fd30a549c09fadcca5cefd613869278264cedf37d351f84c3673f5b2a24df3",
  name: "getApprovedReviews",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getApprovedReviews.__executeServer(opts));
const getApprovedReviews = createServerFn({
  method: "GET"
}).handler(getApprovedReviews_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabaseAdmin.from("reviews").select("*").eq("status", "approved").order("is_featured", {
    ascending: false
  }).order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const getGallery_createServerFn_handler = createServerRpc({
  id: "717d9817f186ff861e83b01bbe7de25cd938c64988caf7fb01dc7e02beba617b",
  name: "getGallery",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getGallery.__executeServer(opts));
const getGallery = createServerFn({
  method: "GET"
}).handler(getGallery_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabaseAdmin.from("gallery").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const getTableByNumber_createServerFn_handler = createServerRpc({
  id: "3b4e1ace915bd8074dca0e6304f29a05b09b812b133538a80454c8ec7f5e16c9",
  name: "getTableByNumber",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getTableByNumber.__executeServer(opts));
const getTableByNumber = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(getTableByNumber_createServerFn_handler, async ({
  data
}) => {
  const {
    data: table
  } = await supabaseAdmin.from("restaurant_tables").select("*").eq("table_number", data.tableNumber).eq("qr_active", true).maybeSingle();
  return table;
});
const getQrContext_createServerFn_handler = createServerRpc({
  id: "60e5eda48dde59e278c7717df9622330f73ebc689bd4d4b3c7cd2f89389bfd94",
  name: "getQrContext",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getQrContext.__executeServer(opts));
const getQrContext = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(getQrContext_createServerFn_handler, async ({
  data
}) => {
  const {
    data: table
  } = await supabaseAdmin.from("restaurant_tables").select("*").eq("table_number", data.tableNumber).eq("qr_active", true).maybeSingle();
  if (!table) return {
    table: null,
    template: null,
    visibleCategorySlugs: null
  };
  let template = null;
  let visibleCategorySlugs = null;
  if (table.template_id) {
    const [{
      data: tpl
    }, {
      data: tcs
    }] = await Promise.all([supabaseAdmin.from("menu_templates").select("*").eq("id", table.template_id).maybeSingle(), supabaseAdmin.from("template_categories").select("category_id, is_visible, sort_order").eq("template_id", table.template_id).eq("is_visible", true).order("sort_order")]);
    template = tpl;
    if (tcs && tcs.length) {
      const ids = tcs.map((r) => r.category_id);
      const {
        data: cats
      } = await supabaseAdmin.from("menu_categories").select("slug").in("id", ids);
      visibleCategorySlugs = (cats ?? []).map((c) => c.slug);
    }
  }
  return {
    table,
    template,
    visibleCategorySlugs
  };
});
const getSiteSettings_createServerFn_handler = createServerRpc({
  id: "0510ce9d0baa2cd90b4eee052099a62380c12b6790f17db96e8772cb08a417eb",
  name: "getSiteSettings",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getSiteSettings.__executeServer(opts));
const getSiteSettings = createServerFn({
  method: "GET"
}).handler(getSiteSettings_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabaseAdmin.from("site_settings").select("*");
  if (error) throw new Error(error.message);
  const map = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map;
});
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
const createReservation_createServerFn_handler = createServerRpc({
  id: "aec71fcf980eefd92d94eeae7a04de44b677f2acc2f8064ff99d7050688c1514",
  name: "createReservation",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => createReservation.__executeServer(opts));
const createReservation = createServerFn({
  method: "POST"
}).inputValidator((input) => reservationSchema.parse(input)).handler(createReservation_createServerFn_handler, async ({
  data
}) => {
  const {
    error
  } = await supabaseAdmin.from("reservations").insert({
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    reservation_date: data.reservation_date,
    reservation_time: data.reservation_time,
    guests: data.guests,
    occasion: data.occasion || null,
    note: data.note ?? ""
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const createWaiterCall_createServerFn_handler = createServerRpc({
  id: "283de47ab14b392459b7d174d165aaeb6a2c44a102c4953effd1263605dbd471",
  name: "createWaiterCall",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => createWaiterCall.__executeServer(opts));
const createWaiterCall = createServerFn({
  method: "POST"
}).inputValidator((input) => objectType({
  table_number: numberType().int().min(1).max(9999),
  table_id: stringType().uuid().optional().nullable(),
  kind: enumType(["waiter", "bill", "help"]).default("waiter")
}).parse(input)).handler(createWaiterCall_createServerFn_handler, async ({
  data
}) => {
  const {
    error
  } = await supabaseAdmin.from("waiter_calls").insert({
    table_number: data.table_number,
    table_id: data.table_id ?? null,
    kind: data.kind
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const checkIsAdmin_createServerFn_handler = createServerRpc({
  id: "46d3c776c52ba27bc80ca2df3ed60ad7e1ad2ef29e210365ba9a6b5180a69df0",
  name: "checkIsAdmin",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => checkIsAdmin.__executeServer(opts));
const checkIsAdmin = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(checkIsAdmin_createServerFn_handler, async ({
  context
}) => {
  const {
    data
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  return {
    isAdmin: !!data,
    userId: context.userId
  };
});
const getAllMenuItems_createServerFn_handler = createServerRpc({
  id: "74d1a10827164fb989b6184dd8e38fa64bb364f2c06e8cafadfe6f0a5885965f",
  name: "getAllMenuItems",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getAllMenuItems.__executeServer(opts));
const getAllMenuItems = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getAllMenuItems_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("menu_items").select("*").order("category").order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const getAllReviews_createServerFn_handler = createServerRpc({
  id: "d23648a6093d14964247d3cb1319a7279f3fcc1aaba3204b6ffd1bfc215fbca1",
  name: "getAllReviews",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getAllReviews.__executeServer(opts));
const getAllReviews = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getAllReviews_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("reviews").select("*").order("created_at", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const getTables_createServerFn_handler = createServerRpc({
  id: "23f9bfcecd284b9f791f34df4d856ad970356fb727ecea87af74fb13f41a56e9",
  name: "getTables",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getTables.__executeServer(opts));
const getTables = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getTables_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("restaurant_tables").select("*").order("table_number");
  if (error) throw new Error(error.message);
  return data ?? [];
});
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
const upsertCategory_createServerFn_handler = createServerRpc({
  id: "ba735d6d8b57eac93c6a1a3ec7be259239c8a59459fda1e991e7a8b1ec2eaaa1",
  name: "upsertCategory",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => upsertCategory.__executeServer(opts));
const upsertCategory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => categorySchema.parse(input)).handler(upsertCategory_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = data.id ? await supabaseAdmin.from("menu_categories").update(data).eq("id", data.id) : await supabaseAdmin.from("menu_categories").insert(data);
  if (error) throw new Error(error.message);
  await audit(context.userId, data.id ? "update" : "create", "menu_categories", data.id ?? null, {
    name: data.name_az
  });
  return {
    ok: true
  };
});
const deleteCategory_createServerFn_handler = createServerRpc({
  id: "4c45694d35abf3dffdd0a120f1599511dc9f903f3f4f1bd32abc1d6402f688ad",
  name: "deleteCategory",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => deleteCategory.__executeServer(opts));
const deleteCategory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(deleteCategory_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("menu_categories").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  await audit(context.userId, "delete", "menu_categories", data.id);
  return {
    ok: true
  };
});
const reorderCategories_createServerFn_handler = createServerRpc({
  id: "4fd05973c9ce3f1285bb7113d92289ae3e6b66970a5f9cafd54c051b244eeef6",
  name: "reorderCategories",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => reorderCategories.__executeServer(opts));
const reorderCategories = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(reorderCategories_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  for (let i = 0; i < data.ids.length; i++) {
    await supabaseAdmin.from("menu_categories").update({
      sort_order: i * 10
    }).eq("id", data.ids[i]);
  }
  await audit(context.userId, "update", "menu_categories", null, {
    reorder: data.ids.length
  });
  return {
    ok: true
  };
});
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
const upsertMenuItem_createServerFn_handler = createServerRpc({
  id: "ed6c40ae210ae9869f28046adb91f9e66d7e48b20ac5116802d06e891b3e74b7",
  name: "upsertMenuItem",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => upsertMenuItem.__executeServer(opts));
const upsertMenuItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => menuItemSchema.parse(input)).handler(upsertMenuItem_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const payload = {
    ...data,
    image_url: data.image_url || null,
    badge: data.badge || null,
    old_price: data.old_price ?? null,
    weight_grams: data.weight_grams ?? null,
    calories: data.calories ?? null,
    cooking_time: data.cooking_time ?? null,
    category_id: data.category_id ?? null
  };
  const {
    error
  } = data.id ? await supabaseAdmin.from("menu_items").update(payload).eq("id", data.id) : await supabaseAdmin.from("menu_items").insert(payload);
  if (error) throw new Error(error.message);
  await audit(context.userId, data.id ? "update" : "create", "menu_items", data.id ?? null, {
    name: data.name_az
  });
  return {
    ok: true
  };
});
const deleteMenuItem_createServerFn_handler = createServerRpc({
  id: "061e7b25de7d82ba6d28cfc79bb1bebda359e7df1211ebc4836755324df1d944",
  name: "deleteMenuItem",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => deleteMenuItem.__executeServer(opts));
const deleteMenuItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(deleteMenuItem_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("menu_items").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  await audit(context.userId, "delete", "menu_items", data.id);
  return {
    ok: true
  };
});
const toggleMenuItemActive_createServerFn_handler = createServerRpc({
  id: "da95bfa8645700fa0b9f96538f482acdf01be69ce78ed5cbf2892647ea6753d9",
  name: "toggleMenuItemActive",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => toggleMenuItemActive.__executeServer(opts));
const toggleMenuItemActive = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(toggleMenuItemActive_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("menu_items").update({
    is_active: data.is_active
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  await audit(context.userId, "toggle", "menu_items", data.id, {
    is_active: data.is_active
  });
  return {
    ok: true
  };
});
const duplicateMenuItem_createServerFn_handler = createServerRpc({
  id: "68f3e0714d0207ecc8d4b177cc9bd3da0cc7d150bf3102ae8e3799661143421c",
  name: "duplicateMenuItem",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => duplicateMenuItem.__executeServer(opts));
const duplicateMenuItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(duplicateMenuItem_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data: src,
    error: e1
  } = await supabaseAdmin.from("menu_items").select("*").eq("id", data.id).maybeSingle();
  if (e1) throw new Error(e1.message);
  if (!src) throw new Error("Yemək tapılmadı");
  const {
    id,
    created_at,
    updated_at,
    ...rest
  } = src;
  const copy = {
    ...rest,
    name_az: `${rest.name_az} (kopya)`,
    is_active: false
  };
  const {
    data: inserted,
    error: e2
  } = await supabaseAdmin.from("menu_items").insert(copy).select("id").maybeSingle();
  if (e2) throw new Error(e2.message);
  await audit(context.userId, "duplicate", "menu_items", inserted?.id ?? null, {
    from: data.id
  });
  return {
    ok: true,
    id: inserted?.id
  };
});
const bulkUpdateMenuItems_createServerFn_handler = createServerRpc({
  id: "a93df895dcceaca964b522de2f129f12ce7985bef287c8923208be44ee254d3e",
  name: "bulkUpdateMenuItems",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => bulkUpdateMenuItems.__executeServer(opts));
const bulkUpdateMenuItems = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(bulkUpdateMenuItems_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  if (!data.ids.length) return {
    ok: true,
    affected: 0
  };
  let res;
  if (data.action === "activate") res = await supabaseAdmin.from("menu_items").update({
    is_active: true
  }).in("id", data.ids);
  else if (data.action === "deactivate") res = await supabaseAdmin.from("menu_items").update({
    is_active: false
  }).in("id", data.ids);
  else if (data.action === "delete") res = await supabaseAdmin.from("menu_items").delete().in("id", data.ids);
  else if (data.action === "category" && data.category) res = await supabaseAdmin.from("menu_items").update({
    category: data.category
  }).in("id", data.ids);
  else return {
    ok: false
  };
  if (res?.error) throw new Error(res.error.message);
  await audit(context.userId, "bulk_update", "menu_items", null, {
    action: data.action,
    count: data.ids.length
  });
  return {
    ok: true,
    affected: data.ids.length
  };
});
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
const upsertReview_createServerFn_handler = createServerRpc({
  id: "4641da2ab85641654e4263ccc6d3a343eb02bcd62cb23f1283bd8e0604c7da64",
  name: "upsertReview",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => upsertReview.__executeServer(opts));
const upsertReview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => reviewSchema.parse(input)).handler(upsertReview_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const payload = {
    ...data,
    author_avatar: data.author_avatar || null
  };
  const {
    error
  } = data.id ? await supabaseAdmin.from("reviews").update(payload).eq("id", data.id) : await supabaseAdmin.from("reviews").insert(payload);
  if (error) throw new Error(error.message);
  await audit(context.userId, data.id ? "update" : "create", "reviews", data.id ?? null, {
    author: data.author_name
  });
  return {
    ok: true
  };
});
const deleteReview_createServerFn_handler = createServerRpc({
  id: "87c24c312080889ae591248def17a1eca24b566136711b242a2f4def509948c4",
  name: "deleteReview",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => deleteReview.__executeServer(opts));
const deleteReview = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(deleteReview_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("reviews").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  await audit(context.userId, "delete", "reviews", data.id);
  return {
    ok: true
  };
});
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
const upsertTable_createServerFn_handler = createServerRpc({
  id: "ac1cdebec70e7888ef4a735d709f92f30dcd3c5ea8bf5abaafd89bb9730354f8",
  name: "upsertTable",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => upsertTable.__executeServer(opts));
const upsertTable = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => tableSchema.parse(input)).handler(upsertTable_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const payload = {
    ...data,
    template_id: data.template_id ?? null
  };
  const {
    error
  } = data.id ? await supabaseAdmin.from("restaurant_tables").update(payload).eq("id", data.id) : await supabaseAdmin.from("restaurant_tables").insert(payload);
  if (error) throw new Error(error.message);
  await audit(context.userId, data.id ? "update" : "create", "restaurant_tables", data.id ?? null, {
    table_number: data.table_number
  });
  return {
    ok: true
  };
});
const deleteTable_createServerFn_handler = createServerRpc({
  id: "f5201fcb3905d86d1601759e5c1d37730f38696285a1ad06a0aa50e2952ebf4d",
  name: "deleteTable",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => deleteTable.__executeServer(opts));
const deleteTable = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(deleteTable_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("restaurant_tables").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  await audit(context.userId, "delete", "restaurant_tables", data.id);
  return {
    ok: true
  };
});
const bumpTableQrVersion_createServerFn_handler = createServerRpc({
  id: "16badab7191c22544ad07800d063d9f5d16360261ecee1348ef6f0388b1ffa36",
  name: "bumpTableQrVersion",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => bumpTableQrVersion.__executeServer(opts));
const bumpTableQrVersion = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(bumpTableQrVersion_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data: row
  } = await supabaseAdmin.from("restaurant_tables").select("qr_version").eq("id", data.id).maybeSingle();
  const newVersion = (row?.qr_version ?? 1) + 1;
  const {
    error
  } = await supabaseAdmin.from("restaurant_tables").update({
    qr_version: newVersion
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  await audit(context.userId, "update", "restaurant_tables", data.id, {
    qr_version: newVersion
  });
  return {
    ok: true,
    qr_version: newVersion
  };
});
const toggleTableQrActive_createServerFn_handler = createServerRpc({
  id: "30ba69f9b42a5626dad084aa291eda836abf7829dd1f700c1fc79a81c4bfc5f7",
  name: "toggleTableQrActive",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => toggleTableQrActive.__executeServer(opts));
const toggleTableQrActive = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(toggleTableQrActive_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("restaurant_tables").update({
    qr_active: data.qr_active
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  await audit(context.userId, "toggle", "restaurant_tables", data.id, {
    qr_active: data.qr_active
  });
  return {
    ok: true
  };
});
const updateTableMenuFilter_createServerFn_handler = createServerRpc({
  id: "02ea2a26bb5cbddbd11f9c97315fe1277f8dbf306a542450ed9ffa05aa10d32c",
  name: "updateTableMenuFilter",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => updateTableMenuFilter.__executeServer(opts));
const updateTableMenuFilter = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(updateTableMenuFilter_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const filter = data.menu_filter.length ? data.menu_filter : ["all"];
  const {
    error
  } = await supabaseAdmin.from("restaurant_tables").update({
    menu_filter: filter
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const listReservations_createServerFn_handler = createServerRpc({
  id: "4e9675a643566e752726e064b8dfbaf03c0e79a107d1dd11f5bc3788a91870ef",
  name: "listReservations",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => listReservations.__executeServer(opts));
const listReservations = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listReservations_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("reservations").select("*").order("reservation_date", {
    ascending: false
  }).order("reservation_time", {
    ascending: false
  });
  if (error) throw new Error(error.message);
  return data ?? [];
});
const updateReservationStatus_createServerFn_handler = createServerRpc({
  id: "aa5db8477735bc97f9c4b5d24316ff4096b15837bde35800f85a17f36dac2075",
  name: "updateReservationStatus",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => updateReservationStatus.__executeServer(opts));
const updateReservationStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(updateReservationStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("reservations").update({
    status: data.status
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  await audit(context.userId, "update", "reservations", data.id, {
    status: data.status
  });
  return {
    ok: true
  };
});
const deleteReservation_createServerFn_handler = createServerRpc({
  id: "34ea9e2a4ce8a6168c2d5a54cbe6b58a4a9c1412169495112a2e5e2d16f154f0",
  name: "deleteReservation",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => deleteReservation.__executeServer(opts));
const deleteReservation = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(deleteReservation_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("reservations").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  await audit(context.userId, "delete", "reservations", data.id);
  return {
    ok: true
  };
});
const createReservationAdmin_createServerFn_handler = createServerRpc({
  id: "d31e92b81d4735f92561aef86135f41da7be3488c875bfd71e259dfc9c050a96",
  name: "createReservationAdmin",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => createReservationAdmin.__executeServer(opts));
const createReservationAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => reservationSchema.extend({
  status: enumType(["pending", "confirmed", "cancelled"]).default("confirmed")
}).parse(input)).handler(createReservationAdmin_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("reservations").insert({
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    reservation_date: data.reservation_date,
    reservation_time: data.reservation_time,
    guests: data.guests,
    occasion: data.occasion || null,
    note: data.note ?? "",
    status: data.status
  });
  if (error) throw new Error(error.message);
  await audit(context.userId, "create", "reservations", null, {
    name: data.name,
    phone: data.phone
  });
  return {
    ok: true
  };
});
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
const upsertGalleryItem_createServerFn_handler = createServerRpc({
  id: "0d8b3e74904ffc51f79dbe4efcab1981c53ea718673a5c9f2f53a0726e2cd396",
  name: "upsertGalleryItem",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => upsertGalleryItem.__executeServer(opts));
const upsertGalleryItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => gallerySchema.parse(input)).handler(upsertGalleryItem_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = data.id ? await supabaseAdmin.from("gallery").update(data).eq("id", data.id) : await supabaseAdmin.from("gallery").insert(data);
  if (error) throw new Error(error.message);
  await audit(context.userId, data.id ? "update" : "create", "gallery", data.id ?? null);
  return {
    ok: true
  };
});
const deleteGalleryItem_createServerFn_handler = createServerRpc({
  id: "e2a8475214e9cef129a790a4578b79749194202da4cf1ef0521b126daf523325",
  name: "deleteGalleryItem",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => deleteGalleryItem.__executeServer(opts));
const deleteGalleryItem = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(deleteGalleryItem_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("gallery").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  await audit(context.userId, "delete", "gallery", data.id);
  return {
    ok: true
  };
});
const reorderGallery_createServerFn_handler = createServerRpc({
  id: "206d7a9d35e7764a71252ff31a2ea7c81fdf5bf9fbd6c96f436677d875b13755",
  name: "reorderGallery",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => reorderGallery.__executeServer(opts));
const reorderGallery = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(reorderGallery_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  for (let i = 0; i < data.ids.length; i++) {
    await supabaseAdmin.from("gallery").update({
      sort_order: i * 10
    }).eq("id", data.ids[i]);
  }
  return {
    ok: true
  };
});
const updateSiteSetting_createServerFn_handler = createServerRpc({
  id: "9b09c541d5758c8c80dcdeed0e81164258b788545f091aab0e6d94bc60f11224",
  name: "updateSiteSetting",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => updateSiteSetting.__executeServer(opts));
const updateSiteSetting = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(updateSiteSetting_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("site_settings").upsert({
    key: data.key,
    value: data.value,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  });
  if (error) throw new Error(error.message);
  await audit(context.userId, "update", "site_settings", null, {
    key: data.key
  });
  return {
    ok: true
  };
});
const syncGoogleReviews_createServerFn_handler = createServerRpc({
  id: "3485b7e558ac15e072d9b1c83cf6be1e0335699cb4e6662cf737dcea966d54cd",
  name: "syncGoogleReviews",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => syncGoogleReviews.__executeServer(opts));
const syncGoogleReviews = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(syncGoogleReviews_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data: settingsRow,
    error: settingsError
  } = await supabaseAdmin.from("site_settings").select("value").eq("key", "google_reviews_settings").maybeSingle();
  if (settingsError) throw new Error(settingsError.message);
  const settings = settingsRow?.value || {};
  const apiKey = settings.apiKey || process.env.GOOGLE_PLACES_API_KEY;
  const placeId = settings.placeId || process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) {
    throw new Error("Google Maps API key və ya Place ID təyin edilməyib. Zəhmət olmasa ayarlar bölməsində qeyd edin.");
  }
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=az`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Google API sorğusu uğursuz oldu: ${res.statusText}`);
  }
  const json = await res.json();
  if (json.status !== "OK") {
    throw new Error(`Google API xətası: ${json.error_message || json.status}`);
  }
  const reviews = json.result?.reviews || [];
  let insertedCount = 0;
  for (const r of reviews) {
    const author_name = r.author_name;
    const review_date = r.time ? new Date(r.time * 1e3).toISOString().split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const content = r.text || "";
    if (!author_name || !content) continue;
    const {
      data: existing
    } = await supabaseAdmin.from("reviews").select("id").eq("author_name", author_name).eq("review_date", review_date).maybeSingle();
    if (existing) continue;
    const rating = Number(r.rating) || 5;
    const {
      error: insertError
    } = await supabaseAdmin.from("reviews").insert({
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
  await audit(context.userId, "bulk_create", "reviews", null, {
    count: insertedCount,
    source: "google"
  });
  return {
    ok: true,
    synced: insertedCount
  };
});
const getAdminStats_createServerFn_handler = createServerRpc({
  id: "6246b4af906150acf315c2e9211052a8ce84ac41bac824ba57a2686b0bdca444",
  name: "getAdminStats",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getAdminStats.__executeServer(opts));
const getAdminStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getAdminStats_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const monthStart = /* @__PURE__ */ new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);
  const [menu, reviews, tables, pendingRes, pendingReviews, monthRes, recentRes, recentPending, todayRes, openCalls] = await Promise.all([supabaseAdmin.from("menu_items").select("id", {
    count: "exact",
    head: true
  }).eq("is_active", true), supabaseAdmin.from("reviews").select("id", {
    count: "exact",
    head: true
  }), supabaseAdmin.from("restaurant_tables").select("id", {
    count: "exact",
    head: true
  }), supabaseAdmin.from("reservations").select("id", {
    count: "exact",
    head: true
  }).eq("status", "pending"), supabaseAdmin.from("reviews").select("id", {
    count: "exact",
    head: true
  }).eq("status", "pending"), supabaseAdmin.from("reservations").select("id", {
    count: "exact",
    head: true
  }).gte("created_at", monthStart.toISOString()), supabaseAdmin.from("reservations").select("*").order("created_at", {
    ascending: false
  }).limit(5), supabaseAdmin.from("reviews").select("*").eq("status", "pending").order("created_at", {
    ascending: false
  }).limit(3), supabaseAdmin.from("reservations").select("*").eq("reservation_date", todayStr).order("reservation_time"), supabaseAdmin.from("waiter_calls").select("id", {
    count: "exact",
    head: true
  }).eq("status", "open")]);
  return {
    menuCount: menu.count ?? 0,
    reviewsCount: reviews.count ?? 0,
    tablesCount: tables.count ?? 0,
    pendingReservations: pendingRes.count ?? 0,
    pendingReviews: pendingReviews.count ?? 0,
    monthReservations: monthRes.count ?? 0,
    recentReservations: recentRes.data ?? [],
    recentPendingReviews: recentPending.data ?? [],
    todayReservations: todayRes.data ?? [],
    openWaiterCalls: openCalls.count ?? 0
  };
});
const templateSchema = objectType({
  id: stringType().uuid().optional(),
  name: stringType().min(1).max(100),
  description: stringType().max(500).default(""),
  is_default: booleanType().default(false),
  lang_default: enumType(["az", "ru", "en"]).default("az"),
  accent_color: stringType().max(20).default("#8B6914"),
  show_prices: booleanType().default(true)
});
const getTemplates_createServerFn_handler = createServerRpc({
  id: "58c9f28adb04845f539c47c3deb256a23fe10e15e38d415f8efdfbf72762ce73",
  name: "getTemplates",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getTemplates.__executeServer(opts));
const getTemplates = createServerFn({
  method: "GET"
}).handler(getTemplates_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabaseAdmin.from("menu_templates").select("*").order("is_default", {
    ascending: false
  }).order("created_at");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const getTemplateCategories_createServerFn_handler = createServerRpc({
  id: "4f90da971237db0d41f8e4c9f4a51f0ef07ae31e983f393be89fa8c30c854190",
  name: "getTemplateCategories",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getTemplateCategories.__executeServer(opts));
const getTemplateCategories = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(getTemplateCategories_createServerFn_handler, async ({
  data
}) => {
  const {
    data: rows,
    error
  } = await supabaseAdmin.from("template_categories").select("*").eq("template_id", data.templateId).order("sort_order");
  if (error) throw new Error(error.message);
  return rows ?? [];
});
const upsertTemplate_createServerFn_handler = createServerRpc({
  id: "2d66c009a9fcefb2ffc178a555e506ea59b97945b17c5d882b6c5cea71683f1a",
  name: "upsertTemplate",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => upsertTemplate.__executeServer(opts));
const upsertTemplate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => templateSchema.parse(input)).handler(upsertTemplate_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  if (data.is_default) {
    await supabaseAdmin.from("menu_templates").update({
      is_default: false
    }).neq("id", data.id ?? "00000000-0000-0000-0000-000000000000");
  }
  const {
    error
  } = data.id ? await supabaseAdmin.from("menu_templates").update(data).eq("id", data.id) : await supabaseAdmin.from("menu_templates").insert(data);
  if (error) throw new Error(error.message);
  await audit(context.userId, data.id ? "update" : "create", "menu_templates", data.id ?? null, {
    name: data.name
  });
  return {
    ok: true
  };
});
const deleteTemplate_createServerFn_handler = createServerRpc({
  id: "2f0c72b11e223a7fe9974240d808e95487704dd512362ad6963ce11cee4132af",
  name: "deleteTemplate",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => deleteTemplate.__executeServer(opts));
const deleteTemplate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(deleteTemplate_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("menu_templates").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  await audit(context.userId, "delete", "menu_templates", data.id);
  return {
    ok: true
  };
});
const setTemplateCategories_createServerFn_handler = createServerRpc({
  id: "f790faef73043f5051e53d2ca3e442a646f3ee9e8588eb0ce32db103609862d7",
  name: "setTemplateCategories",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => setTemplateCategories.__executeServer(opts));
const setTemplateCategories = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(setTemplateCategories_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  await supabaseAdmin.from("template_categories").delete().eq("template_id", data.templateId);
  if (data.categories.length) {
    const rows = data.categories.map((c) => ({
      template_id: data.templateId,
      ...c
    }));
    const {
      error
    } = await supabaseAdmin.from("template_categories").insert(rows);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
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
const getItemVariants_createServerFn_handler = createServerRpc({
  id: "6fe5d7ce1cfee9a5698e4830b4c2b8722b718a5b263e545db78d01b10286fde8",
  name: "getItemVariants",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getItemVariants.__executeServer(opts));
const getItemVariants = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(getItemVariants_createServerFn_handler, async ({
  data
}) => {
  const {
    data: rows,
    error
  } = await supabaseAdmin.from("menu_item_variants").select("*").eq("item_id", data.itemId).order("sort_order");
  if (error) throw new Error(error.message);
  return rows ?? [];
});
const getItemExtras_createServerFn_handler = createServerRpc({
  id: "0b696b1c062a017891bc38b08a90d4e7f62ed14b7d27dfa8e6dad4ec068344f7",
  name: "getItemExtras",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getItemExtras.__executeServer(opts));
const getItemExtras = createServerFn({
  method: "GET"
}).inputValidator((input) => input).handler(getItemExtras_createServerFn_handler, async ({
  data
}) => {
  const {
    data: rows,
    error
  } = await supabaseAdmin.from("menu_item_extras").select("*").eq("item_id", data.itemId).order("sort_order");
  if (error) throw new Error(error.message);
  return rows ?? [];
});
const getAllVariants_createServerFn_handler = createServerRpc({
  id: "116adf8b9b9ea96fcab6e70748f13d3d6c3e56891b756516eab49c925e84b568",
  name: "getAllVariants",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getAllVariants.__executeServer(opts));
const getAllVariants = createServerFn({
  method: "GET"
}).handler(getAllVariants_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabaseAdmin.from("menu_item_variants").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const getAllExtras_createServerFn_handler = createServerRpc({
  id: "d342582215606413897c3fcc295c998d6d0c9031bdb4a8e2085da57d1ef5bf35",
  name: "getAllExtras",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getAllExtras.__executeServer(opts));
const getAllExtras = createServerFn({
  method: "GET"
}).handler(getAllExtras_createServerFn_handler, async () => {
  const {
    data,
    error
  } = await supabaseAdmin.from("menu_item_extras").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});
const upsertVariant_createServerFn_handler = createServerRpc({
  id: "026451cf249f0cdf5dbbb10b6aafb9a7d5cbdc48afcd185cc439bc44982a40ce",
  name: "upsertVariant",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => upsertVariant.__executeServer(opts));
const upsertVariant = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => variantSchema.parse(input)).handler(upsertVariant_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = data.id ? await supabaseAdmin.from("menu_item_variants").update(data).eq("id", data.id) : await supabaseAdmin.from("menu_item_variants").insert(data);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const deleteVariant_createServerFn_handler = createServerRpc({
  id: "df36dc3e5241357dc478867745ba720f463f69717b04dc98837cf7d3fb5cfb01",
  name: "deleteVariant",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => deleteVariant.__executeServer(opts));
const deleteVariant = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(deleteVariant_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("menu_item_variants").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const upsertExtra_createServerFn_handler = createServerRpc({
  id: "c6c1ef9740b0918339664c2855effaf10cc2000cb0fbb467548f8db512262487",
  name: "upsertExtra",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => upsertExtra.__executeServer(opts));
const upsertExtra = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => extraSchema.parse(input)).handler(upsertExtra_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = data.id ? await supabaseAdmin.from("menu_item_extras").update(data).eq("id", data.id) : await supabaseAdmin.from("menu_item_extras").insert(data);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const deleteExtra_createServerFn_handler = createServerRpc({
  id: "f54480bedc52daca30b388a80105fc8946795d4eb90617c05508c5a41c597583",
  name: "deleteExtra",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => deleteExtra.__executeServer(opts));
const deleteExtra = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(deleteExtra_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("menu_item_extras").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const bulkCreateTables_createServerFn_handler = createServerRpc({
  id: "005961e3ceb3745491e2a017fca3db3335ab5c2138fffc1bad6d1bb79aa74623",
  name: "bulkCreateTables",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => bulkCreateTables.__executeServer(opts));
const bulkCreateTables = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(bulkCreateTables_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  if (data.from < 1 || data.to < data.from || data.to - data.from > 200) {
    throw new Error("Yanlış aralıq");
  }
  const {
    data: existing
  } = await supabaseAdmin.from("restaurant_tables").select("table_number").gte("table_number", data.from).lte("table_number", data.to);
  const used = new Set((existing ?? []).map((r) => r.table_number));
  const rows = [];
  for (let n = data.from; n <= data.to; n++) {
    if (used.has(n)) continue;
    rows.push({
      table_number: n,
      capacity: data.capacity,
      location: data.location,
      template_id: data.template_id ?? null,
      qr_active: true
    });
  }
  if (rows.length) {
    const {
      error
    } = await supabaseAdmin.from("restaurant_tables").insert(rows);
    if (error) throw new Error(error.message);
  }
  await audit(context.userId, "bulk_create", "restaurant_tables", null, {
    count: rows.length,
    from: data.from,
    to: data.to
  });
  return {
    ok: true,
    created: rows.length,
    skipped: data.to - data.from + 1 - rows.length
  };
});
const assignTableTemplate_createServerFn_handler = createServerRpc({
  id: "8823070da65045d1ce5c0e2288c1998f168dd4ceca3f49e0081037f326c2d205",
  name: "assignTableTemplate",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => assignTableTemplate.__executeServer(opts));
const assignTableTemplate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(assignTableTemplate_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("restaurant_tables").update({
    template_id: data.template_id
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const getAuditLog_createServerFn_handler = createServerRpc({
  id: "187e2e0b3afb41f85a1e1e0ee5a5218be813c22c77cf66013876c67f234c4028",
  name: "getAuditLog",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => getAuditLog.__executeServer(opts));
const getAuditLog = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getAuditLog_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("audit_log").select("*").order("created_at", {
    ascending: false
  }).limit(200);
  if (error) throw new Error(error.message);
  return data ?? [];
});
const listWaiterCalls_createServerFn_handler = createServerRpc({
  id: "cd62a3238faf920eae40df1f8916c1bb61379275d9c1e1830d02573517242abe",
  name: "listWaiterCalls",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => listWaiterCalls.__executeServer(opts));
const listWaiterCalls = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listWaiterCalls_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data,
    error
  } = await supabaseAdmin.from("waiter_calls").select("*").order("status").order("created_at", {
    ascending: false
  }).limit(50);
  if (error) throw new Error(error.message);
  return data ?? [];
});
const resolveWaiterCall_createServerFn_handler = createServerRpc({
  id: "4748e7a8ac9aae54c701ba8d8d55e34f059b9cde67711ef8c4da58bac4f30d15",
  name: "resolveWaiterCall",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => resolveWaiterCall.__executeServer(opts));
const resolveWaiterCall = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(resolveWaiterCall_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("waiter_calls").update({
    status: "done",
    resolved_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const listAdmins_createServerFn_handler = createServerRpc({
  id: "c35fa6db422048c295a9636c0fc86b55dc088bc1266db1cf74bb8d6464035a61",
  name: "listAdmins",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => listAdmins.__executeServer(opts));
const listAdmins = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(listAdmins_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data: roles
  } = await supabaseAdmin.from("user_roles").select("user_id, role, created_at").eq("role", "admin");
  if (!roles?.length) return [];
  const {
    data: users
  } = await supabaseAdmin.auth.admin.listUsers();
  const byId = new Map((users?.users ?? []).map((u) => [u.id, u.email]));
  return roles.map((r) => ({
    user_id: r.user_id,
    email: byId.get(r.user_id) ?? "—",
    created_at: r.created_at
  }));
});
const addAdminByEmail_createServerFn_handler = createServerRpc({
  id: "a41c608ac421329767bcee4fa45491188dadd89ad1495d0813ffea5dd31c6efa",
  name: "addAdminByEmail",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => addAdminByEmail.__executeServer(opts));
const addAdminByEmail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
  email: stringType().email().max(200),
  password: stringType().min(6).max(72).optional()
}).parse(input)).handler(addAdminByEmail_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data: users
  } = await supabaseAdmin.auth.admin.listUsers();
  let user = users?.users?.find((u) => u.email?.toLowerCase() === data.email.toLowerCase());
  if (!user) {
    if (!data.password) throw new Error("Bu email yoxdur — şifrə təyin edin");
    const created = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true
    });
    if (created.error) throw new Error(created.error.message);
    user = created.data.user;
  }
  const {
    error
  } = await supabaseAdmin.from("user_roles").insert({
    user_id: user.id,
    role: "admin"
  });
  if (error && !error.message.includes("duplicate")) throw new Error(error.message);
  await audit(context.userId, "create", "user_roles", user.id, {
    email: data.email
  });
  return {
    ok: true
  };
});
const removeAdmin_createServerFn_handler = createServerRpc({
  id: "d38f3aec2190ff6f2c6954bfab54281da5c3d6e3c1bd1d947d0d7dbc9a7a4cbf",
  name: "removeAdmin",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => removeAdmin.__executeServer(opts));
const removeAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(removeAdmin_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  if (data.user_id === context.userId) throw new Error("Özünü silə bilməzsən");
  const {
    error
  } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id).eq("role", "admin");
  if (error) throw new Error(error.message);
  await audit(context.userId, "delete", "user_roles", data.user_id);
  return {
    ok: true
  };
});
const createDefaultAdmin_createServerFn_handler = createServerRpc({
  id: "d9c49e714771dad6bfa9125e51cc4c2667054bebfca6cdf3528142311660c746",
  name: "createDefaultAdmin",
  filename: "src/lib/restaurant.functions.ts"
}, (opts) => createDefaultAdmin.__executeServer(opts));
const createDefaultAdmin = createServerFn({
  method: "POST"
}).handler(createDefaultAdmin_createServerFn_handler, async () => {
  try {
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY tapılmadı. Bu əməliyyatı yalnız Lovable Cloud üzərində və ya yerli mühitdə service role key təyin edildikdən sonra icra etmək olar.");
    }
    const {
      data: usersData,
      error: listError
    } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;
    const existingAdmin = (usersData?.users ?? []).find((u) => u.email?.toLowerCase() === "admin@qosaqala.az");
    let adminId;
    if (existingAdmin) {
      adminId = existingAdmin.id;
      const {
        error: updateError
      } = await supabaseAdmin.auth.admin.updateUserById(adminId, {
        password: "Admin123!",
        email_confirm: true
      });
      if (updateError) throw updateError;
    } else {
      const {
        data: createData,
        error: createError
      } = await supabaseAdmin.auth.admin.createUser({
        email: "admin@qosaqala.az",
        password: "Admin123!",
        email_confirm: true
      });
      if (createError) throw createError;
      adminId = createData.user.id;
    }
    const {
      error: roleError
    } = await supabaseAdmin.from("user_roles").upsert({
      user_id: adminId,
      role: "admin"
    }, {
      onConflict: "user_id,role"
    });
    if (roleError) throw roleError;
    return {
      ok: true,
      message: "Admin hesabı uğurla quruldu: admin@qosaqala.az / Admin123!"
    };
  } catch (err) {
    console.error("Default admin creation error:", err);
    throw new Error(err.message || "Admin hesabı yaradılarkən xəta baş verdi");
  }
});
export {
  addAdminByEmail_createServerFn_handler,
  assignTableTemplate_createServerFn_handler,
  bulkCreateTables_createServerFn_handler,
  bulkUpdateMenuItems_createServerFn_handler,
  bumpTableQrVersion_createServerFn_handler,
  checkIsAdmin_createServerFn_handler,
  createDefaultAdmin_createServerFn_handler,
  createReservationAdmin_createServerFn_handler,
  createReservation_createServerFn_handler,
  createWaiterCall_createServerFn_handler,
  deleteCategory_createServerFn_handler,
  deleteExtra_createServerFn_handler,
  deleteGalleryItem_createServerFn_handler,
  deleteMenuItem_createServerFn_handler,
  deleteReservation_createServerFn_handler,
  deleteReview_createServerFn_handler,
  deleteTable_createServerFn_handler,
  deleteTemplate_createServerFn_handler,
  deleteVariant_createServerFn_handler,
  duplicateMenuItem_createServerFn_handler,
  getAdminStats_createServerFn_handler,
  getAllExtras_createServerFn_handler,
  getAllMenuItems_createServerFn_handler,
  getAllReviews_createServerFn_handler,
  getAllVariants_createServerFn_handler,
  getApprovedReviews_createServerFn_handler,
  getAuditLog_createServerFn_handler,
  getGallery_createServerFn_handler,
  getItemExtras_createServerFn_handler,
  getItemVariants_createServerFn_handler,
  getMenuCategories_createServerFn_handler,
  getMenuItems_createServerFn_handler,
  getQrContext_createServerFn_handler,
  getSiteSettings_createServerFn_handler,
  getTableByNumber_createServerFn_handler,
  getTables_createServerFn_handler,
  getTemplateCategories_createServerFn_handler,
  getTemplates_createServerFn_handler,
  listAdmins_createServerFn_handler,
  listReservations_createServerFn_handler,
  listWaiterCalls_createServerFn_handler,
  removeAdmin_createServerFn_handler,
  reorderCategories_createServerFn_handler,
  reorderGallery_createServerFn_handler,
  resolveWaiterCall_createServerFn_handler,
  setTemplateCategories_createServerFn_handler,
  syncGoogleReviews_createServerFn_handler,
  toggleMenuItemActive_createServerFn_handler,
  toggleTableQrActive_createServerFn_handler,
  updateReservationStatus_createServerFn_handler,
  updateSiteSetting_createServerFn_handler,
  updateTableMenuFilter_createServerFn_handler,
  upsertCategory_createServerFn_handler,
  upsertExtra_createServerFn_handler,
  upsertGalleryItem_createServerFn_handler,
  upsertMenuItem_createServerFn_handler,
  upsertReview_createServerFn_handler,
  upsertTable_createServerFn_handler,
  upsertTemplate_createServerFn_handler,
  upsertVariant_createServerFn_handler
};

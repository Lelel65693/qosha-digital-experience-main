import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ============ Helpers ============

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles").select("role")
    .eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

async function audit(
  userId: string,
  action: "create" | "update" | "delete" | "bulk_create" | "bulk_update" | "duplicate" | "toggle",
  entity: string,
  entityId: string | null,
  details: Record<string, any> = {},
) {
  try {
    await supabaseAdmin.from("audit_log").insert({
      user_id: userId, action, entity, entity_id: entityId, details,
    });
  } catch { /* never block on audit */ }
}

async function incrementMenuVersion() {
  try {
    const { data } = await supabaseAdmin.from("qr_settings").select("menu_version").eq("id", 1).maybeSingle();
    const nextVersion = (data?.menu_version ?? 0) + 1;
    await supabaseAdmin.from("qr_settings").update({ menu_version: nextVersion, updated_at: new Date().toISOString() }).eq("id", 1);
  } catch (err) {
    console.error("Failed to increment menu version:", err);
  }
}

// ============ PUBLIC READS ============

export const getMenuItems = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("menu_items").select("*").eq("is_active", true).order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getMenuCategories = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("menu_categories").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getApprovedReviews = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("reviews").select("*").eq("status", "approved")
    .order("is_featured", { ascending: false }).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getGallery = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("gallery").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

const qrSettingsSchema = z.object({
  fg_color: z.string(),
  bg_color: z.string(),
  logo_url: z.string().nullable().optional(),
  logo_active: z.boolean(),
  error_correction: z.enum(["L", "M", "Q", "H"]),
  size: z.number().int().min(200).max(600),
});

export const getQrSettings = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("qr_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw new Error(error.message);
    return data || { 
      id: 1,
      fg_color: "#C9A84C", 
      bg_color: "#111111", 
      logo_url: "", 
      logo_active: false, 
      error_correction: "M" as const, 
      size: 400, 
      menu_version: 1 
    };
  });

export const updateQrSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => qrSettingsSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("qr_settings")
      .update({
        fg_color: data.fg_color,
        bg_color: data.bg_color,
        logo_url: data.logo_url || null,
        logo_active: data.logo_active,
        error_correction: data.error_correction,
        size: data.size,
        updated_at: new Date().toISOString()
      })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getTableByNumber = createServerFn({ method: "GET" })
  .inputValidator((input: { tableNumber: number }) => input)
  .handler(async ({ data }) => {
    const { data: table } = await supabaseAdmin
      .from("restaurant_tables").select("*")
      .eq("table_number", data.tableNumber).eq("qr_active", true).maybeSingle();
    return table;
  });

export const getQrContext = createServerFn({ method: "GET" })
  .inputValidator((input: { tableNumber: number }) => input)
  .handler(async ({ data }) => {
    const { data: table } = await supabaseAdmin
      .from("restaurant_tables").select("*")
      .eq("table_number", data.tableNumber).eq("qr_active", true).maybeSingle();
    if (!table) return { table: null, template: null, visibleCategorySlugs: null as string[] | null };

    let template: any = null;
    let visibleCategorySlugs: string[] | null = null;

    if (table.template_id) {
      const [{ data: tpl }, { data: tcs }] = await Promise.all([
        supabaseAdmin.from("menu_templates").select("*").eq("id", table.template_id).maybeSingle(),
        supabaseAdmin.from("template_categories").select("category_id, is_visible, sort_order")
          .eq("template_id", table.template_id).eq("is_visible", true).order("sort_order"),
      ]);
      template = tpl;
      if (tcs && tcs.length) {
        const ids = tcs.map((r) => r.category_id);
        const { data: cats } = await supabaseAdmin
          .from("menu_categories").select("slug").in("id", ids);
        visibleCategorySlugs = (cats ?? []).map((c) => c.slug);
      }
    }
    return { table, template, visibleCategorySlugs };
  });

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin.from("site_settings").select("*");
  if (error) throw new Error(error.message);
  const map: Record<string, any> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return map;
});

// ============ RESERVATIONS (public create) ============

const reservationSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(5).max(30),
  email: z.string().email().max(150).optional().or(z.literal("")),
  reservation_date: z.string(),
  reservation_time: z.string(),
  guests: z.number().int().min(1).max(50),
  occasion: z.string().max(40).optional().default(""),
  note: z.string().max(500).optional().default(""),
});

export const createReservation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => reservationSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("reservations").insert({
      name: data.name, phone: data.phone, email: data.email || null,
      reservation_date: data.reservation_date, reservation_time: data.reservation_time,
      guests: data.guests, occasion: data.occasion || null, note: data.note ?? "",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ WAITER CALL (public) ============

export const createWaiterCall = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({
      table_number: z.number().int().min(1).max(9999),
      table_id: z.string().uuid().optional().nullable(),
      kind: z.enum(["waiter", "bill", "help"]).default("waiter"),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("waiter_calls").insert({
      table_number: data.table_number,
      table_id: data.table_id ?? null,
      kind: data.kind,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ ADMIN ============

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await supabaseAdmin
      .from("user_roles").select("role")
      .eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    return { isAdmin: !!data, userId: context.userId };
  });

export const getAllMenuItems = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("menu_items").select("*").order("category").order("sort_order");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getAllReviews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("reviews").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getTables = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("restaurant_tables").select("*").order("table_number");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// ============ CATEGORIES (admin) ============

const categorySchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(60).transform((s) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")),
  name_az: z.string().min(1).max(100),
  name_ru: z.string().max(100).default(""),
  name_en: z.string().max(100).default(""),
  icon: z.string().max(10).default("🍽️"),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const upsertCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => categorySchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = data.id
      ? await supabaseAdmin.from("menu_categories").update(data).eq("id", data.id)
      : await supabaseAdmin.from("menu_categories").insert(data);
    if (error) throw new Error(error.message);
    await audit(context.userId, data.id ? "update" : "create", "menu_categories", data.id ?? null, { name: data.name_az });
    return { ok: true };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("menu_categories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.userId, "delete", "menu_categories", data.id);
    return { ok: true };
  });

export const reorderCategories = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { ids: string[] }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    for (let i = 0; i < data.ids.length; i++) {
      await supabaseAdmin.from("menu_categories").update({ sort_order: i * 10 }).eq("id", data.ids[i]);
    }
    await audit(context.userId, "update", "menu_categories", null, { reorder: data.ids.length });
    return { ok: true };
  });

// ============ MENU ITEMS (admin) ============

const menuItemSchema = z.object({
  id: z.string().uuid().optional(),
  name_az: z.string().min(1).max(200),
  name_ru: z.string().max(200).default(""),
  name_en: z.string().max(200).default(""),
  desc_az: z.string().max(800).default(""),
  desc_ru: z.string().max(800).default(""),
  desc_en: z.string().max(800).default(""),
  price: z.number().min(0).max(99999),
  old_price: z.number().min(0).max(99999).nullable().optional(),
  category: z.string().min(1).max(50),
  category_id: z.string().uuid().nullable().optional(),
  image_url: z.string().max(500).nullable().optional(),
  weight_grams: z.number().int().min(0).max(99999).nullable().optional(),
  calories: z.number().int().min(0).max(99999).nullable().optional(),
  cooking_time: z.number().int().min(0).max(999).nullable().optional(),
  spicy_level: z.number().int().min(0).max(3).default(0),
  allergens: z.array(z.string()).default([]),
  badges: z.array(z.string()).default([]),
  badge: z.string().max(20).nullable().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

export const upsertMenuItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => menuItemSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const payload = {
      ...data,
      image_url: data.image_url || null,
      badge: data.badge || null,
      old_price: data.old_price ?? null,
      weight_grams: data.weight_grams ?? null,
      calories: data.calories ?? null,
      cooking_time: data.cooking_time ?? null,
      category_id: data.category_id ?? null,
    };
    const { error } = data.id
      ? await supabaseAdmin.from("menu_items").update(payload).eq("id", data.id)
      : await supabaseAdmin.from("menu_items").insert(payload);
    if (error) throw new Error(error.message);
    await audit(context.userId, data.id ? "update" : "create", "menu_items", data.id ?? null, { name: data.name_az });
    await incrementMenuVersion();
    return { ok: true };
  });

export const deleteMenuItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("menu_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.userId, "delete", "menu_items", data.id);
    await incrementMenuVersion();
    return { ok: true };
  });

// Quick "86" (out of stock today) toggle
export const toggleMenuItemActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; is_active: boolean }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("menu_items").update({ is_active: data.is_active }).eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.userId, "toggle", "menu_items", data.id, { is_active: data.is_active });
    await incrementMenuVersion();
    return { ok: true };
  });

// Duplicate a menu item (with "(kopya)" suffix)
export const duplicateMenuItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: src, error: e1 } = await supabaseAdmin
      .from("menu_items").select("*").eq("id", data.id).maybeSingle();
    if (e1) throw new Error(e1.message);
    if (!src) throw new Error("Yemək tapılmadı");
    const { id, created_at, updated_at, ...rest } = src as any;
    const copy = {
      ...rest,
      name_az: `${rest.name_az} (kopya)`,
      is_active: false,
    };
    const { data: inserted, error: e2 } = await supabaseAdmin
      .from("menu_items").insert(copy).select("id").maybeSingle();
    if (e2) throw new Error(e2.message);
    await audit(context.userId, "duplicate", "menu_items", inserted?.id ?? null, { from: data.id });
    await incrementMenuVersion();
    return { ok: true, id: inserted?.id };
  });

// Bulk update menu items
export const bulkUpdateMenuItems = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    ids: string[];
    action: "activate" | "deactivate" | "delete" | "category";
    category?: string;
  }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (!data.ids.length) return { ok: true, affected: 0 };
    let res;
    if (data.action === "activate")
      res = await supabaseAdmin.from("menu_items").update({ is_active: true }).in("id", data.ids);
    else if (data.action === "deactivate")
      res = await supabaseAdmin.from("menu_items").update({ is_active: false }).in("id", data.ids);
    else if (data.action === "delete")
      res = await supabaseAdmin.from("menu_items").delete().in("id", data.ids);
    else if (data.action === "category" && data.category)
      res = await supabaseAdmin.from("menu_items").update({ category: data.category }).in("id", data.ids);
    else return { ok: false };
    if (res?.error) throw new Error(res.error.message);
    await audit(context.userId, "bulk_update", "menu_items", null, { action: data.action, count: data.ids.length });
    await incrementMenuVersion();
    return { ok: true, affected: data.ids.length };
  });

// ============ REVIEWS (admin) ============

const reviewSchema = z.object({
  id: z.string().uuid().optional(),
  author_name: z.string().min(1).max(100),
  author_avatar: z.string().max(500).nullable().optional(),
  content: z.string().min(1).max(2000),
  content_az: z.string().max(2000).default(""),
  content_ru: z.string().max(2000).default(""),
  content_en: z.string().max(2000).default(""),
  rating: z.number().int().min(1).max(5),
  status: z.enum(["pending", "approved", "rejected"]).default("approved"),
  is_featured: z.boolean().default(false),
  source: z.string().max(40).default("manual"),
  review_date: z.string().optional(),
});

export const upsertReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => reviewSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const payload: any = { ...data, author_avatar: data.author_avatar || null };
    const { error } = data.id
      ? await supabaseAdmin.from("reviews").update(payload).eq("id", data.id)
      : await supabaseAdmin.from("reviews").insert(payload);
    if (error) throw new Error(error.message);
    await audit(context.userId, data.id ? "update" : "create", "reviews", data.id ?? null, { author: data.author_name });
    return { ok: true };
  });

export const deleteReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("reviews").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.userId, "delete", "reviews", data.id);
    return { ok: true };
  });

// ============ TABLES (admin) ============

const tableSchema = z.object({
  id: z.string().uuid().optional(),
  table_number: z.number().int().min(1).max(9999),
  table_name: z.string().max(100).default(""),
  location: z.string().max(50).default("İçəri"),
  capacity: z.number().int().min(1).max(50).default(4),
  custom_message: z.string().max(500).default(""),
  menu_filter: z.array(z.string()).default(["all"]),
  qr_active: z.boolean().default(true),
  template_id: z.string().uuid().nullable().optional(),
});

export const upsertTable = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => tableSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const payload: any = { ...data, template_id: data.template_id ?? null };
    const { error } = data.id
      ? await supabaseAdmin.from("restaurant_tables").update(payload).eq("id", data.id)
      : await supabaseAdmin.from("restaurant_tables").insert(payload);
    if (error) throw new Error(error.message);
    await audit(context.userId, data.id ? "update" : "create", "restaurant_tables", data.id ?? null, { table_number: data.table_number });
    return { ok: true };
  });

export const deleteTable = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("restaurant_tables").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.userId, "delete", "restaurant_tables", data.id);
    return { ok: true };
  });

export const bumpTableQrVersion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { data: row } = await supabaseAdmin
      .from("restaurant_tables").select("qr_version").eq("id", data.id).maybeSingle();
    const newVersion = (row?.qr_version ?? 1) + 1;
    const { error } = await supabaseAdmin
      .from("restaurant_tables").update({ qr_version: newVersion }).eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.userId, "update", "restaurant_tables", data.id, { qr_version: newVersion });
    return { ok: true, qr_version: newVersion };
  });

export const toggleTableQrActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; qr_active: boolean }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("restaurant_tables").update({ qr_active: data.qr_active }).eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.userId, "toggle", "restaurant_tables", data.id, { qr_active: data.qr_active });
    return { ok: true };
  });

export const updateTableMenuFilter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; menu_filter: string[] }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const filter = data.menu_filter.length ? data.menu_filter : ["all"];
    const { error } = await supabaseAdmin
      .from("restaurant_tables").update({ menu_filter: filter }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ RESERVATIONS (admin) ============

export const listReservations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("reservations").select("*")
      .order("reservation_date", { ascending: false })
      .order("reservation_time", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateReservationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: "pending" | "confirmed" | "cancelled" }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("reservations").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.userId, "update", "reservations", data.id, { status: data.status });
    return { ok: true };
  });

export const deleteReservation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("reservations").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.userId, "delete", "reservations", data.id);
    return { ok: true };
  });

// Admin manually creates a reservation (phone-in)
export const createReservationAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => reservationSchema.extend({
    status: z.enum(["pending", "confirmed", "cancelled"]).default("confirmed"),
  }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("reservations").insert({
      name: data.name, phone: data.phone, email: data.email || null,
      reservation_date: data.reservation_date, reservation_time: data.reservation_time,
      guests: data.guests, occasion: data.occasion || null, note: data.note ?? "",
      status: data.status,
    });
    if (error) throw new Error(error.message);
    await audit(context.userId, "create", "reservations", null, { name: data.name, phone: data.phone });
    return { ok: true };
  });

// ============ GALLERY (admin) ============

const gallerySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().max(200).default(""),
  category: z.string().max(50).default("interior"),
  url: z.string().min(1).max(500),
  sort_order: z.number().int().default(0),
  caption_az: z.string().max(300).default(""),
  caption_ru: z.string().max(300).default(""),
  caption_en: z.string().max(300).default(""),
  is_active: z.boolean().default(true),
});

export const upsertGalleryItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => gallerySchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = data.id
      ? await supabaseAdmin.from("gallery").update(data).eq("id", data.id)
      : await supabaseAdmin.from("gallery").insert(data);
    if (error) throw new Error(error.message);
    await audit(context.userId, data.id ? "update" : "create", "gallery", data.id ?? null);
    return { ok: true };
  });

export const deleteGalleryItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("gallery").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.userId, "delete", "gallery", data.id);
    return { ok: true };
  });

export const reorderGallery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { ids: string[] }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    for (let i = 0; i < data.ids.length; i++) {
      await supabaseAdmin.from("gallery").update({ sort_order: i * 10 }).eq("id", data.ids[i]);
    }
    return { ok: true };
  });

// ============ SITE SETTINGS (admin) ============

export const updateSiteSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { key: string; value: any }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("site_settings").upsert({ key: data.key, value: data.value, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    await audit(context.userId, "update", "site_settings", null, { key: data.key });
    return { ok: true };
  });

export const syncGoogleReviews = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);

    // Retrieve settings
    const { data: settingsRow, error: settingsError } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "google_reviews_settings")
      .maybeSingle();

    if (settingsError) throw new Error(settingsError.message);
    
    const settings = (settingsRow?.value as any) || {};
    const apiKey = settings.apiKey || process.env.GOOGLE_PLACES_API_KEY;
    const placeId = settings.placeId || process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      throw new Error("Google Maps API key və ya Place ID təyin edilməyib. Zəhmət olmasa ayarlar bölməsində qeyd edin.");
    }

    // Call Google Place Details API
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=az`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Google API sorğusu uğursuz oldu: ${res.statusText}`);
    }

    const json = await res.json() as any;
    if (json.status !== "OK") {
      throw new Error(`Google API xətası: ${json.error_message || json.status}`);
    }

    const reviews = json.result?.reviews || [];
    let insertedCount = 0;

    for (const r of reviews) {
      const author_name = r.author_name;
      const review_date = r.time ? new Date(r.time * 1000).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
      const content = r.text || "";

      if (!author_name || !content) continue;

      // Check if already exists in Supabase
      const { data: existing } = await supabaseAdmin
        .from("reviews")
        .select("id")
        .eq("author_name", author_name)
        .eq("review_date", review_date)
        .maybeSingle();

      if (existing) continue;

      const rating = Number(r.rating) || 5;

      const { error: insertError } = await supabaseAdmin
        .from("reviews")
        .insert({
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

    await audit(context.userId, "bulk_create", "reviews", null, { count: insertedCount, source: "google" });
    return { ok: true, synced: insertedCount };
  });


// ============ DASHBOARD ============

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10);

    const [menu, reviews, tables, pendingRes, pendingReviews, monthRes, recentRes, recentPending, todayRes, openCalls] = await Promise.all([
      supabaseAdmin.from("menu_items").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabaseAdmin.from("reviews").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("restaurant_tables").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("reservations").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabaseAdmin.from("reviews").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabaseAdmin.from("reservations").select("id", { count: "exact", head: true }).gte("created_at", monthStart.toISOString()),
      supabaseAdmin.from("reservations").select("*").order("created_at", { ascending: false }).limit(5),
      supabaseAdmin.from("reviews").select("*").eq("status", "pending").order("created_at", { ascending: false }).limit(3),
      supabaseAdmin.from("reservations").select("*").eq("reservation_date", todayStr).order("reservation_time"),
      supabaseAdmin.from("waiter_calls").select("id", { count: "exact", head: true }).eq("status", "open"),
    ]);

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
      openWaiterCalls: openCalls.count ?? 0,
    };
  });

// ============ TEMPLATES ============

const templateSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).default(""),
  is_default: z.boolean().default(false),
  lang_default: z.enum(["az", "ru", "en"]).default("az"),
  accent_color: z.string().max(20).default("#8B6914"),
  show_prices: z.boolean().default(true),
});

export const getTemplates = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("menu_templates").select("*")
    .order("is_default", { ascending: false }).order("created_at");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getTemplateCategories = createServerFn({ method: "GET" })
  .inputValidator((input: { templateId: string }) => input)
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin
      .from("template_categories").select("*")
      .eq("template_id", data.templateId).order("sort_order");
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const upsertTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => templateSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (data.is_default) {
      await supabaseAdmin.from("menu_templates").update({ is_default: false })
        .neq("id", data.id ?? "00000000-0000-0000-0000-000000000000");
    }
    const { error } = data.id
      ? await supabaseAdmin.from("menu_templates").update(data).eq("id", data.id)
      : await supabaseAdmin.from("menu_templates").insert(data);
    if (error) throw new Error(error.message);
    await audit(context.userId, data.id ? "update" : "create", "menu_templates", data.id ?? null, { name: data.name });
    return { ok: true };
  });

export const deleteTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("menu_templates").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    await audit(context.userId, "delete", "menu_templates", data.id);
    return { ok: true };
  });

export const setTemplateCategories = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { templateId: string; categories: { category_id: string; sort_order: number; is_visible: boolean }[] }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    await supabaseAdmin.from("template_categories").delete().eq("template_id", data.templateId);
    if (data.categories.length) {
      const rows = data.categories.map((c) => ({ template_id: data.templateId, ...c }));
      const { error } = await supabaseAdmin.from("template_categories").insert(rows);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ============ VARIANTS / EXTRAS ============

const variantSchema = z.object({
  id: z.string().uuid().optional(),
  item_id: z.string().uuid(),
  name_az: z.string().min(1).max(100),
  name_ru: z.string().max(100).default(""),
  name_en: z.string().max(100).default(""),
  price: z.number().min(0).max(99999),
  weight_grams: z.number().int().min(0).max(99999).nullable().optional(),
  is_default: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

const extraSchema = z.object({
  id: z.string().uuid().optional(),
  item_id: z.string().uuid(),
  name_az: z.string().min(1).max(100),
  name_ru: z.string().max(100).default(""),
  name_en: z.string().max(100).default(""),
  price: z.number().min(0).max(99999),
  is_required: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

export const getItemVariants = createServerFn({ method: "GET" })
  .inputValidator((input: { itemId: string }) => input)
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin
      .from("menu_item_variants").select("*").eq("item_id", data.itemId).order("sort_order");
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getItemExtras = createServerFn({ method: "GET" })
  .inputValidator((input: { itemId: string }) => input)
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin
      .from("menu_item_extras").select("*").eq("item_id", data.itemId).order("sort_order");
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getAllVariants = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin.from("menu_item_variants").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getAllExtras = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin.from("menu_item_extras").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const upsertVariant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => variantSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = data.id
      ? await supabaseAdmin.from("menu_item_variants").update(data).eq("id", data.id)
      : await supabaseAdmin.from("menu_item_variants").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteVariant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("menu_item_variants").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const upsertExtra = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => extraSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = data.id
      ? await supabaseAdmin.from("menu_item_extras").update(data).eq("id", data.id)
      : await supabaseAdmin.from("menu_item_extras").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteExtra = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("menu_item_extras").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ TABLES: bulk + template assign ============

export const bulkCreateTables = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { from: number; to: number; location: string; capacity: number; template_id?: string | null }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (data.from < 1 || data.to < data.from || data.to - data.from > 200) {
      throw new Error("Yanlış aralıq");
    }
    const { data: existing } = await supabaseAdmin
      .from("restaurant_tables").select("table_number")
      .gte("table_number", data.from).lte("table_number", data.to);
    const used = new Set((existing ?? []).map((r) => r.table_number));
    const rows = [] as any[];
    for (let n = data.from; n <= data.to; n++) {
      if (used.has(n)) continue;
      rows.push({
        table_number: n, capacity: data.capacity, location: data.location,
        template_id: data.template_id ?? null, qr_active: true,
      });
    }
    if (rows.length) {
      const { error } = await supabaseAdmin.from("restaurant_tables").insert(rows);
      if (error) throw new Error(error.message);
    }
    await audit(context.userId, "bulk_create", "restaurant_tables", null, { count: rows.length, from: data.from, to: data.to });
    return { ok: true, created: rows.length, skipped: (data.to - data.from + 1) - rows.length };
  });

export const assignTableTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; template_id: string | null }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("restaurant_tables").update({ template_id: data.template_id }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ AUDIT LOG ============

export const getAuditLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("audit_log").select("*").order("created_at", { ascending: false }).limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// ============ WAITER CALLS (admin) ============

export const listWaiterCalls = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("waiter_calls").select("*")
      .order("status").order("created_at", { ascending: false }).limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const resolveWaiterCall = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("waiter_calls").update({ status: "done", resolved_at: new Date().toISOString() }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============ ADMIN USERS ============

export const listAdmins = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { data: roles } = await supabaseAdmin
      .from("user_roles").select("user_id, role, created_at").eq("role", "admin");
    if (!roles?.length) return [];
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const byId = new Map((users?.users ?? []).map((u: any) => [u.id, u.email]));
    return roles.map((r) => ({
      user_id: r.user_id,
      email: byId.get(r.user_id) ?? "—",
      created_at: r.created_at,
    }));
  });

export const addAdminByEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({
      email: z.string().email().max(200),
      password: z.string().min(6).max(72).optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    // Find existing user
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    let user = users?.users?.find((u: any) => u.email?.toLowerCase() === data.email.toLowerCase());
    if (!user) {
      if (!data.password) throw new Error("Bu email yoxdur — şifrə təyin edin");
      const created = await supabaseAdmin.auth.admin.createUser({
        email: data.email, password: data.password, email_confirm: true,
      });
      if (created.error) throw new Error(created.error.message);
      user = created.data.user!;
    }
    // Add role
    const { error } = await supabaseAdmin.from("user_roles")
      .insert({ user_id: user.id, role: "admin" });
    if (error && !error.message.includes("duplicate")) throw new Error(error.message);
    await audit(context.userId, "create", "user_roles", user.id, { email: data.email });
    return { ok: true };
  });

export const removeAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { user_id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (data.user_id === context.userId) throw new Error("Özünü silə bilməzsən");
    const { error } = await supabaseAdmin
      .from("user_roles").delete().eq("user_id", data.user_id).eq("role", "admin");
    if (error) throw new Error(error.message);
    await audit(context.userId, "delete", "user_roles", data.user_id);
    return { ok: true };
  });

export const createDefaultAdmin = createServerFn({ method: "POST" }).handler(async () => {
  try {
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY tapılmadı. Bu əməliyyatı yalnız Lovable Cloud üzərində və ya yerli mühitdə service role key təyin edildikdən sonra icra etmək olar."
      );
    }

    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const existingAdmin = (usersData?.users ?? []).find(
      (u: any) => u.email?.toLowerCase() === "admin@qosaqala.az"
    );

    let adminId: string;

    if (existingAdmin) {
      adminId = existingAdmin.id;
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(adminId, {
        password: "Admin123!",
        email_confirm: true,
      });
      if (updateError) throw updateError;
    } else {
      const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: "admin@qosaqala.az",
        password: "Admin123!",
        email_confirm: true,
      });
      if (createError) throw createError;
      adminId = createData.user!.id;
    }

    const { error: roleError } = await supabaseAdmin.from("user_roles").upsert(
      {
        user_id: adminId,
        role: "admin",
      },
      { onConflict: "user_id,role" }
    );
    if (roleError) throw roleError;

    return { ok: true, message: "Admin hesabı uğurla quruldu: admin@qosaqala.az / Admin123!" };
  } catch (err: any) {
    console.error("Default admin creation error:", err);
    throw new Error(err.message || "Admin hesabı yaradılarkən xəta baş verdi");
  }
});


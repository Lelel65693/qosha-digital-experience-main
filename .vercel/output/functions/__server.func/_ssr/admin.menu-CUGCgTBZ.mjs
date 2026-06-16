import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as itemsQ, C as catsQ, D as toggleMenuItemActive, E as duplicateMenuItem, F as deleteMenuItem, G as upsertMenuItem } from "./router-Cyx6-Q3j.mjs";
import { a as useSuspenseQuery, b as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { u as useDropzone } from "../_libs/react-dropzone.mjs";
import { i as imageCompression } from "../_libs/browser-image-compression.mjs";
import { supabase } from "./client-Cg-358lU.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { k as Plus, s as Search, c as Star, z as Power, E as Copy, v as Pencil, u as Trash2, X, H as Upload } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./auth-middleware-B_zzLJ1T.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/file-selector.mjs";
import "../_libs/attr-accept.mjs";
const ALLERGENS = ["gluten", "dairy", "eggs", "nuts", "fish", "shellfish", "soy", "sesame", "mustard", "celery", "lupin", "molluscs"];
const ALLERGEN_LABEL = {
  gluten: "Gluten",
  dairy: "Süd",
  eggs: "Yumurta",
  nuts: "Qoz-fındıq",
  fish: "Balıq",
  shellfish: "Xərçəng",
  soy: "Soya",
  sesame: "Küncüt",
  mustard: "Xardal",
  celery: "Selderey",
  lupin: "Lüpin",
  molluscs: "Molyusk"
};
const BADGE_OPTIONS = [{
  v: "popular",
  l: "🔥 Populyar"
}, {
  v: "new",
  l: "✨ Yeni"
}, {
  v: "vegan",
  l: "🌱 Vegan"
}, {
  v: "chef",
  l: "👨‍🍳 Aşpaz seçimi"
}, {
  v: "premium",
  l: "🏆 Premium"
}, {
  v: "discount",
  l: "🎉 Endirim"
}];
function MenuAdmin() {
  const {
    data: items
  } = useSuspenseQuery(itemsQ);
  const {
    data: cats
  } = useSuspenseQuery(catsQ);
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const [filter, setFilter] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [view, setView] = reactExports.useState("table");
  const [showInactive, setShowInactive] = reactExports.useState(true);
  const filtered = reactExports.useMemo(() => {
    return items.filter((it) => {
      if (filter !== "all" && it.category !== filter) return false;
      if (!showInactive && !it.is_active) return false;
      if (search && !it.name_az.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, filter, search, showInactive]);
  const save = async (form) => {
    try {
      const cat = cats.find((c) => c.slug === form.category);
      await upsertMenuItem({
        data: {
          id: form.id,
          name_az: form.name_az || "",
          name_ru: form.name_ru || "",
          name_en: form.name_en || "",
          desc_az: form.desc_az || "",
          desc_ru: form.desc_ru || "",
          desc_en: form.desc_en || "",
          price: Number(form.price) || 0,
          old_price: form.old_price ? Number(form.old_price) : null,
          category: form.category || cats[0]?.slug || "main-dishes",
          category_id: cat?.id ?? null,
          image_url: form.image_url || null,
          weight_grams: form.weight_grams ? Number(form.weight_grams) : null,
          calories: form.calories ? Number(form.calories) : null,
          cooking_time: form.cooking_time ? Number(form.cooking_time) : null,
          spicy_level: Number(form.spicy_level) || 0,
          allergens: form.allergens ?? [],
          badges: form.badges ?? [],
          is_active: form.is_active ?? true,
          is_featured: form.is_featured ?? false,
          sort_order: Number(form.sort_order) || 0
        }
      });
      toast.success("Yaddaşa yazıldı");
      setEditing(null);
      qc.invalidateQueries({
        queryKey: ["admin-menu"]
      });
      qc.invalidateQueries({
        queryKey: ["menu_items"]
      });
    } catch (e) {
      toast.error(e.message);
    }
  };
  const remove = async (id) => {
    if (!confirm("Silinsin?")) return;
    await deleteMenuItem({
      data: {
        id
      }
    });
    qc.invalidateQueries({
      queryKey: ["admin-menu"]
    });
  };
  const toggleActive = async (id, is_active) => {
    try {
      await toggleMenuItemActive({
        data: {
          id,
          is_active
        }
      });
      qc.invalidateQueries({
        queryKey: ["admin-menu"]
      });
      qc.invalidateQueries({
        queryKey: ["menu_items"]
      });
      toast.success(is_active ? "Aktivləşdirildi" : "Bu gün bitib (deaktiv)");
    } catch (e) {
      toast.error(e.message);
    }
  };
  const duplicate = async (id) => {
    try {
      await duplicateMenuItem({
        data: {
          id
        }
      });
      qc.invalidateQueries({
        queryKey: ["admin-menu"]
      });
      toast.success("Surəti çıxarıldı (passiv)");
    } catch (e) {
      toast.error(e.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl", children: "Menyu İdarəsi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
          filtered.length,
          " / ",
          items.length,
          " yemək"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing({
        category: cats[0]?.slug,
        is_active: true,
        price: 0,
        sort_order: 0,
        spicy_level: 0,
        allergens: [],
        badges: []
      }), className: "flex items-center gap-2 px-4 py-2 bg-gradient-gold text-primary-foreground rounded-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Yeni Məhsul"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl p-3 mb-4 flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filter, onChange: (e) => setFilter(e.target.value), className: "px-3 py-2 bg-background border border-border rounded text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Bütün kateqoriyalar" }),
        cats.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.slug, children: [
          c.icon,
          " ",
          c.name_az
        ] }, c.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative min-w-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Axtar...", className: "w-full pl-9 pr-3 py-2 bg-background border border-border rounded text-sm" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: showInactive, onChange: (e) => setShowInactive(e.target.checked) }),
        "Passivlər"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border border-border rounded overflow-hidden text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setView("table"), className: `px-3 py-2 ${view === "table" ? "bg-primary text-primary-foreground" : ""}`, children: "Cədvəl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setView("card"), className: `px-3 py-2 ${view === "card" ? "bg-primary text-primary-foreground" : ""}`, children: "Kart" })
      ] })
    ] }),
    view === "table" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border/40 rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Ad" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Kateqoriya" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Qiymət" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Çəki" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/40 hover:bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: it.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: it.image_url, className: "w-12 h-12 object-cover rounded", alt: "" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-muted rounded" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium flex items-center gap-1", children: [
            it.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 text-primary fill-primary" }),
            it.name_az
          ] }),
          it.spicy_level > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "🌶".repeat(it.spicy_level) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground text-xs", children: it.category }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3", children: [
          it.old_price && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-through text-muted-foreground text-xs mr-1", children: it.old_price }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
            it.price,
            " ₼"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-xs text-muted-foreground", children: it.weight_grams ? `${it.weight_grams}g` : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded ${it.is_active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`, children: it.is_active ? "Aktiv" : "Passiv" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-right whitespace-nowrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleActive(it.id, !it.is_active), className: `p-2 rounded ${it.is_active ? "hover:bg-amber-500/10 text-amber-600" : "hover:bg-green-500/10 text-green-600"}`, title: it.is_active ? "Bu gün bitib (86)" : "Aktivləşdir", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => duplicate(it.id), className: "p-2 hover:bg-muted rounded", title: "Surət", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing(it), className: "p-2 hover:bg-muted rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(it.id), className: "p-2 hover:bg-destructive/10 text-destructive rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] })
      ] }, it.id)) })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: filtered.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl overflow-hidden", children: [
      it.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: it.image_url, className: "w-full aspect-video object-cover", alt: "" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: it.name_az }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mb-2", children: [
          it.category,
          " · ",
          it.price,
          " ₼"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing(it), className: "flex-1 px-3 py-1.5 text-xs border border-border rounded", children: "Düzəlt" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(it.id), className: "px-3 py-1.5 text-xs border border-destructive/40 text-destructive rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }) })
        ] })
      ] })
    ] }, it.id)) }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(ItemModal, { item: editing, cats, onClose: () => setEditing(null), onSave: save })
  ] });
}
function ItemModal({
  item,
  cats,
  onClose,
  onSave
}) {
  const [f, setF] = reactExports.useState({
    allergens: [],
    badges: [],
    ...item
  });
  const [tab, setTab] = reactExports.useState("az");
  const [uploading, setUploading] = reactExports.useState(false);
  const upload = reactExports.useCallback(async (file) => {
    setUploading(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
        fileType: "image/webp"
      });
      const path = `menu/${crypto.randomUUID()}.webp`;
      const {
        error
      } = await supabase.storage.from("menu-images").upload(path, compressed, {
        contentType: "image/webp"
      });
      if (error) throw error;
      const {
        data: pub
      } = supabase.storage.from("menu-images").getPublicUrl(path);
      setF((p) => ({
        ...p,
        image_url: pub.publicUrl
      }));
      toast.success("Şəkil yükləndi");
    } catch (e) {
      toast.error(e.message);
    }
    setUploading(false);
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    accept: {
      "image/*": []
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop: (files) => files[0] && upload(files[0])
  });
  const toggleArr = (key, v) => {
    const arr = f[key] || [];
    setF({
      ...f,
      [key]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl max-w-5xl w-full max-h-[95vh] overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center p-5 border-b border-border/40 sticky top-0 bg-card z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl", children: f.id ? "Məhsulu Redaktə Et" : "Yeni Məhsul" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[1fr_320px] gap-6 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "1. Əsas Məlumat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Ad" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mb-2 mt-1", children: ["az", "ru", "en"].map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setTab(l), className: `px-3 py-1 text-xs rounded ${tab === l ? "bg-primary text-primary-foreground" : "bg-muted"}`, children: l.toUpperCase() }, l)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: f[`name_${tab}`] || "", onChange: (e) => setF({
              ...f,
              [`name_${tab}`]: e.target.value
            }), placeholder: `${tab.toUpperCase()} adı`, className: "inp" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs text-muted-foreground", children: [
              "İzah (",
              tab.toUpperCase(),
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 3, value: f[`desc_${tab}`] || "", onChange: (e) => setF({
              ...f,
              [`desc_${tab}`]: e.target.value
            }), className: "inp" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Kateqoriya" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: f.category || "", onChange: (e) => setF({
              ...f,
              category: e.target.value
            }), className: "inp", children: cats.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: c.slug, children: [
              c.icon,
              " ",
              c.name_az
            ] }, c.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "2. Qiymət", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Cari Qiymət (₼) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.01", value: f.price ?? 0, onChange: (e) => setF({
              ...f,
              price: Number(e.target.value)
            }), className: "inp" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Köhnə Qiymət (endirim üçün)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.01", value: f.old_price ?? "", onChange: (e) => setF({
              ...f,
              old_price: e.target.value ? Number(e.target.value) : null
            }), className: "inp" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "3. Şəkil", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ...getRootProps(), className: `border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${isDragActive ? "border-primary bg-primary/5" : "border-border"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ...getInputProps() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: uploading ? "Yüklənir..." : "Şəkli buraya sürüklə və ya kliklə" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "PNG, JPG, WEBP · Max 5MB" })
          ] }),
          f.image_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: f.image_url, className: "w-full max-h-48 object-cover rounded", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setF({
              ...f,
              image_url: null
            }), className: "absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: f.image_url || "", onChange: (e) => setF({
            ...f,
            image_url: e.target.value
          }), placeholder: "və ya URL daxil edin", className: "inp mt-2 text-xs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "4. Fiziki Xüsusiyyətlər", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Çəki (g)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: f.weight_grams ?? "", onChange: (e) => setF({
              ...f,
              weight_grams: e.target.value ? Number(e.target.value) : null
            }), className: "inp" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Kaloriya" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: f.calories ?? "", onChange: (e) => setF({
              ...f,
              calories: e.target.value ? Number(e.target.value) : null
            }), className: "inp" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Vaxt (dəq)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: f.cooking_time ?? "", onChange: (e) => setF({
              ...f,
              cooking_time: e.target.value ? Number(e.target.value) : null
            }), className: "inp" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "5. İstilik Səviyyəsi", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [0, 1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setF({
          ...f,
          spicy_level: n
        }), className: `flex-1 py-2 rounded border ${f.spicy_level === n ? "border-primary bg-primary/10" : "border-border"}`, children: n === 0 ? "Yox" : "🌶".repeat(n) }, n)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "6. Allergenlər", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: ALLERGENS.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm p-2 hover:bg-muted/40 rounded cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: (f.allergens || []).includes(a), onChange: () => toggleArr("allergens", a) }),
          ALLERGEN_LABEL[a]
        ] }, a)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "7. Etiketlər", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: BADGE_OPTIONS.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm p-2 hover:bg-muted/40 rounded cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: (f.badges || []).includes(b.v), onChange: () => toggleArr("badges", b.v) }),
          b.l
        ] }, b.v)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "8. Görünürlük", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between p-3 bg-background rounded border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Aktiv (menyu-da göstər)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: f.is_active ?? true, onChange: (e) => setF({
              ...f,
              is_active: e.target.checked
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between p-3 bg-background rounded border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Öne Çıxar (ana səhifədə)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: f.is_featured ?? false, onChange: (e) => setF({
              ...f,
              is_featured: e.target.checked
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Sıra nömrəsi" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: f.sort_order ?? 0, onChange: (e) => setF({
              ...f,
              sort_order: Number(e.target.value)
            }), className: "inp" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Canlı önizləmə (müştəri belə görəcək)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-[280px] bg-background border-4 border-foreground/20 rounded-3xl p-3 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg overflow-hidden", children: [
          f.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: f.image_url, className: "w-full h-32 object-cover", alt: "" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 bg-muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm leading-tight", children: f.name_az || "Məhsul adı" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                f.old_price && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "line-through text-xs text-muted-foreground", children: [
                  f.old_price,
                  " ₼"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-primary font-bold text-sm", children: [
                  f.price || 0,
                  " ₼"
                ] })
              ] })
            ] }),
            f.desc_az && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: f.desc_az }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 mt-2 text-xs", children: [
              f.spicy_level > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🌶".repeat(f.spicy_level) }),
              f.weight_grams && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                "· ",
                f.weight_grams,
                "g"
              ] }),
              f.cooking_time && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                "· ",
                f.cooking_time,
                "dəq"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: (f.badges || []).map((b) => {
              const bo = BADGE_OPTIONS.find((x) => x.v === b);
              return bo && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-1.5 py-0.5 bg-primary/15 text-primary rounded", children: bo.l }, b);
            }) })
          ] })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end p-5 border-t border-border/40 sticky bottom-0 bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "px-4 py-2 border border-border rounded", children: "Ləğv et" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onSave(f), className: "px-6 py-2 bg-gradient-gold text-primary-foreground rounded", children: "Yadda saxla" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.inp { width:100%; padding:.5rem .75rem; background:hsl(var(--background)); border:1px solid hsl(var(--border)); border-radius:.375rem; font-size:.875rem; }` })
  ] }) });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-primary border-b border-border/40 pb-1", children: title }),
    children
  ] });
}
export {
  MenuAdmin as component
};

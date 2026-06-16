import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { i as itemsQ$1, v as varQ, e as extQ, a as upsertVariant, b as upsertExtra, d as deleteVariant, f as deleteExtra } from "./router-Cyx6-Q3j.mjs";
import { a as useSuspenseQuery, b as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { s as Search, k as Plus, t as Save, u as Trash2 } from "../_libs/lucide-react.mjs";
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
import "./client-Cg-358lU.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./auth-middleware-B_zzLJ1T.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function VariantsAdmin() {
  const {
    data: items
  } = useSuspenseQuery(itemsQ$1);
  const {
    data: variants
  } = useSuspenseQuery(varQ);
  const {
    data: extras
  } = useSuspenseQuery(extQ);
  const qc = useQueryClient();
  const [selected, setSelected] = reactExports.useState(items[0]?.id ?? null);
  const [search, setSearch] = reactExports.useState("");
  const filteredItems = reactExports.useMemo(() => items.filter((i) => !search || i.name_az.toLowerCase().includes(search.toLowerCase())), [items, search]);
  const itemVariants = reactExports.useMemo(() => variants.filter((v) => v.item_id === selected), [variants, selected]);
  const itemExtras = reactExports.useMemo(() => extras.filter((e) => e.item_id === selected), [extras, selected]);
  const current = items.find((i) => i.id === selected);
  const refresh = () => {
    qc.invalidateQueries({
      queryKey: ["admin-variants"]
    });
    qc.invalidateQueries({
      queryKey: ["admin-extras"]
    });
  };
  const addVariant = async () => {
    if (!selected) return;
    try {
      await upsertVariant({
        data: {
          item_id: selected,
          name_az: "Yeni variant",
          name_ru: "",
          name_en: "",
          price: 0,
          is_default: false,
          sort_order: itemVariants.length * 10
        }
      });
      refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };
  const addExtra = async () => {
    if (!selected) return;
    try {
      await upsertExtra({
        data: {
          item_id: selected,
          name_az: "Yeni əlavə",
          name_ru: "",
          name_en: "",
          price: 0,
          is_required: false,
          sort_order: itemExtras.length * 10
        }
      });
      refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl mb-1", children: "Variantlar & Əlavələr" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Yeməyə ölçü variantları (S/M/L) və əlavələr (sos, pendir) təyin edin" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[280px_1fr] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "bg-card border border-border/40 rounded-xl p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Axtar...", className: "w-full pl-9 pr-3 py-2 bg-background border border-border rounded text-sm" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[70vh] overflow-auto space-y-1", children: filteredItems.map((it) => {
          const vc = variants.filter((v) => v.item_id === it.id).length;
          const ec = extras.filter((e) => e.item_id === it.id).length;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelected(it.id), className: `w-full text-left px-3 py-2 rounded text-sm transition ${selected === it.id ? "bg-primary/15 text-primary" : "hover:bg-muted/40"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium truncate", children: it.name_az }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              vc,
              " variant · ",
              ec,
              " əlavə"
            ] })
          ] }, it.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "space-y-6", children: current ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl", children: "Variantlar (ölçü, çəki)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: addVariant, className: "flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-gold text-primary-foreground rounded", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              " Variant"
            ] })
          ] }),
          itemVariants.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center", children: "Variant yoxdur (məs: Kiçik 250g — 12₼, Orta 350g — 16₼)" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: itemVariants.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(VariantRow, { v, onChange: refresh }, v.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl", children: "Əlavələr (sos, pendir...)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: addExtra, className: "flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-gold text-primary-foreground rounded", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              " Əlavə"
            ] })
          ] }),
          itemExtras.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center", children: "Əlavə yoxdur (məs: +Mozzarella 2₼, +Sarımsaqlı sos 1.5₼)" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: itemExtras.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(ExtraRow, { e, onChange: refresh }, e.id)) })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border/40 rounded-xl p-12 text-center text-muted-foreground", children: "Sol tərəfdən yemək seçin" }) })
    ] })
  ] });
}
function VariantRow({
  v,
  onChange
}) {
  const [f, setF] = reactExports.useState(v);
  const [dirty, setDirty] = reactExports.useState(false);
  const upd = (k, val) => {
    setF({
      ...f,
      [k]: val
    });
    setDirty(true);
  };
  const save = async () => {
    try {
      await upsertVariant({
        data: {
          id: f.id,
          item_id: f.item_id,
          name_az: f.name_az,
          name_ru: f.name_ru || "",
          name_en: f.name_en || "",
          price: Number(f.price) || 0,
          weight_grams: f.weight_grams ? Number(f.weight_grams) : null,
          is_default: !!f.is_default,
          sort_order: Number(f.sort_order) || 0
        }
      });
      setDirty(false);
      onChange();
      toast.success("Saxlanıldı");
    } catch (e) {
      toast.error(e.message);
    }
  };
  const del = async () => {
    if (!confirm("Silinsin?")) return;
    await deleteVariant({
      data: {
        id: f.id
      }
    });
    onChange();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_1fr_80px_70px_auto] gap-2 items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: f.name_az, onChange: (e) => upd("name_az", e.target.value), placeholder: "AZ ad", className: "inp-r" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: f.name_ru || "", onChange: (e) => upd("name_ru", e.target.value), placeholder: "RU", className: "inp-r" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: f.price, onChange: (e) => upd("price", e.target.value), placeholder: "₼", className: "inp-r" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: f.weight_grams || "", onChange: (e) => upd("weight_grams", e.target.value), placeholder: "g", className: "inp-r" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1 text-xs px-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: f.is_default, onChange: (e) => upd("is_default", e.target.checked) }),
        " def"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: save, disabled: !dirty, className: "p-2 rounded bg-primary/10 text-primary disabled:opacity-30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: del, className: "p-2 rounded hover:bg-destructive/10 text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.inp-r { padding:.4rem .5rem; background:hsl(var(--background)); border:1px solid hsl(var(--border)); border-radius:.25rem; font-size:.8rem; }` })
  ] });
}
function ExtraRow({
  e: ex,
  onChange
}) {
  const [f, setF] = reactExports.useState(ex);
  const [dirty, setDirty] = reactExports.useState(false);
  const upd = (k, val) => {
    setF({
      ...f,
      [k]: val
    });
    setDirty(true);
  };
  const save = async () => {
    try {
      await upsertExtra({
        data: {
          id: f.id,
          item_id: f.item_id,
          name_az: f.name_az,
          name_ru: f.name_ru || "",
          name_en: f.name_en || "",
          price: Number(f.price) || 0,
          is_required: !!f.is_required,
          sort_order: Number(f.sort_order) || 0
        }
      });
      setDirty(false);
      onChange();
      toast.success("Saxlanıldı");
    } catch (e) {
      toast.error(e.message);
    }
  };
  const del = async () => {
    if (!confirm("Silinsin?")) return;
    await deleteExtra({
      data: {
        id: f.id
      }
    });
    onChange();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_1fr_80px_auto] gap-2 items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: f.name_az, onChange: (e) => upd("name_az", e.target.value), placeholder: "AZ ad", className: "inp-r" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: f.name_ru || "", onChange: (e) => upd("name_ru", e.target.value), placeholder: "RU", className: "inp-r" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: f.price, onChange: (e) => upd("price", e.target.value), placeholder: "₼", className: "inp-r" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1 text-xs px-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: f.is_required, onChange: (e) => upd("is_required", e.target.checked) }),
        " məcb."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: save, disabled: !dirty, className: "p-2 rounded bg-primary/10 text-primary disabled:opacity-30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: del, className: "p-2 rounded hover:bg-destructive/10 text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.inp-r { padding:.4rem .5rem; background:hsl(var(--background)); border:1px solid hsl(var(--border)); border-radius:.25rem; font-size:.8rem; }` })
  ] });
}
export {
  VariantsAdmin as component
};

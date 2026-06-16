import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as tplQ, h as catQ, j as deleteTemplate, k as upsertTemplate, l as getTemplateCategories, m as setTemplateCategories } from "./router-Cyx6-Q3j.mjs";
import { a as useSuspenseQuery, b as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { k as Plus, c as Star, v as Pencil, u as Trash2, X, w as Check } from "../_libs/lucide-react.mjs";
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
function TemplatesAdmin() {
  const {
    data: templates
  } = useSuspenseQuery(tplQ);
  const {
    data: cats
  } = useSuspenseQuery(catQ);
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const [assigning, setAssigning] = reactExports.useState(null);
  const save = async (f) => {
    try {
      await upsertTemplate({
        data: {
          id: f.id,
          name: f.name || "Şablon",
          description: f.description || "",
          is_default: f.is_default ?? false,
          lang_default: f.lang_default || "az",
          accent_color: f.accent_color || "#8B6914",
          show_prices: f.show_prices ?? true
        }
      });
      toast.success("Yaddaşa yazıldı");
      setEditing(null);
      qc.invalidateQueries({
        queryKey: ["admin-templates"]
      });
    } catch (e) {
      toast.error(e.message);
    }
  };
  const remove = async (t) => {
    if (t.is_default) {
      toast.error("Default şablonu silmək olmaz");
      return;
    }
    if (!confirm(`"${t.name}" silinsin?`)) return;
    await deleteTemplate({
      data: {
        id: t.id
      }
    });
    qc.invalidateQueries({
      queryKey: ["admin-templates"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl", children: "Menyu Şablonları" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
          templates.length,
          " şablon · Hər masaya fərqli şablon təyin edə bilərsiniz"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing({
        name: "",
        description: "",
        lang_default: "az",
        accent_color: "#8B6914",
        show_prices: true,
        is_default: false
      }), className: "flex items-center gap-2 px-4 py-2 bg-gradient-gold text-primary-foreground rounded-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Yeni Şablon"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: templates.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg", children: t.name }),
            t.is_default && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-primary fill-primary" })
          ] }),
          t.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: t.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded border border-border/40", style: {
          background: t.accent_color
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground space-y-0.5 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Dil: ",
          t.lang_default?.toUpperCase()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Qiymət: ",
          t.show_prices ? "Göstərilir" : "Gizlədilib"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setAssigning(t), className: "flex-1 px-3 py-1.5 text-xs border border-border rounded", children: "Kateqoriyalar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing(t), className: "p-2 hover:bg-muted rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(t), disabled: t.is_default, className: "p-2 hover:bg-destructive/10 text-destructive rounded disabled:opacity-30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] })
    ] }, t.id)) }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(EditModal, { tpl: editing, onClose: () => setEditing(null), onSave: save }),
    assigning && /* @__PURE__ */ jsxRuntimeExports.jsx(AssignModal, { tpl: assigning, cats, onClose: () => setAssigning(null) })
  ] });
}
function EditModal({
  tpl,
  onClose,
  onSave
}) {
  const [f, setF] = reactExports.useState(tpl);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl p-6 max-w-md w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl", children: f.id ? "Şablon Düzəlt" : "Yeni Şablon" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Ad *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: f.name || "", onChange: (e) => setF({
          ...f,
          name: e.target.value
        }), className: "inp", placeholder: "məs: Bar Menyusu" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "İzah" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 2, value: f.description || "", onChange: (e) => setF({
          ...f,
          description: e.target.value
        }), className: "inp" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Default Dil" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: f.lang_default || "az", onChange: (e) => setF({
            ...f,
            lang_default: e.target.value
          }), className: "inp", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "az", children: "AZ" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ru", children: "RU" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "en", children: "EN" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Aksent rəng" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value: f.accent_color || "#8B6914", onChange: (e) => setF({
            ...f,
            accent_color: e.target.value
          }), className: "inp h-10" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between p-3 bg-background border border-border rounded", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Qiymətləri göstər" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: f.show_prices ?? true, onChange: (e) => setF({
          ...f,
          show_prices: e.target.checked
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between p-3 bg-background border border-border rounded", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Default şablon (yeni masalar üçün)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: f.is_default ?? false, onChange: (e) => setF({
          ...f,
          is_default: e.target.checked
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-6 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "px-4 py-2 border border-border rounded", children: "Ləğv" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onSave(f), className: "px-4 py-2 bg-gradient-gold text-primary-foreground rounded", children: "Yadda saxla" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.inp { width:100%; padding:.5rem .75rem; background:hsl(var(--background)); border:1px solid hsl(var(--border)); border-radius:.375rem; font-size:.875rem; }` })
  ] }) });
}
function AssignModal({
  tpl,
  cats,
  onClose
}) {
  const qc = useQueryClient();
  const {
    data: assigned
  } = useQuery({
    queryKey: ["template-cats", tpl.id],
    queryFn: () => getTemplateCategories({
      data: {
        templateId: tpl.id
      }
    })
  });
  const [picked, setPicked] = reactExports.useState(null);
  const current = picked ?? new Set((assigned ?? []).filter((a) => a.is_visible).map((a) => a.category_id));
  const toggle = (id) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPicked(next);
  };
  const save = async () => {
    try {
      const rows = cats.filter((c) => current.has(c.id)).map((c, i) => ({
        category_id: c.id,
        sort_order: i * 10,
        is_visible: true
      }));
      await setTemplateCategories({
        data: {
          templateId: tpl.id,
          categories: rows
        }
      });
      toast.success("Saxlanıldı");
      qc.invalidateQueries({
        queryKey: ["template-cats", tpl.id]
      });
      onClose();
    } catch (e) {
      toast.error(e.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl", children: [
          tpl.name,
          " — Kateqoriyalar"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Bu şablon hansı kateqoriyaları göstərsin?" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: cats.map((c) => {
      const on = current.has(c.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => toggle(c.id), className: `w-full flex items-center justify-between p-3 rounded border transition ${on ? "border-primary bg-primary/10" : "border-border"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", children: [
          c.icon,
          " ",
          c.name_az
        ] }),
        on && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-primary" })
      ] }, c.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-6 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "px-4 py-2 border border-border rounded", children: "Ləğv" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: save, className: "px-4 py-2 bg-gradient-gold text-primary-foreground rounded", children: "Yadda saxla" })
    ] })
  ] }) });
}
export {
  TemplatesAdmin as component
};

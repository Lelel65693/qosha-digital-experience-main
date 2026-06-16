import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { p as q$4, r as deleteReview, w as upsertReview } from "./router-Cyx6-Q3j.mjs";
import { a as useSuspenseQuery, b as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { k as Plus, c as Star, v as Pencil, u as Trash2, X } from "../_libs/lucide-react.mjs";
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
const SOURCES = [{
  v: "manual",
  l: "📝 Əl ilə"
}, {
  v: "google",
  l: "🔵 Google"
}, {
  v: "tripadvisor",
  l: "🦉 TripAdvisor"
}, {
  v: "instagram",
  l: "📷 Instagram"
}, {
  v: "facebook",
  l: "📘 Facebook"
}];
function ReviewsAdmin() {
  const {
    data: items
  } = useSuspenseQuery(q$4);
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const [filter, setFilter] = reactExports.useState("all");
  const refresh = () => {
    qc.invalidateQueries({
      queryKey: ["admin-reviews"]
    });
    qc.invalidateQueries({
      queryKey: ["reviews"]
    });
  };
  const save = async (f) => {
    try {
      await upsertReview({
        data: {
          id: f.id,
          author_name: f.author_name || "",
          author_avatar: f.author_avatar || null,
          content: f.content || "",
          content_az: f.content_az || "",
          content_ru: f.content_ru || "",
          content_en: f.content_en || "",
          rating: Number(f.rating) || 5,
          status: f.status || "approved",
          is_featured: f.is_featured ?? false,
          source: f.source || "manual",
          review_date: f.review_date || void 0
        }
      });
      toast.success("Yaddaşa yazıldı");
      setEditing(null);
      refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };
  const remove = async (id) => {
    if (!confirm("Silinsin?")) return;
    await deleteReview({
      data: {
        id
      }
    });
    refresh();
  };
  const visible = items.filter((r) => filter === "all" || r.status === filter);
  const counts = {
    all: items.length,
    pending: items.filter((r) => r.status === "pending").length,
    approved: items.filter((r) => r.status === "approved").length,
    rejected: items.filter((r) => r.status === "rejected").length
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl", children: "Rəylər" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
          visible.length,
          " / ",
          items.length,
          " rəy"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing({
        rating: 5,
        status: "approved",
        source: "manual"
      }), className: "flex items-center gap-2 px-4 py-2 bg-gradient-gold text-primary-foreground rounded-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Yeni"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border/40 rounded-xl p-3 mb-4 inline-flex border-border rounded overflow-hidden text-xs", children: ["all", "pending", "approved", "rejected"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setFilter(s), className: `px-3 py-2 ${filter === s ? "bg-primary text-primary-foreground" : ""}`, children: [
      s === "all" ? "Hamısı" : s === "pending" ? "Gözləyən" : s === "approved" ? "Təsdiq" : "Rədd",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 opacity-60", children: [
        "(",
        counts[s],
        ")"
      ] })
    ] }, s)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-4", children: visible.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          r.author_avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: r.author_avatar, className: "w-10 h-10 rounded-full object-cover", alt: "" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm", children: r.author_name?.[0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium flex items-center gap-2", children: [
              r.author_name,
              r.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-primary text-primary" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
                "★".repeat(r.rating),
                "☆".repeat(5 - r.rating)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: SOURCES.find((s) => s.v === r.source)?.l ?? r.source })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded ${r.status === "approved" ? "bg-primary/15 text-primary" : r.status === "pending" ? "bg-yellow-500/15 text-yellow-600" : "bg-muted text-muted-foreground"}`, children: r.status })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80 line-clamp-3 mb-3", children: r.content }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing(r), className: "p-2 hover:bg-muted rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(r.id), className: "p-2 hover:bg-destructive/10 text-destructive rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] })
    ] }, r.id)) }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewModal, { item: editing, onClose: () => setEditing(null), onSave: save })
  ] });
}
function ReviewModal({
  item,
  onClose,
  onSave
}) {
  const [f, setF] = reactExports.useState(item);
  const [tab, setTab] = reactExports.useState("main");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl p-6 max-w-lg w-full max-h-[95vh] overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl", children: f.id ? "Redaktə" : "Yeni rəy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { label: "Müəllif adı", value: f.author_name || "", onChange: (v) => setF({
        ...f,
        author_name: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { label: "Avatar URL", value: f.author_avatar || "", onChange: (v) => setF({
        ...f,
        author_avatar: v
      }), placeholder: "https://..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Ulduz" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: f.rating || 5, onChange: (e) => setF({
            ...f,
            rating: Number(e.target.value)
          }), className: "w-full px-3 py-2 bg-background border border-border rounded text-sm", children: [5, 4, 3, 2, 1].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: n, children: "★".repeat(n) }, n)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: f.status || "approved", onChange: (e) => setF({
            ...f,
            status: e.target.value
          }), className: "w-full px-3 py-2 bg-background border border-border rounded text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: "Gözləyən" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "approved", children: "Təsdiq" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "rejected", children: "Rədd" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Mənbə" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: f.source || "manual", onChange: (e) => setF({
            ...f,
            source: e.target.value
          }), className: "w-full px-3 py-2 bg-background border border-border rounded text-sm", children: SOURCES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.v, children: s.l }, s.v)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { label: "Rəy tarixi", type: "date", value: f.review_date || "", onChange: (v) => setF({
        ...f,
        review_date: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mt-2", children: ["main", "az", "ru", "en"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setTab(t), className: `px-3 py-1 text-xs rounded ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted"}`, children: t === "main" ? "Əsas" : t.toUpperCase() }, t)) }),
      tab === "main" && /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { placeholder: "Rəy mətni (orijinal)", rows: 4, value: f.content || "", onChange: (e) => setF({
        ...f,
        content: e.target.value
      }), className: "w-full px-3 py-2 bg-background border border-border rounded text-sm" }),
      tab === "az" && /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { placeholder: "AZ tərcümə", rows: 4, value: f.content_az || "", onChange: (e) => setF({
        ...f,
        content_az: e.target.value
      }), className: "w-full px-3 py-2 bg-background border border-border rounded text-sm" }),
      tab === "ru" && /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { placeholder: "RU тарcümə", rows: 4, value: f.content_ru || "", onChange: (e) => setF({
        ...f,
        content_ru: e.target.value
      }), className: "w-full px-3 py-2 bg-background border border-border rounded text-sm" }),
      tab === "en" && /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { placeholder: "EN translation", rows: 4, value: f.content_en || "", onChange: (e) => setF({
        ...f,
        content_en: e.target.value
      }), className: "w-full px-3 py-2 bg-background border border-border rounded text-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: f.is_featured ?? false, onChange: (e) => setF({
          ...f,
          is_featured: e.target.checked
        }) }),
        "Önə çıxar (ana səhifədə)"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-6 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "px-4 py-2 border border-border rounded", children: "Ləğv" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onSave(f), className: "px-4 py-2 bg-gradient-gold text-primary-foreground rounded", children: "Yadda saxla" })
    ] })
  ] }) });
}
function Inp({
  label,
  value,
  onChange,
  type = "text",
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, onChange: (e) => onChange(e.target.value), placeholder, className: "w-full px-3 py-2 bg-background border border-border rounded text-sm" })
  ] });
}
export {
  ReviewsAdmin as component
};

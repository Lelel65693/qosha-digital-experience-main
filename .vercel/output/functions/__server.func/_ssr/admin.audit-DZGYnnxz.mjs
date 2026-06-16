import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as q } from "./router-Cyx6-Q3j.mjs";
import { a as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
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
const ACTION_LABEL = {
  create: "✨ Yaratdı",
  update: "✏️ Düzəltdi",
  delete: "🗑️ Sildi",
  bulk_create: "📦 Topluca yaratdı"
};
const ENTITY_LABEL = {
  menu_items: "Yemək",
  menu_categories: "Kateqoriya",
  menu_templates: "Şablon",
  restaurant_tables: "Masa",
  reviews: "Rəy",
  gallery: "Qalereya"
};
function AuditPage() {
  const {
    data: logs
  } = useSuspenseQuery(q);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl mb-1", children: "Audit Jurnalı" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Son 200 admin əməliyyatı" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border/40 rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Vaxt" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Əməliyyat" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Obyekt" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Detallar" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        logs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "p-6 text-center text-muted-foreground", children: "Hələ qeyd yoxdur" }) }),
        logs.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/40 hover:bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-xs text-muted-foreground whitespace-nowrap", children: new Date(l.created_at).toLocaleString("az-AZ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: ACTION_LABEL[l.action] || l.action }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: ENTITY_LABEL[l.entity] || l.entity }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-xs text-muted-foreground", children: l.details && Object.keys(l.details).length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-[10px]", children: JSON.stringify(l.details) }) : "—" })
        ] }, l.id))
      ] })
    ] }) })
  ] });
}
export {
  AuditPage as component
};

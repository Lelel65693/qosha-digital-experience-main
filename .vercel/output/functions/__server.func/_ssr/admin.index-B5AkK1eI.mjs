import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as statsQuery } from "./router-Cyx6-Q3j.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { T as TrendingUp, j as Clock, U as UtensilsCrossed, k as Plus, c as Star, b as CalendarDays } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
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
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function Dashboard() {
  const {
    data
  } = useSuspenseQuery(statsQuery);
  const cards = [{
    label: "Bu ay rezervasiya",
    value: data.monthReservations,
    icon: TrendingUp,
    color: "text-emerald-500",
    to: "/admin/reservations"
  }, {
    label: "Gözləyən rəylər",
    value: data.pendingReviews,
    icon: Clock,
    color: "text-amber-500",
    to: "/admin/reviews",
    highlight: data.pendingReviews > 0
  }, {
    label: "Aktiv yeməklər",
    value: data.menuCount,
    icon: UtensilsCrossed,
    color: "text-primary",
    to: "/admin/menu"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl mb-1", children: "İdarə Paneli" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Restoranın xülasəsi" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: c.to, className: `bg-card border rounded-xl p-5 hover:border-primary/40 transition ${c.highlight ? "border-amber-500/40 bg-amber-500/5" : "border-border/40"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: `h-6 w-6 mb-3 ${c.color}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-display", children: c.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1", children: c.label })
    ] }, c.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuickBtn, { to: "/admin/menu", icon: Plus, label: "Yeni Məhsul" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuickBtn, { to: "/admin/reviews", icon: Star, label: "Rəyləri Bax" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4 text-primary" }),
            " Son Rezervasiyalar"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/reservations", className: "text-xs text-primary hover:underline", children: "Hamısı →" })
        ] }),
        data.recentReservations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "Hələ rezervasiya yoxdur" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: data.recentReservations.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 hover:bg-muted/30 rounded", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium", children: [
              r.name,
              " · ",
              r.guests,
              " nəfər"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              r.reservation_date,
              " · ",
              r.reservation_time
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded ${r.status === "confirmed" ? "bg-green-500/15 text-green-600" : r.status === "pending" ? "bg-yellow-500/15 text-yellow-600" : "bg-muted text-muted-foreground"}`, children: r.status })
        ] }, r.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-amber-500" }),
            " Gözləyən Rəylər"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/reviews", className: "text-xs text-primary hover:underline", children: "Hamısı →" })
        ] }),
        data.recentPendingReviews.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "Bütün rəylər nəzərdən keçirilib ✓" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: data.recentPendingReviews.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-muted/30 rounded", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: r.author_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-amber-500", children: "★".repeat(r.rating) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: r.content })
        ] }, r.id)) })
      ] })
    ] })
  ] });
}
function QuickBtn({
  to,
  icon: Icon,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "flex items-center gap-2 px-4 py-2 bg-card border border-border/40 rounded-md text-sm hover:border-primary/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }),
    " ",
    label
  ] });
}
export {
  Dashboard as component
};

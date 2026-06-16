import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, e as useRouterState, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { supabase } from "./client-Cg-358lU.mjs";
import { C as ChevronRight, a as ChevronLeft, L as LayoutDashboard, U as UtensilsCrossed, F as FolderTree, S as SlidersHorizontal, b as CalendarDays, c as Star, I as Image, d as ScrollText, e as Settings, f as LogOut } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
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
const NAV = [{
  to: "/admin",
  label: "Panel",
  icon: LayoutDashboard,
  exact: true
}, {
  to: "/admin/menu",
  label: "Menyu",
  icon: UtensilsCrossed
}, {
  to: "/admin/categories",
  label: "Kateqoriyalar",
  icon: FolderTree
}, {
  to: "/admin/variants",
  label: "Variantlar / Əlavələr",
  icon: SlidersHorizontal
}, {
  to: "/admin/reservations",
  label: "Rezervasiyalar",
  icon: CalendarDays
}, {
  to: "/admin/reviews",
  label: "Rəylər",
  icon: Star
}, {
  to: "/admin/gallery",
  label: "Qalereya",
  icon: Image
}, {
  to: "/admin/audit",
  label: "Audit Jurnalı",
  icon: ScrollText
}, {
  to: "/admin/settings",
  label: "Tənzimləmələr",
  icon: Settings
}];
function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({
    select: (s) => s.location.pathname
  });
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const logout = async () => {
    await supabase.auth.signOut();
    navigate({
      to: "/login",
      replace: true
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: `flex flex-col border-r border-border/40 bg-card/40 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-border/40 flex items-center justify-between gap-2", children: [
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-display text-lg text-gradient-gold truncate", children: "Qoşa Qala" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCollapsed((c) => !c), className: "ml-auto flex-shrink-0 p-1.5 rounded-md hover:bg-muted/40 text-muted-foreground transition", title: collapsed ? "Menyunu aç" : "Menyunu bağla", children: collapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 p-2 space-y-1 overflow-hidden", children: NAV.map((n) => {
        const active = n.exact ? path === n.to : path.startsWith(n.to);
        const Icon = n.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: n.to, title: collapsed ? n.label : void 0, className: `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${active ? "bg-primary/15 text-primary" : "text-foreground/70 hover:bg-muted/40"} ${collapsed ? "justify-center" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 flex-shrink-0" }),
          !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: n.label })
        ] }, n.to);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: logout, title: collapsed ? "Çıxış" : void 0, className: `m-2 flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground/70 hover:bg-muted/40 border border-border/40 transition ${collapsed ? "justify-center" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4 flex-shrink-0" }),
        !collapsed && "Çıxış"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}
export {
  AdminLayout as component
};

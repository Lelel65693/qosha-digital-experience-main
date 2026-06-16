import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/restaurant.functions";
import { useState } from "react";
import {
  LayoutDashboard, UtensilsCrossed, Star, CalendarDays, Image as ImageIcon, LogOut,
  FolderTree, Settings, SlidersHorizontal, ScrollText, ChevronLeft, ChevronRight, Menu,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw redirect({ to: "/login" });
    try {
      const res = await checkIsAdmin();
      if (!res.isAdmin) throw redirect({ to: "/login" });
    } catch (e) {
      if ((e as any)?.isRedirect) throw e;
      try { await supabase.auth.signOut(); } catch {}
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Qoşa Qala — Admin Paneli" },
      { property: "og:title", content: "Qoşa Qala — Admin Paneli" },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Panel", icon: LayoutDashboard, exact: true },
  { to: "/admin/menu", label: "Menyu", icon: UtensilsCrossed },
  { to: "/admin/categories", label: "Kateqoriyalar", icon: FolderTree },
  { to: "/admin/variants", label: "Variantlar / Əlavələr", icon: SlidersHorizontal },
  { to: "/admin/reservations", label: "Rezervasiyalar", icon: CalendarDays },
  { to: "/admin/reviews", label: "Rəylər", icon: Star },
  { to: "/admin/gallery", label: "Qalereya", icon: ImageIcon },
  { to: "/admin/audit", label: "Audit Jurnalı", icon: ScrollText },
  { to: "/admin/settings", label: "Tənzimləmələr", icon: Settings },
];

function AdminLayout() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-border/40 bg-card/40 transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Logo + toggle */}
        <div className="p-3 border-b border-border/40 flex items-center justify-between gap-2">
          {!collapsed && (
            <Link to="/" className="font-display text-lg text-gradient-gold truncate">
              Qoşa Qala
            </Link>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="ml-auto flex-shrink-0 p-1.5 rounded-md hover:bg-muted/40 text-muted-foreground transition"
            title={collapsed ? "Menyunu aç" : "Menyunu bağla"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-2 space-y-1 overflow-hidden">
          {NAV.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to as any}
                title={collapsed ? n.label : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                  active ? "bg-primary/15 text-primary" : "text-foreground/70 hover:bg-muted/40"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span className="truncate">{n.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          title={collapsed ? "Çıxış" : undefined}
          className={`m-2 flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground/70 hover:bg-muted/40 border border-border/40 transition ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && "Çıxış"}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

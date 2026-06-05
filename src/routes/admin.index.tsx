import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getAdminStats } from "@/lib/restaurant.functions";
import { UtensilsCrossed, Star, QrCode, CalendarDays, TrendingUp, Clock, Plus } from "lucide-react";

const statsQuery = queryOptions({ queryKey: ["admin-stats"], queryFn: () => getAdminStats() });

export const Route = createFileRoute("/admin/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(statsQuery),
  component: Dashboard,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
});

function Dashboard() {
  const { data } = useSuspenseQuery(statsQuery);

  const cards = [
    { label: "Bu ay rezervasiya", value: data.monthReservations, icon: TrendingUp, color: "text-emerald-500", to: "/admin/reservations" },
    { label: "Gözləyən rəylər", value: data.pendingReviews, icon: Clock, color: "text-amber-500", to: "/admin/reviews", highlight: data.pendingReviews > 0 },
    { label: "Aktiv yeməklər", value: data.menuCount, icon: UtensilsCrossed, color: "text-primary", to: "/admin/menu" },
    { label: "QR Kod (aktiv)", value: 1, icon: QrCode, color: "text-blue-500", to: "/admin/tables" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-display text-3xl mb-1">İdarə Paneli</h1>
        <p className="text-muted-foreground">Restoranın xülasəsi</p>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to as any}
            className={`bg-card border rounded-xl p-5 hover:border-primary/40 transition ${c.highlight ? "border-amber-500/40 bg-amber-500/5" : "border-border/40"}`}>
            <c.icon className={`h-6 w-6 mb-3 ${c.color}`} />
            <div className="text-3xl font-display">{c.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{c.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <QuickBtn to="/admin/menu" icon={Plus} label="Yeni Məhsul" />
        <QuickBtn to="/admin/reviews" icon={Star} label="Rəyləri Bax" />
        <QuickBtn to="/admin/tables" icon={QrCode} label="QR Kod İdarəet" />
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent reservations */}
        <div className="bg-card border border-border/40 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-lg flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> Son Rezervasiyalar</h2>
            <Link to="/admin/reservations" className="text-xs text-primary hover:underline">Hamısı →</Link>
          </div>
          {data.recentReservations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Hələ rezervasiya yoxdur</p>
          ) : (
            <div className="space-y-2">
              {data.recentReservations.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded">
                  <div>
                    <div className="text-sm font-medium">{r.name} · {r.guests} nəfər</div>
                    <div className="text-xs text-muted-foreground">{r.reservation_date} · {r.reservation_time}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    r.status === "confirmed" ? "bg-green-500/15 text-green-600" :
                    r.status === "pending" ? "bg-yellow-500/15 text-yellow-600" : "bg-muted text-muted-foreground"
                  }`}>{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending reviews */}
        <div className="bg-card border border-border/40 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-lg flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" /> Gözləyən Rəylər</h2>
            <Link to="/admin/reviews" className="text-xs text-primary hover:underline">Hamısı →</Link>
          </div>
          {data.recentPendingReviews.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Bütün rəylər nəzərdən keçirilib ✓</p>
          ) : (
            <div className="space-y-3">
              {data.recentPendingReviews.map((r: any) => (
                <div key={r.id} className="p-3 bg-muted/30 rounded">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium">{r.author_name}</span>
                    <span className="text-xs text-amber-500">{"★".repeat(r.rating)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{r.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickBtn({ to, icon: Icon, label }: any) {
  return (
    <Link to={to} className="flex items-center gap-2 px-4 py-2 bg-card border border-border/40 rounded-md text-sm hover:border-primary/40">
      <Icon className="h-4 w-4 text-primary" /> {label}
    </Link>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getAuditLog } from "@/lib/restaurant.functions";

const q = queryOptions({ queryKey: ["admin-audit"], queryFn: () => getAuditLog() });

export const Route = createFileRoute("/admin/audit")({
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  component: AuditPage,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
});

const ACTION_LABEL: Record<string, string> = {
  create: "✨ Yaratdı", update: "✏️ Düzəltdi", delete: "🗑️ Sildi",
  bulk_create: "📦 Topluca yaratdı",
};
const ENTITY_LABEL: Record<string, string> = {
  menu_items: "Yemək", menu_categories: "Kateqoriya", menu_templates: "Şablon",
  restaurant_tables: "Masa", reviews: "Rəy", gallery: "Qalereya",
};

function AuditPage() {
  const { data: logs } = useSuspenseQuery(q);
  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-1">Audit Jurnalı</h1>
      <p className="text-muted-foreground mb-6">Son 200 admin əməliyyatı</p>
      <div className="bg-card border border-border/40 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-left">
            <tr>
              <th className="p-3">Vaxt</th>
              <th className="p-3">Əməliyyat</th>
              <th className="p-3">Obyekt</th>
              <th className="p-3">Detallar</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Hələ qeyd yoxdur</td></tr>
            )}
            {logs.map((l) => (
              <tr key={l.id} className="border-t border-border/40 hover:bg-muted/20">
                <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(l.created_at).toLocaleString("az-AZ")}
                </td>
                <td className="p-3">{ACTION_LABEL[l.action] || l.action}</td>
                <td className="p-3">{ENTITY_LABEL[l.entity] || l.entity}</td>
                <td className="p-3 text-xs text-muted-foreground">
                  {l.details && Object.keys(l.details as object).length > 0
                    ? <code className="text-[10px]">{JSON.stringify(l.details)}</code>
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

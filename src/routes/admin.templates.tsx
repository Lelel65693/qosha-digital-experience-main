import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Star } from "lucide-react";
import {
  getTemplates, getMenuCategories, upsertTemplate, deleteTemplate,
  getTemplateCategories, setTemplateCategories,
} from "@/lib/restaurant.functions";
import { toast } from "sonner";

const tplQ = queryOptions({ queryKey: ["admin-templates"], queryFn: () => getTemplates() });
const catQ = queryOptions({ queryKey: ["admin-categories"], queryFn: () => getMenuCategories() });

export const Route = createFileRoute("/admin/templates")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(tplQ),
      context.queryClient.ensureQueryData(catQ),
    ]);
  },
  component: TemplatesAdmin,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
});

type Tpl = Awaited<ReturnType<typeof getTemplates>>[number];

function TemplatesAdmin() {
  const { data: templates } = useSuspenseQuery(tplQ);
  const { data: cats } = useSuspenseQuery(catQ);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Tpl> | null>(null);
  const [assigning, setAssigning] = useState<Tpl | null>(null);

  const save = async (f: Partial<Tpl>) => {
    try {
      await upsertTemplate({
        data: {
          id: f.id,
          name: f.name || "Şablon",
          description: f.description || "",
          is_default: f.is_default ?? false,
          lang_default: (f.lang_default as any) || "az",
          accent_color: f.accent_color || "#8B6914",
          show_prices: f.show_prices ?? true,
        },
      });
      toast.success("Yaddaşa yazıldı");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-templates"] });
    } catch (e: any) { toast.error(e.message); }
  };

  const remove = async (t: Tpl) => {
    if (t.is_default) { toast.error("Default şablonu silmək olmaz"); return; }
    if (!confirm(`"${t.name}" silinsin?`)) return;
    await deleteTemplate({ data: { id: t.id } });
    qc.invalidateQueries({ queryKey: ["admin-templates"] });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-3xl">Menyu Şablonları</h1>
          <p className="text-muted-foreground">{templates.length} şablon · Hər masaya fərqli şablon təyin edə bilərsiniz</p>
        </div>
        <button onClick={() => setEditing({ name: "", description: "", lang_default: "az", accent_color: "#8B6914", show_prices: true, is_default: false })}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-gold text-primary-foreground rounded-md">
          <Plus className="h-4 w-4" /> Yeni Şablon
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div key={t.id} className="bg-card border border-border/40 rounded-xl p-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg">{t.name}</h3>
                  {t.is_default && <Star className="h-4 w-4 text-primary fill-primary" />}
                </div>
                {t.description && <p className="text-xs text-muted-foreground mt-1">{t.description}</p>}
              </div>
              <div className="w-6 h-6 rounded border border-border/40" style={{ background: t.accent_color }} />
            </div>
            <div className="text-xs text-muted-foreground space-y-0.5 mb-3">
              <div>Dil: {t.lang_default?.toUpperCase()}</div>
              <div>Qiymət: {t.show_prices ? "Göstərilir" : "Gizlədilib"}</div>
            </div>
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setAssigning(t)} className="flex-1 px-3 py-1.5 text-xs border border-border rounded">Kateqoriyalar</button>
              <button onClick={() => setEditing(t)} className="p-2 hover:bg-muted rounded"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(t)} disabled={t.is_default} className="p-2 hover:bg-destructive/10 text-destructive rounded disabled:opacity-30">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && <EditModal tpl={editing} onClose={() => setEditing(null)} onSave={save} />}
      {assigning && <AssignModal tpl={assigning} cats={cats} onClose={() => setAssigning(null)} />}
    </div>
  );
}

function EditModal({ tpl, onClose, onSave }: { tpl: Partial<Tpl>; onClose: () => void; onSave: (t: Partial<Tpl>) => void }) {
  const [f, setF] = useState<any>(tpl);
  return (
    <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border/40 rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl">{f.id ? "Şablon Düzəlt" : "Yeni Şablon"}</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Ad *</label>
            <input value={f.name || ""} onChange={(e) => setF({ ...f, name: e.target.value })} className="inp" placeholder="məs: Bar Menyusu" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">İzah</label>
            <textarea rows={2} value={f.description || ""} onChange={(e) => setF({ ...f, description: e.target.value })} className="inp" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Default Dil</label>
              <select value={f.lang_default || "az"} onChange={(e) => setF({ ...f, lang_default: e.target.value })} className="inp">
                <option value="az">AZ</option><option value="ru">RU</option><option value="en">EN</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Aksent rəng</label>
              <input type="color" value={f.accent_color || "#8B6914"} onChange={(e) => setF({ ...f, accent_color: e.target.value })} className="inp h-10" />
            </div>
          </div>
          <label className="flex items-center justify-between p-3 bg-background border border-border rounded">
            <span className="text-sm">Qiymətləri göstər</span>
            <input type="checkbox" checked={f.show_prices ?? true} onChange={(e) => setF({ ...f, show_prices: e.target.checked })} />
          </label>
          <label className="flex items-center justify-between p-3 bg-background border border-border rounded">
            <span className="text-sm">Default şablon (yeni masalar üçün)</span>
            <input type="checkbox" checked={f.is_default ?? false} onChange={(e) => setF({ ...f, is_default: e.target.checked })} />
          </label>
        </div>
        <div className="flex gap-2 mt-6 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-border rounded">Ləğv</button>
          <button onClick={() => onSave(f)} className="px-4 py-2 bg-gradient-gold text-primary-foreground rounded">Yadda saxla</button>
        </div>
        <style>{`.inp { width:100%; padding:.5rem .75rem; background:hsl(var(--background)); border:1px solid hsl(var(--border)); border-radius:.375rem; font-size:.875rem; }`}</style>
      </div>
    </div>
  );
}

function AssignModal({ tpl, cats, onClose }: { tpl: Tpl; cats: any[]; onClose: () => void }) {
  const qc = useQueryClient();
  const { data: assigned } = useQuery({
    queryKey: ["template-cats", tpl.id],
    queryFn: () => getTemplateCategories({ data: { templateId: tpl.id } }),
  });
  const [picked, setPicked] = useState<Set<string> | null>(null);

  const current = picked ?? new Set((assigned ?? []).filter((a) => a.is_visible).map((a) => a.category_id));

  const toggle = (id: string) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    setPicked(next);
  };

  const save = async () => {
    try {
      const rows = cats
        .filter((c) => current.has(c.id))
        .map((c, i) => ({ category_id: c.id, sort_order: i * 10, is_visible: true }));
      await setTemplateCategories({ data: { templateId: tpl.id, categories: rows } });
      toast.success("Saxlanıldı");
      qc.invalidateQueries({ queryKey: ["template-cats", tpl.id] });
      onClose();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border/40 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-display text-xl">{tpl.name} — Kateqoriyalar</h2>
            <p className="text-xs text-muted-foreground">Bu şablon hansı kateqoriyaları göstərsin?</p>
          </div>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-1">
          {cats.map((c) => {
            const on = current.has(c.id);
            return (
              <button key={c.id} type="button" onClick={() => toggle(c.id)}
                className={`w-full flex items-center justify-between p-3 rounded border transition ${on ? "border-primary bg-primary/10" : "border-border"}`}>
                <span className="text-sm">{c.icon} {c.name_az}</span>
                {on && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 mt-6 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-border rounded">Ləğv</button>
          <button onClick={save} className="px-4 py-2 bg-gradient-gold text-primary-foreground rounded">Yadda saxla</button>
        </div>
      </div>
    </div>
  );
}

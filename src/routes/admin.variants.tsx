import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Plus, Trash2, Save, Search } from "lucide-react";
import {
  getAllMenuItems, getAllVariants, getAllExtras,
  upsertVariant, deleteVariant, upsertExtra, deleteExtra,
} from "@/lib/restaurant.functions";
import { toast } from "sonner";

const itemsQ = queryOptions({ queryKey: ["admin-menu"], queryFn: () => getAllMenuItems() });
const varQ = queryOptions({ queryKey: ["admin-variants"], queryFn: () => getAllVariants() });
const extQ = queryOptions({ queryKey: ["admin-extras"], queryFn: () => getAllExtras() });

export const Route = createFileRoute("/admin/variants")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(itemsQ),
      context.queryClient.ensureQueryData(varQ),
      context.queryClient.ensureQueryData(extQ),
    ]);
  },
  component: VariantsAdmin,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
});

function VariantsAdmin() {
  const { data: items } = useSuspenseQuery(itemsQ);
  const { data: variants } = useSuspenseQuery(varQ);
  const { data: extras } = useSuspenseQuery(extQ);
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string | null>(items[0]?.id ?? null);
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(
    () => items.filter((i) => !search || i.name_az.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const itemVariants = useMemo(() => variants.filter((v) => v.item_id === selected), [variants, selected]);
  const itemExtras = useMemo(() => extras.filter((e) => e.item_id === selected), [extras, selected]);
  const current = items.find((i) => i.id === selected);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-variants"] });
    qc.invalidateQueries({ queryKey: ["admin-extras"] });
  };

  const addVariant = async () => {
    if (!selected) return;
    try {
      await upsertVariant({ data: { item_id: selected, name_az: "Yeni variant", name_ru: "", name_en: "", price: 0, is_default: false, sort_order: itemVariants.length * 10 } });
      refresh();
    } catch (e: any) { toast.error(e.message); }
  };

  const addExtra = async () => {
    if (!selected) return;
    try {
      await upsertExtra({ data: { item_id: selected, name_az: "Yeni əlavə", name_ru: "", name_en: "", price: 0, is_required: false, sort_order: itemExtras.length * 10 } });
      refresh();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl mb-1">Variantlar & Əlavələr</h1>
      <p className="text-muted-foreground mb-6">Yeməyə ölçü variantları (S/M/L) və əlavələr (sos, pendir) təyin edin</p>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <aside className="bg-card border border-border/40 rounded-xl p-3">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Axtar..."
              className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded text-sm" />
          </div>
          <div className="max-h-[70vh] overflow-auto space-y-1">
            {filteredItems.map((it) => {
              const vc = variants.filter((v) => v.item_id === it.id).length;
              const ec = extras.filter((e) => e.item_id === it.id).length;
              return (
                <button key={it.id} onClick={() => setSelected(it.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${selected === it.id ? "bg-primary/15 text-primary" : "hover:bg-muted/40"}`}>
                  <div className="font-medium truncate">{it.name_az}</div>
                  <div className="text-xs text-muted-foreground">{vc} variant · {ec} əlavə</div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="space-y-6">
          {current ? (
            <>
              <div className="bg-card border border-border/40 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-display text-xl">Variantlar (ölçü, çəki)</h2>
                  <button onClick={addVariant} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-gold text-primary-foreground rounded">
                    <Plus className="h-4 w-4" /> Variant
                  </button>
                </div>
                {itemVariants.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">Variant yoxdur (məs: Kiçik 250g — 12₼, Orta 350g — 16₼)</p>
                ) : (
                  <div className="space-y-2">
                    {itemVariants.map((v) => <VariantRow key={v.id} v={v} onChange={refresh} />)}
                  </div>
                )}
              </div>

              <div className="bg-card border border-border/40 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-display text-xl">Əlavələr (sos, pendir...)</h2>
                  <button onClick={addExtra} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-gold text-primary-foreground rounded">
                    <Plus className="h-4 w-4" /> Əlavə
                  </button>
                </div>
                {itemExtras.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">Əlavə yoxdur (məs: +Mozzarella 2₼, +Sarımsaqlı sos 1.5₼)</p>
                ) : (
                  <div className="space-y-2">
                    {itemExtras.map((e) => <ExtraRow key={e.id} e={e} onChange={refresh} />)}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-card border border-border/40 rounded-xl p-12 text-center text-muted-foreground">
              Sol tərəfdən yemək seçin
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function VariantRow({ v, onChange }: { v: any; onChange: () => void }) {
  const [f, setF] = useState(v);
  const [dirty, setDirty] = useState(false);
  const upd = (k: string, val: any) => { setF({ ...f, [k]: val }); setDirty(true); };
  const save = async () => {
    try {
      await upsertVariant({ data: {
        id: f.id, item_id: f.item_id,
        name_az: f.name_az, name_ru: f.name_ru || "", name_en: f.name_en || "",
        price: Number(f.price) || 0, weight_grams: f.weight_grams ? Number(f.weight_grams) : null,
        is_default: !!f.is_default, sort_order: Number(f.sort_order) || 0,
      }});
      setDirty(false); onChange(); toast.success("Saxlanıldı");
    } catch (e: any) { toast.error(e.message); }
  };
  const del = async () => {
    if (!confirm("Silinsin?")) return;
    await deleteVariant({ data: { id: f.id } }); onChange();
  };
  return (
    <div className="grid grid-cols-[1fr_1fr_80px_70px_auto] gap-2 items-center">
      <input value={f.name_az} onChange={(e) => upd("name_az", e.target.value)} placeholder="AZ ad" className="inp-r" />
      <input value={f.name_ru || ""} onChange={(e) => upd("name_ru", e.target.value)} placeholder="RU" className="inp-r" />
      <input type="number" value={f.price} onChange={(e) => upd("price", e.target.value)} placeholder="₼" className="inp-r" />
      <input type="number" value={f.weight_grams || ""} onChange={(e) => upd("weight_grams", e.target.value)} placeholder="g" className="inp-r" />
      <div className="flex gap-1">
        <label className="flex items-center gap-1 text-xs px-2"><input type="checkbox" checked={f.is_default} onChange={(e) => upd("is_default", e.target.checked)} /> def</label>
        <button onClick={save} disabled={!dirty} className="p-2 rounded bg-primary/10 text-primary disabled:opacity-30"><Save className="h-4 w-4" /></button>
        <button onClick={del} className="p-2 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
      </div>
      <style>{`.inp-r { padding:.4rem .5rem; background:hsl(var(--background)); border:1px solid hsl(var(--border)); border-radius:.25rem; font-size:.8rem; }`}</style>
    </div>
  );
}

function ExtraRow({ e: ex, onChange }: { e: any; onChange: () => void }) {
  const [f, setF] = useState(ex);
  const [dirty, setDirty] = useState(false);
  const upd = (k: string, val: any) => { setF({ ...f, [k]: val }); setDirty(true); };
  const save = async () => {
    try {
      await upsertExtra({ data: {
        id: f.id, item_id: f.item_id,
        name_az: f.name_az, name_ru: f.name_ru || "", name_en: f.name_en || "",
        price: Number(f.price) || 0, is_required: !!f.is_required,
        sort_order: Number(f.sort_order) || 0,
      }});
      setDirty(false); onChange(); toast.success("Saxlanıldı");
    } catch (e: any) { toast.error(e.message); }
  };
  const del = async () => {
    if (!confirm("Silinsin?")) return;
    await deleteExtra({ data: { id: f.id } }); onChange();
  };
  return (
    <div className="grid grid-cols-[1fr_1fr_80px_auto] gap-2 items-center">
      <input value={f.name_az} onChange={(e) => upd("name_az", e.target.value)} placeholder="AZ ad" className="inp-r" />
      <input value={f.name_ru || ""} onChange={(e) => upd("name_ru", e.target.value)} placeholder="RU" className="inp-r" />
      <input type="number" value={f.price} onChange={(e) => upd("price", e.target.value)} placeholder="₼" className="inp-r" />
      <div className="flex gap-1">
        <label className="flex items-center gap-1 text-xs px-2"><input type="checkbox" checked={f.is_required} onChange={(e) => upd("is_required", e.target.checked)} /> məcb.</label>
        <button onClick={save} disabled={!dirty} className="p-2 rounded bg-primary/10 text-primary disabled:opacity-30"><Save className="h-4 w-4" /></button>
        <button onClick={del} className="p-2 rounded hover:bg-destructive/10 text-destructive"><Trash2 className="h-4 w-4" /></button>
      </div>
      <style>{`.inp-r { padding:.4rem .5rem; background:hsl(var(--background)); border:1px solid hsl(var(--border)); border-radius:.25rem; font-size:.8rem; }`}</style>
    </div>
  );
}

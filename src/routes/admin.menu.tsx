import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { Plus, Pencil, Trash2, X, Upload, Search, Star, Copy, Power } from "lucide-react";
import { getAllMenuItems, getMenuCategories, upsertMenuItem, deleteMenuItem, toggleMenuItemActive, duplicateMenuItem } from "@/lib/restaurant.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const itemsQ = queryOptions({ queryKey: ["admin-menu"], queryFn: () => getAllMenuItems() });
const catsQ = queryOptions({ queryKey: ["admin-categories"], queryFn: () => getMenuCategories() });

export const Route = createFileRoute("/admin/menu")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(itemsQ),
      context.queryClient.ensureQueryData(catsQ),
    ]);
  },
  component: MenuAdmin,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
});

type Item = Awaited<ReturnType<typeof getAllMenuItems>>[number];

const ALLERGENS = ["gluten","dairy","eggs","nuts","fish","shellfish","soy","sesame","mustard","celery","lupin","molluscs"];
const ALLERGEN_LABEL: Record<string, string> = {
  gluten:"Gluten", dairy:"Süd", eggs:"Yumurta", nuts:"Qoz-fındıq", fish:"Balıq", shellfish:"Xərçəng",
  soy:"Soya", sesame:"Küncüt", mustard:"Xardal", celery:"Selderey", lupin:"Lüpin", molluscs:"Molyusk",
};
const BADGE_OPTIONS = [
  { v: "popular", l: "🔥 Populyar" }, { v: "new", l: "✨ Yeni" }, { v: "vegan", l: "🌱 Vegan" },
  { v: "chef", l: "👨‍🍳 Aşpaz seçimi" }, { v: "premium", l: "🏆 Premium" }, { v: "discount", l: "🎉 Endirim" },
];

function MenuAdmin() {
  const { data: items } = useSuspenseQuery(itemsQ);
  const { data: cats } = useSuspenseQuery(catsQ);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Item> | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "card">("table");
  const [showInactive, setShowInactive] = useState(true);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (filter !== "all" && it.category !== filter) return false;
      if (!showInactive && !it.is_active) return false;
      if (search && !it.name_az.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, filter, search, showInactive]);

  const save = async (form: Partial<Item> & { allergens?: string[]; badges?: string[] }) => {
    try {
      const cat = cats.find((c) => c.slug === form.category);
      await upsertMenuItem({
        data: {
          id: form.id,
          name_az: form.name_az || "",
          name_ru: form.name_ru || "",
          name_en: form.name_en || "",
          desc_az: form.desc_az || "",
          desc_ru: form.desc_ru || "",
          desc_en: form.desc_en || "",
          price: Number(form.price) || 0,
          old_price: form.old_price ? Number(form.old_price) : null,
          category: form.category || cats[0]?.slug || "main-dishes",
          category_id: cat?.id ?? null,
          image_url: form.image_url || null,
          weight_grams: form.weight_grams ? Number(form.weight_grams) : null,
          calories: form.calories ? Number(form.calories) : null,
          cooking_time: form.cooking_time ? Number(form.cooking_time) : null,
          spicy_level: Number(form.spicy_level) || 0,
          allergens: form.allergens ?? [],
          badges: form.badges ?? [],
          is_active: form.is_active ?? true,
          is_featured: form.is_featured ?? false,
          sort_order: Number(form.sort_order) || 0,
        },
      });
      toast.success("Yaddaşa yazıldı");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-menu"] });
      qc.invalidateQueries({ queryKey: ["menu_items"] });
    } catch (e: any) { toast.error(e.message); }
  };

  const remove = async (id: string) => {
    if (!confirm("Silinsin?")) return;
    await deleteMenuItem({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-menu"] });
  };

  const toggleActive = async (id: string, is_active: boolean) => {
    try {
      await toggleMenuItemActive({ data: { id, is_active } });
      qc.invalidateQueries({ queryKey: ["admin-menu"] });
      qc.invalidateQueries({ queryKey: ["menu_items"] });
      toast.success(is_active ? "Aktivləşdirildi" : "Bu gün bitib (deaktiv)");
    } catch (e: any) { toast.error(e.message); }
  };

  const duplicate = async (id: string) => {
    try {
      await duplicateMenuItem({ data: { id } });
      qc.invalidateQueries({ queryKey: ["admin-menu"] });
      toast.success("Surəti çıxarıldı (passiv)");
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-3xl">Menyu İdarəsi</h1>
          <p className="text-muted-foreground">{filtered.length} / {items.length} yemək</p>
        </div>
        <button onClick={() => setEditing({ category: cats[0]?.slug, is_active: true, price: 0, sort_order: 0, spicy_level: 0, allergens: [], badges: [] })}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-gold text-primary-foreground rounded-md">
          <Plus className="h-4 w-4" /> Yeni Məhsul
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-card border border-border/40 rounded-xl p-3 mb-4 flex flex-wrap gap-3 items-center">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 bg-background border border-border rounded text-sm">
          <option value="all">Bütün kateqoriyalar</option>
          {cats.map((c) => <option key={c.id} value={c.slug}>{c.icon} {c.name_az}</option>)}
        </select>
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Axtar..."
            className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded text-sm" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} />
          Passivlər
        </label>
        <div className="flex border border-border rounded overflow-hidden text-xs">
          <button onClick={() => setView("table")} className={`px-3 py-2 ${view === "table" ? "bg-primary text-primary-foreground" : ""}`}>Cədvəl</button>
          <button onClick={() => setView("card")} className={`px-3 py-2 ${view === "card" ? "bg-primary text-primary-foreground" : ""}`}>Kart</button>
        </div>
      </div>

      {view === "table" ? (
        <div className="bg-card border border-border/40 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-left">
              <tr>
                <th className="p-3"></th>
                <th className="p-3">Ad</th>
                <th className="p-3">Kateqoriya</th>
                <th className="p-3">Qiymət</th>
                <th className="p-3">Çəki</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it) => (
                <tr key={it.id} className="border-t border-border/40 hover:bg-muted/20">
                  <td className="p-2">
                    {it.image_url ? <img src={it.image_url} className="w-12 h-12 object-cover rounded" alt="" /> : <div className="w-12 h-12 bg-muted rounded" />}
                  </td>
                  <td className="p-3">
                    <div className="font-medium flex items-center gap-1">
                      {it.is_featured && <Star className="h-3 w-3 text-primary fill-primary" />}
                      {it.name_az}
                    </div>
                    {(it as any).spicy_level > 0 && <span className="text-xs">{"🌶".repeat((it as any).spicy_level)}</span>}
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">{it.category}</td>
                  <td className="p-3">
                    {(it as any).old_price && <span className="line-through text-muted-foreground text-xs mr-1">{(it as any).old_price}</span>}
                    <span className="font-semibold">{it.price} ₼</span>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{(it as any).weight_grams ? `${(it as any).weight_grams}g` : "—"}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${it.is_active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {it.is_active ? "Aktiv" : "Passiv"}
                    </span>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button onClick={() => toggleActive(it.id, !it.is_active)} className={`p-2 rounded ${it.is_active ? "hover:bg-amber-500/10 text-amber-600" : "hover:bg-green-500/10 text-green-600"}`} title={it.is_active ? "Bu gün bitib (86)" : "Aktivləşdir"}>
                      <Power className="h-4 w-4" />
                    </button>
                    <button onClick={() => duplicate(it.id)} className="p-2 hover:bg-muted rounded" title="Surət"><Copy className="h-4 w-4" /></button>
                    <button onClick={() => setEditing(it)} className="p-2 hover:bg-muted rounded"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => remove(it.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((it) => (
            <div key={it.id} className="bg-card border border-border/40 rounded-xl overflow-hidden">
              {it.image_url ? <img src={it.image_url} className="w-full aspect-video object-cover" alt="" /> : <div className="aspect-video bg-muted" />}
              <div className="p-3">
                <div className="font-medium">{it.name_az}</div>
                <div className="text-xs text-muted-foreground mb-2">{it.category} · {it.price} ₼</div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(it)} className="flex-1 px-3 py-1.5 text-xs border border-border rounded">Düzəlt</button>
                  <button onClick={() => remove(it.id)} className="px-3 py-1.5 text-xs border border-destructive/40 text-destructive rounded"><Trash2 className="h-3 w-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <ItemModal item={editing} cats={cats} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function ItemModal({ item, cats, onClose, onSave }: { item: Partial<Item>; cats: any[]; onClose: () => void; onSave: (i: any) => void }) {
  const [f, setF] = useState<any>({
    allergens: [],
    badges: [],
    ...item,
  });
  const [tab, setTab] = useState<"az" | "ru" | "en">("az");
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1600, useWebWorker: true, fileType: "image/webp" });
      const path = `menu/${crypto.randomUUID()}.webp`;
      const { error } = await supabase.storage.from("menu-images").upload(path, compressed, { contentType: "image/webp" });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("menu-images").getPublicUrl(path);
      setF((p: any) => ({ ...p, image_url: pub.publicUrl }));
      toast.success("Şəkil yükləndi");
    } catch (e: any) { toast.error(e.message); }
    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] }, maxSize: 5 * 1024 * 1024, multiple: false,
    onDrop: (files) => files[0] && upload(files[0]),
  });

  const toggleArr = (key: "allergens" | "badges", v: string) => {
    const arr: string[] = f[key] || [];
    setF({ ...f, [key]: arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v] });
  };

  return (
    <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-card border border-border/40 rounded-xl max-w-5xl w-full max-h-[95vh] overflow-auto">
        <div className="flex justify-between items-center p-5 border-b border-border/40 sticky top-0 bg-card z-10">
          <h2 className="font-display text-xl">{f.id ? "Məhsulu Redaktə Et" : "Yeni Məhsul"}</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6 p-6">
          <div className="space-y-6">
            {/* Section 1: Basic */}
            <Section title="1. Əsas Məlumat">
              <div>
                <label className="text-xs text-muted-foreground">Ad</label>
                <div className="flex gap-1 mb-2 mt-1">
                  {(["az","ru","en"] as const).map((l) => (
                    <button key={l} type="button" onClick={() => setTab(l)}
                      className={`px-3 py-1 text-xs rounded ${tab === l ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{l.toUpperCase()}</button>
                  ))}
                </div>
                <input value={f[`name_${tab}`] || ""} onChange={(e) => setF({ ...f, [`name_${tab}`]: e.target.value })}
                  placeholder={`${tab.toUpperCase()} adı`} className="inp" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">İzah ({tab.toUpperCase()})</label>
                <textarea rows={3} value={f[`desc_${tab}`] || ""} onChange={(e) => setF({ ...f, [`desc_${tab}`]: e.target.value })} className="inp" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Kateqoriya</label>
                <select value={f.category || ""} onChange={(e) => setF({ ...f, category: e.target.value })} className="inp">
                  {cats.map((c) => <option key={c.id} value={c.slug}>{c.icon} {c.name_az}</option>)}
                </select>
              </div>
            </Section>

            {/* Section 2: Price */}
            <Section title="2. Qiymət">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Cari Qiymət (₼) *</label>
                  <input type="number" step="0.01" value={f.price ?? 0} onChange={(e) => setF({ ...f, price: Number(e.target.value) })} className="inp" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Köhnə Qiymət (endirim üçün)</label>
                  <input type="number" step="0.01" value={f.old_price ?? ""} onChange={(e) => setF({ ...f, old_price: e.target.value ? Number(e.target.value) : null })} className="inp" />
                </div>
              </div>
            </Section>

            {/* Section 3: Image */}
            <Section title="3. Şəkil">
              <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${isDragActive ? "border-primary bg-primary/5" : "border-border"}`}>
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm">{uploading ? "Yüklənir..." : "Şəkli buraya sürüklə və ya kliklə"}</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP · Max 5MB</p>
              </div>
              {f.image_url && (
                <div className="mt-3 relative">
                  <img src={f.image_url} className="w-full max-h-48 object-cover rounded" alt="" />
                  <button onClick={() => setF({ ...f, image_url: null })} className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <input value={f.image_url || ""} onChange={(e) => setF({ ...f, image_url: e.target.value })}
                placeholder="və ya URL daxil edin" className="inp mt-2 text-xs" />
            </Section>

            {/* Section 4: Physical */}
            <Section title="4. Fiziki Xüsusiyyətlər">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Çəki (g)</label>
                  <input type="number" value={f.weight_grams ?? ""} onChange={(e) => setF({ ...f, weight_grams: e.target.value ? Number(e.target.value) : null })} className="inp" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Kaloriya</label>
                  <input type="number" value={f.calories ?? ""} onChange={(e) => setF({ ...f, calories: e.target.value ? Number(e.target.value) : null })} className="inp" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Vaxt (dəq)</label>
                  <input type="number" value={f.cooking_time ?? ""} onChange={(e) => setF({ ...f, cooking_time: e.target.value ? Number(e.target.value) : null })} className="inp" />
                </div>
              </div>
            </Section>

            {/* Section 5: Spicy */}
            <Section title="5. İstilik Səviyyəsi">
              <div className="flex gap-2">
                {[0,1,2,3].map((n) => (
                  <button key={n} type="button" onClick={() => setF({ ...f, spicy_level: n })}
                    className={`flex-1 py-2 rounded border ${f.spicy_level === n ? "border-primary bg-primary/10" : "border-border"}`}>
                    {n === 0 ? "Yox" : "🌶".repeat(n)}
                  </button>
                ))}
              </div>
            </Section>

            {/* Section 6: Allergens */}
            <Section title="6. Allergenlər">
              <div className="grid grid-cols-3 gap-2">
                {ALLERGENS.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-sm p-2 hover:bg-muted/40 rounded cursor-pointer">
                    <input type="checkbox" checked={(f.allergens || []).includes(a)} onChange={() => toggleArr("allergens", a)} />
                    {ALLERGEN_LABEL[a]}
                  </label>
                ))}
              </div>
            </Section>

            {/* Section 7: Badges */}
            <Section title="7. Etiketlər">
              <div className="grid grid-cols-2 gap-2">
                {BADGE_OPTIONS.map((b) => (
                  <label key={b.v} className="flex items-center gap-2 text-sm p-2 hover:bg-muted/40 rounded cursor-pointer">
                    <input type="checkbox" checked={(f.badges || []).includes(b.v)} onChange={() => toggleArr("badges", b.v)} />
                    {b.l}
                  </label>
                ))}
              </div>
            </Section>

            {/* Section 8: Visibility */}
            <Section title="8. Görünürlük">
              <label className="flex items-center justify-between p-3 bg-background rounded border border-border">
                <span className="text-sm">Aktiv (menyu-da göstər)</span>
                <input type="checkbox" checked={f.is_active ?? true} onChange={(e) => setF({ ...f, is_active: e.target.checked })} />
              </label>
              <label className="flex items-center justify-between p-3 bg-background rounded border border-border">
                <span className="text-sm">Öne Çıxar (ana səhifədə)</span>
                <input type="checkbox" checked={f.is_featured ?? false} onChange={(e) => setF({ ...f, is_featured: e.target.checked })} />
              </label>
              <div>
                <label className="text-xs text-muted-foreground">Sıra nömrəsi</label>
                <input type="number" value={f.sort_order ?? 0} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) })} className="inp" />
              </div>
            </Section>
          </div>

          {/* Live Preview */}
          <div className="space-y-4">
            <div className="sticky top-20">
              <p className="text-xs text-muted-foreground mb-2">Canlı önizləmə (müştəri belə görəcək)</p>
              <div className="mx-auto max-w-[280px] bg-background border-4 border-foreground/20 rounded-3xl p-3 shadow-lg">
                <div className="bg-card rounded-lg overflow-hidden">
                  {f.image_url ? <img src={f.image_url} className="w-full h-32 object-cover" alt="" /> : <div className="h-32 bg-muted" />}
                  <div className="p-3">
                    <div className="flex justify-between gap-2">
                      <h3 className="font-semibold text-sm leading-tight">{f.name_az || "Məhsul adı"}</h3>
                      <div className="text-right">
                        {f.old_price && <div className="line-through text-xs text-muted-foreground">{f.old_price} ₼</div>}
                        <div className="text-primary font-bold text-sm">{f.price || 0} ₼</div>
                      </div>
                    </div>
                    {f.desc_az && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{f.desc_az}</p>}
                    <div className="flex flex-wrap gap-1 mt-2 text-xs">
                      {f.spicy_level > 0 && <span>{"🌶".repeat(f.spicy_level)}</span>}
                      {f.weight_grams && <span className="text-muted-foreground">· {f.weight_grams}g</span>}
                      {f.cooking_time && <span className="text-muted-foreground">· {f.cooking_time}dəq</span>}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(f.badges || []).map((b: string) => {
                        const bo = BADGE_OPTIONS.find((x) => x.v === b);
                        return bo && <span key={b} className="text-[10px] px-1.5 py-0.5 bg-primary/15 text-primary rounded">{bo.l}</span>;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end p-5 border-t border-border/40 sticky bottom-0 bg-card">
          <button onClick={onClose} className="px-4 py-2 border border-border rounded">Ləğv et</button>
          <button onClick={() => onSave(f)} className="px-6 py-2 bg-gradient-gold text-primary-foreground rounded">Yadda saxla</button>
        </div>

        <style>{`.inp { width:100%; padding:.5rem .75rem; background:hsl(var(--background)); border:1px solid hsl(var(--border)); border-radius:.375rem; font-size:.875rem; }`}</style>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-primary border-b border-border/40 pb-1">{title}</h3>
      {children}
    </div>
  );
}

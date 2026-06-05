import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Pencil, Trash2, X, GripVertical } from "lucide-react";
import { getMenuCategories, upsertCategory, deleteCategory, reorderCategories } from "@/lib/restaurant.functions";
import { toast } from "sonner";

const q = queryOptions({ queryKey: ["admin-categories"], queryFn: () => getMenuCategories() });

export const Route = createFileRoute("/admin/categories")({
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  component: CategoriesAdmin,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
});

type Cat = Awaited<ReturnType<typeof getMenuCategories>>[number];

const EMOJI = ["🍽️","🥗","🍳","🥬","🍲","🍖","🔥","🐟","🦐","🍰","🧁","🍦","🍹","🍷","🍺","☕","🍵","🥩","🍝","🍕","🥘","🌶️","🥖","🧀","🥑","🍤","🦞","🍱","🥟","🍢","🍡","🍮","🥧","🍯","🍫","🍪"];

function CategoriesAdmin() {
  const { data: items } = useSuspenseQuery(q);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Cat> | null>(null);
  const [list, setList] = useState<Cat[]>(items);

  // Sync if items change
  if (items !== list && items.length !== list.length) setList(items);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = list.findIndex((i) => i.id === active.id);
    const newIndex = list.findIndex((i) => i.id === over.id);
    const newList = arrayMove(list, oldIndex, newIndex);
    setList(newList);
    await reorderCategories({ data: { ids: newList.map((i) => i.id) } });
    qc.invalidateQueries({ queryKey: ["admin-categories"] });
  };

  const save = async (f: Partial<Cat>) => {
    try {
      await upsertCategory({
        data: {
          id: f.id,
          slug: f.slug || "",
          name_az: f.name_az || "",
          name_ru: f.name_ru || "",
          name_en: f.name_en || "",
          icon: f.icon || "🍽️",
          sort_order: f.sort_order ?? 0,
          is_active: f.is_active ?? true,
        },
      });
      toast.success("Yaddaşa yazıldı");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
    } catch (e: any) { toast.error(e.message); }
  };

  const remove = async (id: string) => {
    if (!confirm("Silinsin? (Bu kateqoriyadakı yeməklər kateqoriyasız qalacaq)")) return;
    await deleteCategory({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-categories"] });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-3xl">Kateqoriyalar</h1>
          <p className="text-muted-foreground">{items.length} kateqoriya · Sürükləyərək sıralayın</p>
        </div>
        <button onClick={() => setEditing({ is_active: true, icon: "🍽️", sort_order: items.length * 10 })}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-gold text-primary-foreground rounded-md">
          <Plus className="h-4 w-4" /> Yeni Kateqoriya
        </button>
      </div>

      <div className="bg-card border border-border/40 rounded-xl p-2">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={list.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            {list.map((c) => <SortableRow key={c.id} cat={c} onEdit={() => setEditing(c)} onDelete={() => remove(c.id)} />)}
          </SortableContext>
        </DndContext>
      </div>

      {editing && <Modal cat={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function SortableRow({ cat, onEdit, onDelete }: { cat: Cat; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 hover:bg-muted/30 rounded-md border-b border-border/30 last:border-0">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground">
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="text-2xl">{cat.icon}</span>
      <div className="flex-1">
        <div className="font-medium">{cat.name_az}</div>
        <div className="text-xs text-muted-foreground">{cat.slug} · {cat.name_ru} · {cat.name_en}</div>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded ${cat.is_active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
        {cat.is_active ? "Aktiv" : "Passiv"}
      </span>
      <button onClick={onEdit} className="p-2 hover:bg-muted rounded"><Pencil className="h-4 w-4" /></button>
      <button onClick={onDelete} className="p-2 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-4 w-4" /></button>
    </div>
  );
}

function Modal({ cat, onClose, onSave }: { cat: Partial<Cat>; onClose: () => void; onSave: (c: Partial<Cat>) => void }) {
  const [f, setF] = useState<Partial<Cat>>(cat);
  const [tab, setTab] = useState<"az" | "ru" | "en">("az");
  return (
    <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border/40 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl">{f.id ? "Kateqoriya redaktə" : "Yeni kateqoriya"}</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Slug (URL açarı, lat. hərflər)</label>
            <input value={f.slug || ""} onChange={(e) => setF({ ...f, slug: e.target.value.toLowerCase() })}
              placeholder="məs: salads" className="w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">İkon</label>
            <div className="grid grid-cols-9 gap-1 p-2 bg-background border border-border rounded max-h-32 overflow-auto">
              {EMOJI.map((e) => (
                <button key={e} onClick={() => setF({ ...f, icon: e })}
                  className={`text-2xl p-1 rounded ${f.icon === e ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-muted"}`}>{e}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex gap-1 mb-2">
              {(["az","ru","en"] as const).map((l) => (
                <button key={l} onClick={() => setTab(l)}
                  className={`px-3 py-1 text-xs rounded ${tab === l ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{l.toUpperCase()}</button>
              ))}
            </div>
            <input value={(f as any)[`name_${tab}`] || ""} onChange={(e) => setF({ ...f, [`name_${tab}`]: e.target.value })}
              placeholder={`Ad (${tab.toUpperCase()})`} className="w-full px-3 py-2 bg-background border border-border rounded" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={f.is_active ?? true} onChange={(e) => setF({ ...f, is_active: e.target.checked })} />
            Aktiv
          </label>
        </div>
        <div className="flex gap-2 mt-6 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-border rounded">Ləğv</button>
          <button onClick={() => onSave(f)} className="px-4 py-2 bg-gradient-gold text-primary-foreground rounded">Yadda saxla</button>
        </div>
      </div>
    </div>
  );
}

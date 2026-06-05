import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Trash2, X, Upload, GripVertical, Pencil } from "lucide-react";
import { getGallery, upsertGalleryItem, deleteGalleryItem, reorderGallery } from "@/lib/restaurant.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const q = queryOptions({ queryKey: ["admin-gallery"], queryFn: () => getGallery() });

export const Route = createFileRoute("/admin/gallery")({
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  component: GalleryAdmin,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
});

type G = Awaited<ReturnType<typeof getGallery>>[number];

function GalleryAdmin() {
  const { data: items } = useSuspenseQuery(q);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<G> | null>(null);
  const [list, setList] = useState<G[]>(items);

  useEffect(() => { setList(items); }, [items]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-gallery"] });
    qc.invalidateQueries({ queryKey: ["gallery"] });
  };
  const save = async (f: Partial<G>) => {
    try {
      await upsertGalleryItem({ data: {
        id: f.id, title: f.title || "", category: f.category || "interior", url: f.url || "",
        sort_order: Number(f.sort_order) || 0,
        caption_az: (f as any).caption_az || "", caption_ru: (f as any).caption_ru || "", caption_en: (f as any).caption_en || "",
        is_active: (f as any).is_active !== false,
      }});
      toast.success("Yaddaşa yazıldı");
      setEditing(null); refresh();
    } catch (e: any) { toast.error(e.message); }
  };
  const remove = async (id: string) => {
    if (!confirm("Silinsin?")) return;
    await deleteGalleryItem({ data: { id } });
    refresh();
  };

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = list.findIndex((i) => i.id === active.id);
    const newIdx = list.findIndex((i) => i.id === over.id);
    const next = arrayMove(list, oldIdx, newIdx);
    setList(next);
    await reorderGallery({ data: { ids: next.map((i) => i.id) } });
    refresh();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-3xl">Qalereya</h1>
          <p className="text-muted-foreground">{items.length} şəkil · Sürükləyərək sıralayın</p>
        </div>
        <button onClick={() => setEditing({ category: "interior", sort_order: list.length * 10, is_active: true } as any)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-gold text-primary-foreground rounded-md">
          <Plus className="h-4 w-4" /> Yeni
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={list.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {list.map((g) => <SortableCard key={g.id} g={g} onEdit={() => setEditing(g)} onDelete={() => remove(g.id)} />)}
          </div>
        </SortableContext>
      </DndContext>

      {editing && <Modal item={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function SortableCard({ g, onEdit, onDelete }: { g: G; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: g.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="relative group bg-card border border-border/40 rounded-lg overflow-hidden">
      <img src={g.url} alt={g.title} className="w-full h-40 object-cover" />
      <button {...attributes} {...listeners} className="absolute top-2 left-2 p-1.5 bg-background/80 backdrop-blur rounded cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4" />
      </button>
      {!(g as any).is_active && <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 bg-muted text-foreground rounded">Passiv</span>}
      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
        <button onClick={onEdit} className="p-2 bg-card border border-border rounded"><Pencil className="h-4 w-4" /></button>
        <button onClick={onDelete} className="p-2 bg-destructive/20 text-destructive rounded"><Trash2 className="h-4 w-4" /></button>
      </div>
      <div className="absolute bottom-0 inset-x-0 bg-background/80 backdrop-blur px-2 py-1 text-xs">{g.title || g.category}</div>
    </div>
  );
}

function Modal({ item, onClose, onSave }: { item: Partial<G>; onClose: () => void; onSave: (g: Partial<G>) => void }) {
  const [f, setF] = useState<any>(item);
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const compressed = await imageCompression(file, { maxSizeMB: 1.2, maxWidthOrHeight: 1920, useWebWorker: true, fileType: "image/webp" });
      const path = `gallery/${crypto.randomUUID()}.webp`;
      const { error } = await supabase.storage.from("gallery-images").upload(path, compressed, { contentType: "image/webp" });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("gallery-images").getPublicUrl(path);
      setF((p: any) => ({ ...p, url: pub.publicUrl }));
      toast.success("Şəkil yükləndi");
    } catch (e: any) { toast.error(e.message); }
    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] }, maxSize: 8 * 1024 * 1024, multiple: false,
    onDrop: (files) => files[0] && upload(files[0]),
  });

  return (
    <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-card border border-border/40 rounded-xl p-6 max-w-md w-full max-h-[95vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl">{f.id ? "Redaktə" : "Yeni şəkil"}</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${isDragActive ? "border-primary bg-primary/5" : "border-border"}`}>
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm">{uploading ? "Yüklənir..." : "Şəkli sürüklə və ya kliklə"}</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP · Max 8MB</p>
          </div>
          {f.url && <img src={f.url} alt="" className="w-full h-40 object-cover rounded" />}
          <input placeholder="və ya URL daxil et" value={f.url || ""} onChange={(e) => setF({ ...f, url: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded text-xs" />
          <input placeholder="Başlıq" value={f.title || ""} onChange={(e) => setF({ ...f, title: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
          <select value={f.category || "interior"} onChange={(e) => setF({ ...f, category: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded text-sm">
            <option value="interior">İnteryer</option>
            <option value="food">Yemək</option>
            <option value="exterior">Eksteryer</option>
            <option value="events">Tədbirlər</option>
          </select>
          <input placeholder="Caption AZ" value={f.caption_az || ""} onChange={(e) => setF({ ...f, caption_az: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
          <input placeholder="Caption RU" value={f.caption_ru || ""} onChange={(e) => setF({ ...f, caption_ru: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
          <input placeholder="Caption EN" value={f.caption_en || ""} onChange={(e) => setF({ ...f, caption_en: e.target.value })} className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={f.is_active !== false} onChange={(e) => setF({ ...f, is_active: e.target.checked })} />
            Aktiv (saytda göstər)
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

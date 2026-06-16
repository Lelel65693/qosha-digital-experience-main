import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { H as q$2, I as reorderGallery, J as deleteGalleryItem, K as upsertGalleryItem } from "./router-Cyx6-Q3j.mjs";
import { a as useSuspenseQuery, b as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { u as useDropzone } from "../_libs/react-dropzone.mjs";
import { i as imageCompression } from "../_libs/browser-image-compression.mjs";
import { f as useSensors, h as useSensor, D as DndContext, i as closestCenter, P as PointerSensor } from "../_libs/dnd-kit__core.mjs";
import { S as SortableContext, r as rectSortingStrategy, a as arrayMove, u as useSortable } from "../_libs/dnd-kit__sortable.mjs";
import { C as CSS } from "../_libs/dnd-kit__utilities.mjs";
import { supabase } from "./client-Cg-358lU.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { k as Plus, J as GripVertical, v as Pencil, u as Trash2, X, H as Upload } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./auth-middleware-B_zzLJ1T.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/file-selector.mjs";
import "../_libs/attr-accept.mjs";
import "../_libs/dnd-kit__accessibility.mjs";
function GalleryAdmin() {
  const {
    data: items
  } = useSuspenseQuery(q$2);
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const [list, setList] = reactExports.useState(items);
  reactExports.useEffect(() => {
    setList(items);
  }, [items]);
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 4
    }
  }));
  const refresh = () => {
    qc.invalidateQueries({
      queryKey: ["admin-gallery"]
    });
    qc.invalidateQueries({
      queryKey: ["gallery"]
    });
  };
  const save = async (f) => {
    try {
      await upsertGalleryItem({
        data: {
          id: f.id,
          title: f.title || "",
          category: f.category || "interior",
          url: f.url || "",
          sort_order: Number(f.sort_order) || 0,
          caption_az: f.caption_az || "",
          caption_ru: f.caption_ru || "",
          caption_en: f.caption_en || "",
          is_active: f.is_active !== false
        }
      });
      toast.success("Yaddaşa yazıldı");
      setEditing(null);
      refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };
  const remove = async (id) => {
    if (!confirm("Silinsin?")) return;
    await deleteGalleryItem({
      data: {
        id
      }
    });
    refresh();
  };
  const onDragEnd = async (e) => {
    const {
      active,
      over
    } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = list.findIndex((i) => i.id === active.id);
    const newIdx = list.findIndex((i) => i.id === over.id);
    const next = arrayMove(list, oldIdx, newIdx);
    setList(next);
    await reorderGallery({
      data: {
        ids: next.map((i) => i.id)
      }
    });
    refresh();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl", children: "Qalereya" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
          items.length,
          " şəkil · Sürükləyərək sıralayın"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing({
        category: "interior",
        sort_order: list.length * 10,
        is_active: true
      }), className: "flex items-center gap-2 px-4 py-2 bg-gradient-gold text-primary-foreground rounded-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Yeni"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DndContext, { sensors, collisionDetection: closestCenter, onDragEnd, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SortableContext, { items: list.map((i) => i.id), strategy: rectSortingStrategy, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3", children: list.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(SortableCard, { g, onEdit: () => setEditing(g), onDelete: () => remove(g.id) }, g.id)) }) }) }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { item: editing, onClose: () => setEditing(null), onSave: save })
  ] });
}
function SortableCard({
  g,
  onEdit,
  onDelete
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: g.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: setNodeRef, style, className: "relative group bg-card border border-border/40 rounded-lg overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: g.url, alt: g.title, className: "w-full h-40 object-cover" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...attributes, ...listeners, className: "absolute top-2 left-2 p-1.5 bg-background/80 backdrop-blur rounded cursor-grab active:cursor-grabbing", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4" }) }),
    !g.is_active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-2 right-2 text-[10px] px-1.5 py-0.5 bg-muted text-foreground rounded", children: "Passiv" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onEdit, className: "p-2 bg-card border border-border rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onDelete, className: "p-2 bg-destructive/20 text-destructive rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 inset-x-0 bg-background/80 backdrop-blur px-2 py-1 text-xs", children: g.title || g.category })
  ] });
}
function Modal({
  item,
  onClose,
  onSave
}) {
  const [f, setF] = reactExports.useState(item);
  const [uploading, setUploading] = reactExports.useState(false);
  const upload = reactExports.useCallback(async (file) => {
    setUploading(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1.2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp"
      });
      const path = `gallery/${crypto.randomUUID()}.webp`;
      const {
        error
      } = await supabase.storage.from("gallery-images").upload(path, compressed, {
        contentType: "image/webp"
      });
      if (error) throw error;
      const {
        data: pub
      } = supabase.storage.from("gallery-images").getPublicUrl(path);
      setF((p) => ({
        ...p,
        url: pub.publicUrl
      }));
      toast.success("Şəkil yükləndi");
    } catch (e) {
      toast.error(e.message);
    }
    setUploading(false);
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    accept: {
      "image/*": []
    },
    maxSize: 8 * 1024 * 1024,
    multiple: false,
    onDrop: (files) => files[0] && upload(files[0])
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl p-6 max-w-md w-full max-h-[95vh] overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl", children: f.id ? "Redaktə" : "Yeni şəkil" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ...getRootProps(), className: `border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${isDragActive ? "border-primary bg-primary/5" : "border-border"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ...getInputProps() }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: uploading ? "Yüklənir..." : "Şəkli sürüklə və ya kliklə" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "PNG, JPG, WEBP · Max 8MB" })
      ] }),
      f.url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: f.url, alt: "", className: "w-full h-40 object-cover rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "və ya URL daxil et", value: f.url || "", onChange: (e) => setF({
        ...f,
        url: e.target.value
      }), className: "w-full px-3 py-2 bg-background border border-border rounded text-xs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Başlıq", value: f.title || "", onChange: (e) => setF({
        ...f,
        title: e.target.value
      }), className: "w-full px-3 py-2 bg-background border border-border rounded text-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: f.category || "interior", onChange: (e) => setF({
        ...f,
        category: e.target.value
      }), className: "w-full px-3 py-2 bg-background border border-border rounded text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "interior", children: "İnteryer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "food", children: "Yemək" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "exterior", children: "Eksteryer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "events", children: "Tədbirlər" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Caption AZ", value: f.caption_az || "", onChange: (e) => setF({
        ...f,
        caption_az: e.target.value
      }), className: "w-full px-3 py-2 bg-background border border-border rounded text-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Caption RU", value: f.caption_ru || "", onChange: (e) => setF({
        ...f,
        caption_ru: e.target.value
      }), className: "w-full px-3 py-2 bg-background border border-border rounded text-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Caption EN", value: f.caption_en || "", onChange: (e) => setF({
        ...f,
        caption_en: e.target.value
      }), className: "w-full px-3 py-2 bg-background border border-border rounded text-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: f.is_active !== false, onChange: (e) => setF({
          ...f,
          is_active: e.target.checked
        }) }),
        "Aktiv (saytda göstər)"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-6 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "px-4 py-2 border border-border rounded", children: "Ləğv" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onSave(f), className: "px-4 py-2 bg-gradient-gold text-primary-foreground rounded", children: "Yadda saxla" })
    ] })
  ] }) });
}
export {
  GalleryAdmin as component
};

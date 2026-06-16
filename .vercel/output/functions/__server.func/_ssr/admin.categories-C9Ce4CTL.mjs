import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as q$1, M as reorderCategories, N as deleteCategory, O as upsertCategory } from "./router-Cyx6-Q3j.mjs";
import { a as useSuspenseQuery, b as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { f as useSensors, h as useSensor, D as DndContext, i as closestCenter, j as KeyboardSensor, P as PointerSensor } from "../_libs/dnd-kit__core.mjs";
import { S as SortableContext, v as verticalListSortingStrategy, a as arrayMove, s as sortableKeyboardCoordinates, u as useSortable } from "../_libs/dnd-kit__sortable.mjs";
import { C as CSS } from "../_libs/dnd-kit__utilities.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { k as Plus, J as GripVertical, v as Pencil, u as Trash2, X } from "../_libs/lucide-react.mjs";
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
import "./client-Cg-358lU.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./auth-middleware-B_zzLJ1T.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/dnd-kit__accessibility.mjs";
const EMOJI = ["🍽️", "🥗", "🍳", "🥬", "🍲", "🍖", "🔥", "🐟", "🦐", "🍰", "🧁", "🍦", "🍹", "🍷", "🍺", "☕", "🍵", "🥩", "🍝", "🍕", "🥘", "🌶️", "🥖", "🧀", "🥑", "🍤", "🦞", "🍱", "🥟", "🍢", "🍡", "🍮", "🥧", "🍯", "🍫", "🍪"];
function CategoriesAdmin() {
  const {
    data: items
  } = useSuspenseQuery(q$1);
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const [list, setList] = reactExports.useState(items);
  if (items !== list && items.length !== list.length) setList(items);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  }));
  const onDragEnd = async (e) => {
    const {
      active,
      over
    } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = list.findIndex((i) => i.id === active.id);
    const newIndex = list.findIndex((i) => i.id === over.id);
    const newList = arrayMove(list, oldIndex, newIndex);
    setList(newList);
    await reorderCategories({
      data: {
        ids: newList.map((i) => i.id)
      }
    });
    qc.invalidateQueries({
      queryKey: ["admin-categories"]
    });
  };
  const save = async (f) => {
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
          is_active: f.is_active ?? true
        }
      });
      toast.success("Yaddaşa yazıldı");
      setEditing(null);
      qc.invalidateQueries({
        queryKey: ["admin-categories"]
      });
    } catch (e) {
      toast.error(e.message);
    }
  };
  const remove = async (id) => {
    if (!confirm("Silinsin? (Bu kateqoriyadakı yeməklər kateqoriyasız qalacaq)")) return;
    await deleteCategory({
      data: {
        id
      }
    });
    qc.invalidateQueries({
      queryKey: ["admin-categories"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl", children: "Kateqoriyalar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
          items.length,
          " kateqoriya · Sürükləyərək sıralayın"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing({
        is_active: true,
        icon: "🍽️",
        sort_order: items.length * 10
      }), className: "flex items-center gap-2 px-4 py-2 bg-gradient-gold text-primary-foreground rounded-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Yeni Kateqoriya"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border/40 rounded-xl p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DndContext, { sensors, collisionDetection: closestCenter, onDragEnd, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SortableContext, { items: list.map((i) => i.id), strategy: verticalListSortingStrategy, children: list.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SortableRow, { cat: c, onEdit: () => setEditing(c), onDelete: () => remove(c.id) }, c.id)) }) }) }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { cat: editing, onClose: () => setEditing(null), onSave: save })
  ] });
}
function SortableRow({
  cat,
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
    id: cat.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: setNodeRef, style, className: "flex items-center gap-3 p-3 hover:bg-muted/30 rounded-md border-b border-border/30 last:border-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ...attributes, ...listeners, className: "cursor-grab active:cursor-grabbing p-1 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: cat.icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: cat.name_az }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
        cat.slug,
        " · ",
        cat.name_ru,
        " · ",
        cat.name_en
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded ${cat.is_active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`, children: cat.is_active ? "Aktiv" : "Passiv" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onEdit, className: "p-2 hover:bg-muted rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onDelete, className: "p-2 hover:bg-destructive/10 text-destructive rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
  ] });
}
function Modal({
  cat,
  onClose,
  onSave
}) {
  const [f, setF] = reactExports.useState(cat);
  const [tab, setTab] = reactExports.useState("az");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl", children: f.id ? "Kateqoriya redaktə" : "Yeni kateqoriya" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Slug (URL açarı, lat. hərflər)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: f.slug || "", onChange: (e) => setF({
          ...f,
          slug: e.target.value.toLowerCase()
        }), placeholder: "məs: salads", className: "w-full px-3 py-2 bg-background border border-border rounded font-mono text-sm" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "İkon" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-9 gap-1 p-2 bg-background border border-border rounded max-h-32 overflow-auto", children: EMOJI.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setF({
          ...f,
          icon: e
        }), className: `text-2xl p-1 rounded ${f.icon === e ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-muted"}`, children: e }, e)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 mb-2", children: ["az", "ru", "en"].map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(l), className: `px-3 py-1 text-xs rounded ${tab === l ? "bg-primary text-primary-foreground" : "bg-muted"}`, children: l.toUpperCase() }, l)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: f[`name_${tab}`] || "", onChange: (e) => setF({
          ...f,
          [`name_${tab}`]: e.target.value
        }), placeholder: `Ad (${tab.toUpperCase()})`, className: "w-full px-3 py-2 bg-background border border-border rounded" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: f.is_active ?? true, onChange: (e) => setF({
          ...f,
          is_active: e.target.checked
        }) }),
        "Aktiv"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-6 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "px-4 py-2 border border-border rounded", children: "Ləğv" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onSave(f), className: "px-4 py-2 bg-gradient-gold text-primary-foreground rounded", children: "Yadda saxla" })
    ] })
  ] }) });
}
export {
  CategoriesAdmin as component
};

import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { x as q$3, y as updateReservationStatus, z as deleteReservation, A as createReservationAdmin } from "./router-Cyx6-Q3j.mjs";
import { a as useSuspenseQuery, b as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { F as FileSaver_minExports } from "../_libs/file-saver.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { k as Plus, D as Download, s as Search, P as Phone, y as MessageCircle, w as Check, j as Clock, X, u as Trash2 } from "../_libs/lucide-react.mjs";
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
function ReservationsAdmin() {
  const {
    data: items
  } = useSuspenseQuery(q$3);
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [dateFilter, setDateFilter] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [showNew, setShowNew] = reactExports.useState(false);
  const refresh = () => qc.invalidateQueries({
    queryKey: ["admin-reservations"]
  });
  const filtered = reactExports.useMemo(() => {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10);
    const tom = new Date(today);
    tom.setDate(tom.getDate() + 1);
    const tomStr = tom.toISOString().slice(0, 10);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return items.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (dateFilter === "today" && r.reservation_date !== todayStr) return false;
      if (dateFilter === "tomorrow" && r.reservation_date !== tomStr) return false;
      if (dateFilter === "week") {
        const d = new Date(r.reservation_date);
        if (d < today || d > weekEnd) return false;
      }
      if (search) {
        const q2 = search.toLowerCase();
        if (!r.name.toLowerCase().includes(q2) && !r.phone.includes(q2)) return false;
      }
      return true;
    });
  }, [items, statusFilter, dateFilter, search]);
  const setStatus = async (id, status) => {
    try {
      await updateReservationStatus({
        data: {
          id,
          status
        }
      });
      toast.success("Yeniləndi");
      refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };
  const remove = async (id) => {
    if (!confirm("Silinsin?")) return;
    await deleteReservation({
      data: {
        id
      }
    });
    refresh();
  };
  const exportCsv = () => {
    const header = "Tarix,Vaxt,Ad,Telefon,Email,Qonaq,Status,Tədbir,Qeyd\n";
    const rows = filtered.map((r) => [r.reservation_date, r.reservation_time, r.name, r.phone, r.email ?? "", r.guests, r.status, r.occasion ?? "", (r.note || "").replace(/,/g, ";")].join(",")).join("\n");
    FileSaver_minExports.saveAs(new Blob(["\uFEFF" + header + rows], {
      type: "text/csv;charset=utf-8"
    }), "rezervasiyalar.csv");
  };
  const counts = reactExports.useMemo(() => ({
    all: items.length,
    pending: items.filter((r) => r.status === "pending").length,
    confirmed: items.filter((r) => r.status === "confirmed").length,
    cancelled: items.filter((r) => r.status === "cancelled").length
  }), [items]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-6 flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl", children: "Rezervasiyalar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
          filtered.length,
          " / ",
          items.length,
          " sifariş"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowNew(true), className: "flex items-center gap-2 px-4 py-2 bg-gradient-gold text-primary-foreground rounded-md text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Əl ilə əlavə"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: exportCsv, className: "flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
          " CSV"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl p-3 mb-4 flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex border border-border rounded overflow-hidden text-xs", children: ["all", "pending", "confirmed", "cancelled"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setStatusFilter(s), className: `px-3 py-2 transition ${statusFilter === s ? "bg-primary text-primary-foreground" : ""}`, children: [
        s === "all" ? "Hamısı" : s === "pending" ? "Gözləyir" : s === "confirmed" ? "Təsdiq" : "Ləğv",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 opacity-60", children: [
          "(",
          counts[s],
          ")"
        ] })
      ] }, s)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex border border-border rounded overflow-hidden text-xs", children: ["all", "today", "tomorrow", "week"].map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDateFilter(d), className: `px-3 py-2 transition ${dateFilter === d ? "bg-primary text-primary-foreground" : ""}`, children: d === "all" ? "Bütün tarixlər" : d === "today" ? "Bu gün" : d === "tomorrow" ? "Sabah" : "Bu həftə" }, d)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative min-w-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Ad və ya telefon...", className: "w-full pl-9 pr-3 py-2 bg-background border border-border rounded text-sm" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border/40 rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/30 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Tarix / Vaxt" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Müştəri" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Əlaqə" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Qonaq" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Tədbir / Qeyd" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        filtered.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/40 hover:bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 whitespace-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: r.reservation_date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: r.reservation_time })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-medium", children: r.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-xs space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `tel:${r.phone}`, className: "text-primary hover:underline flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
              r.phone
            ] }),
            r.email && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: r.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-center", children: r.guests }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-xs max-w-[220px]", children: [
            r.occasion && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-primary mb-0.5", children: [
              "🎉 ",
              r.occasion
            ] }),
            r.note && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground line-clamp-2", children: r.note })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded ${r.status === "confirmed" ? "bg-green-500/15 text-green-600" : r.status === "pending" ? "bg-yellow-500/15 text-yellow-600" : "bg-muted text-muted-foreground"}`, children: r.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `https://wa.me/${r.phone.replace(/[^\d]/g, "")}`, target: "_blank", rel: "noreferrer", className: "p-2.5 inline-flex hover:bg-green-500/15 text-green-500 rounded-lg transition", title: "WhatsApp", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `tel:${r.phone}`, className: "p-2.5 inline-flex hover:bg-blue-500/15 text-blue-400 rounded-lg transition", title: "Zəng et", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStatus(r.id, "confirmed"), className: "p-2.5 hover:bg-green-500/15 text-green-500 rounded-lg transition", title: "Təsdiqlə", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStatus(r.id, "pending"), className: "p-2.5 hover:bg-yellow-500/15 text-yellow-500 rounded-lg transition", title: "Gözləyir", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStatus(r.id, "cancelled"), className: "p-2.5 hover:bg-muted text-muted-foreground rounded-lg transition", title: "Ləğv", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(r.id), className: "p-2.5 hover:bg-destructive/15 text-destructive rounded-lg transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-5 w-5" }) })
          ] }) })
        ] }, r.id)),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "p-8 text-center text-muted-foreground", children: "Sifariş tapılmadı" }) })
      ] })
    ] }) }),
    showNew && /* @__PURE__ */ jsxRuntimeExports.jsx(NewReservationModal, { onClose: () => setShowNew(false), onDone: () => {
      setShowNew(false);
      refresh();
    } })
  ] });
}
function NewReservationModal({
  onClose,
  onDone
}) {
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const [f, setF] = reactExports.useState({
    name: "",
    phone: "",
    email: "",
    reservation_date: today,
    reservation_time: "19:00",
    guests: 2,
    occasion: "",
    note: "",
    status: "confirmed"
  });
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async () => {
    if (!f.name || !f.phone) return toast.error("Ad və telefon vacibdir");
    setBusy(true);
    try {
      await createReservationAdmin({
        data: {
          ...f,
          guests: Number(f.guests)
        }
      });
      toast.success("Əlavə edildi");
      onDone();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl", children: "Yeni rezervasiya" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { label: "Ad Soyad *", value: f.name, onChange: (v) => setF({
        ...f,
        name: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { label: "Telefon *", value: f.phone, onChange: (v) => setF({
        ...f,
        phone: v
      }), placeholder: "+994..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { label: "Email", value: f.email, onChange: (v) => setF({
        ...f,
        email: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { label: "Tarix", type: "date", value: f.reservation_date, onChange: (v) => setF({
          ...f,
          reservation_date: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { label: "Vaxt", type: "time", value: f.reservation_time, onChange: (v) => setF({
          ...f,
          reservation_time: v
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { label: "Qonaq", type: "number", value: String(f.guests), onChange: (v) => setF({
          ...f,
          guests: Number(v) || 1
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: f.status, onChange: (e) => setF({
            ...f,
            status: e.target.value
          }), className: "w-full px-3 py-2 bg-background border border-border rounded text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "confirmed", children: "Təsdiqlənmiş" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: "Gözləyən" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { label: "Tədbir (ad günü, görüş...)", value: f.occasion, onChange: (v) => setF({
        ...f,
        occasion: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Qeyd" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 2, value: f.note, onChange: (e) => setF({
          ...f,
          note: e.target.value
        }), className: "w-full px-3 py-2 bg-background border border-border rounded text-sm" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-6 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "px-4 py-2 border border-border rounded", children: "Ləğv" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: submit, disabled: busy, className: "px-4 py-2 bg-gradient-gold text-primary-foreground rounded disabled:opacity-50", children: busy ? "Göndərilir..." : "Yadda saxla" })
    ] })
  ] }) });
}
function Inp({
  label,
  value,
  onChange,
  type = "text",
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, onChange: (e) => onChange(e.target.value), placeholder, className: "w-full px-3 py-2 bg-background border border-border rounded text-sm" })
  ] });
}
export {
  ReservationsAdmin as component
};

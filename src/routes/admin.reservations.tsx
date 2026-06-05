import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Trash2, Download, Check, Clock, X as XIcon, MessageCircle, Plus, Phone, Search } from "lucide-react";
import {
  listReservations, updateReservationStatus, deleteReservation, createReservationAdmin,
} from "@/lib/restaurant.functions";
import { saveAs } from "file-saver";
import { toast } from "sonner";

const q = queryOptions({ queryKey: ["admin-reservations"], queryFn: () => listReservations() });

export const Route = createFileRoute("/admin/reservations")({
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  component: ReservationsAdmin,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
});

type Reservation = Awaited<ReturnType<typeof listReservations>>[number];

function ReservationsAdmin() {
  const { data: items } = useSuspenseQuery(q);
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "tomorrow" | "week">("all");
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-reservations"] });

  const filtered = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10);
    const tom = new Date(today); tom.setDate(tom.getDate() + 1);
    const tomStr = tom.toISOString().slice(0, 10);
    const weekEnd = new Date(today); weekEnd.setDate(weekEnd.getDate() + 7);

    return items.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (dateFilter === "today" && r.reservation_date !== todayStr) return false;
      if (dateFilter === "tomorrow" && r.reservation_date !== tomStr) return false;
      if (dateFilter === "week") {
        const d = new Date(r.reservation_date);
        if (d < today || d > weekEnd) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (!r.name.toLowerCase().includes(q) && !r.phone.includes(q)) return false;
      }
      return true;
    });
  }, [items, statusFilter, dateFilter, search]);

  const setStatus = async (id: string, status: "pending" | "confirmed" | "cancelled") => {
    try {
      await updateReservationStatus({ data: { id, status } });
      toast.success("Yeniləndi");
      refresh();
    } catch (e: any) { toast.error(e.message); }
  };
  const remove = async (id: string) => {
    if (!confirm("Silinsin?")) return;
    await deleteReservation({ data: { id } });
    refresh();
  };
  const exportCsv = () => {
    const header = "Tarix,Vaxt,Ad,Telefon,Email,Qonaq,Status,Tədbir,Qeyd\n";
    const rows = filtered.map((r) =>
      [r.reservation_date, r.reservation_time, r.name, r.phone, r.email ?? "", r.guests, r.status, r.occasion ?? "", (r.note || "").replace(/,/g, ";")].join(",")
    ).join("\n");
    saveAs(new Blob(["\ufeff" + header + rows], { type: "text/csv;charset=utf-8" }), "rezervasiyalar.csv");
  };

  const counts = useMemo(() => ({
    all: items.length,
    pending: items.filter((r) => r.status === "pending").length,
    confirmed: items.filter((r) => r.status === "confirmed").length,
    cancelled: items.filter((r) => r.status === "cancelled").length,
  }), [items]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl">Rezervasiyalar</h1>
          <p className="text-muted-foreground">{filtered.length} / {items.length} sifariş</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-gold text-primary-foreground rounded-md text-sm">
            <Plus className="h-4 w-4" /> Əl ilə əlavə
          </button>
          <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm">
            <Download className="h-4 w-4" /> CSV
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-card border border-border/40 rounded-xl p-3 mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex border border-border rounded overflow-hidden text-xs">
          {(["all","pending","confirmed","cancelled"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 transition ${statusFilter === s ? "bg-primary text-primary-foreground" : ""}`}>
              {s === "all" ? "Hamısı" : s === "pending" ? "Gözləyir" : s === "confirmed" ? "Təsdiq" : "Ləğv"}
              <span className="ml-1 opacity-60">({counts[s]})</span>
            </button>
          ))}
        </div>
        <div className="flex border border-border rounded overflow-hidden text-xs">
          {(["all","today","tomorrow","week"] as const).map((d) => (
            <button key={d} onClick={() => setDateFilter(d)}
              className={`px-3 py-2 transition ${dateFilter === d ? "bg-primary text-primary-foreground" : ""}`}>
              {d === "all" ? "Bütün tarixlər" : d === "today" ? "Bu gün" : d === "tomorrow" ? "Sabah" : "Bu həftə"}
            </button>
          ))}
        </div>
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ad və ya telefon..."
            className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded text-sm" />
        </div>
      </div>

      <div className="bg-card border border-border/40 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-left">
            <tr>
              <th className="p-3">Tarix / Vaxt</th>
              <th className="p-3">Müştəri</th>
              <th className="p-3">Əlaqə</th>
              <th className="p-3">Qonaq</th>
              <th className="p-3">Tədbir / Qeyd</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border/40 hover:bg-muted/20">
                <td className="p-3 whitespace-nowrap">
                  <div className="font-medium">{r.reservation_date}</div>
                  <div className="text-xs text-muted-foreground">{r.reservation_time}</div>
                </td>
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3 text-xs space-y-0.5">
                  <a href={`tel:${r.phone}`} className="text-primary hover:underline flex items-center gap-1"><Phone className="h-3 w-3" />{r.phone}</a>
                  {r.email && <div className="text-muted-foreground">{r.email}</div>}
                </td>
                <td className="p-3 text-center">{r.guests}</td>
                <td className="p-3 text-xs max-w-[220px]">
                  {r.occasion && <div className="text-primary mb-0.5">🎉 {r.occasion}</div>}
                  {r.note && <div className="text-muted-foreground line-clamp-2">{r.note}</div>}
                </td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    r.status === "confirmed" ? "bg-green-500/15 text-green-600" :
                    r.status === "pending" ? "bg-yellow-500/15 text-yellow-600" : "bg-muted text-muted-foreground"
                  }`}>{r.status}</span>
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    <a href={`https://wa.me/${r.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer"
                      className="p-2.5 inline-flex hover:bg-green-500/15 text-green-500 rounded-lg transition" title="WhatsApp">
                      <MessageCircle className="h-5 w-5" />
                    </a>
                    <a href={`tel:${r.phone}`}
                      className="p-2.5 inline-flex hover:bg-blue-500/15 text-blue-400 rounded-lg transition" title="Zəng et">
                      <Phone className="h-5 w-5" />
                    </a>
                    <button onClick={() => setStatus(r.id, "confirmed")} className="p-2.5 hover:bg-green-500/15 text-green-500 rounded-lg transition" title="Təsdiqlə">
                      <Check className="h-5 w-5" />
                    </button>
                    <button onClick={() => setStatus(r.id, "pending")} className="p-2.5 hover:bg-yellow-500/15 text-yellow-500 rounded-lg transition" title="Gözləyir">
                      <Clock className="h-5 w-5" />
                    </button>
                    <button onClick={() => setStatus(r.id, "cancelled")} className="p-2.5 hover:bg-muted text-muted-foreground rounded-lg transition" title="Ləğv">
                      <XIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => remove(r.id)} className="p-2.5 hover:bg-destructive/15 text-destructive rounded-lg transition">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Sifariş tapılmadı</td></tr>}
          </tbody>
        </table>
      </div>

      {showNew && <NewReservationModal onClose={() => setShowNew(false)} onDone={() => { setShowNew(false); refresh(); }} />}
    </div>
  );
}

function NewReservationModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({
    name: "", phone: "", email: "",
    reservation_date: today, reservation_time: "19:00",
    guests: 2, occasion: "", note: "",
    status: "confirmed" as const,
  });
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!f.name || !f.phone) return toast.error("Ad və telefon vacibdir");
    setBusy(true);
    try {
      await createReservationAdmin({ data: { ...f, guests: Number(f.guests) } });
      toast.success("Əlavə edildi");
      onDone();
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };
  return (
    <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border/40 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl">Yeni rezervasiya</h2>
          <button onClick={onClose}><XIcon className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <Inp label="Ad Soyad *" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
          <Inp label="Telefon *" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} placeholder="+994..." />
          <Inp label="Email" value={f.email} onChange={(v) => setF({ ...f, email: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Inp label="Tarix" type="date" value={f.reservation_date} onChange={(v) => setF({ ...f, reservation_date: v })} />
            <Inp label="Vaxt" type="time" value={f.reservation_time} onChange={(v) => setF({ ...f, reservation_time: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Inp label="Qonaq" type="number" value={String(f.guests)} onChange={(v) => setF({ ...f, guests: Number(v) || 1 })} />
            <div>
              <label className="text-xs text-muted-foreground">Status</label>
              <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as any })} className="w-full px-3 py-2 bg-background border border-border rounded text-sm">
                <option value="confirmed">Təsdiqlənmiş</option>
                <option value="pending">Gözləyən</option>
              </select>
            </div>
          </div>
          <Inp label="Tədbir (ad günü, görüş...)" value={f.occasion} onChange={(v) => setF({ ...f, occasion: v })} />
          <div>
            <label className="text-xs text-muted-foreground">Qeyd</label>
            <textarea rows={2} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
          </div>
        </div>
        <div className="flex gap-2 mt-6 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-border rounded">Ləğv</button>
          <button onClick={submit} disabled={busy} className="px-4 py-2 bg-gradient-gold text-primary-foreground rounded disabled:opacity-50">
            {busy ? "Göndərilir..." : "Yadda saxla"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Inp({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
    </div>
  );
}

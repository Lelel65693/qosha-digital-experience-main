import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import { getAllReviews, upsertReview, deleteReview } from "@/lib/restaurant.functions";
import { toast } from "sonner";

const q = queryOptions({ queryKey: ["admin-reviews"], queryFn: () => getAllReviews() });

export const Route = createFileRoute("/admin/reviews")({
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  component: ReviewsAdmin,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
});

type R = Awaited<ReturnType<typeof getAllReviews>>[number];

const SOURCES = [
  { v: "manual", l: "📝 Əl ilə" },
  { v: "google", l: "🔵 Google" },
  { v: "tripadvisor", l: "🦉 TripAdvisor" },
  { v: "instagram", l: "📷 Instagram" },
  { v: "facebook", l: "📘 Facebook" },
];

function ReviewsAdmin() {
  const { data: items } = useSuspenseQuery(q);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<R> | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    qc.invalidateQueries({ queryKey: ["reviews"] });
  };

  const save = async (f: Partial<R>) => {
    try {
      await upsertReview({ data: {
        id: f.id, author_name: f.author_name || "", author_avatar: (f as any).author_avatar || null,
        content: f.content || "",
        content_az: (f as any).content_az || "", content_ru: (f as any).content_ru || "", content_en: (f as any).content_en || "",
        rating: Number(f.rating) || 5, status: (f.status as any) || "approved",
        is_featured: f.is_featured ?? false, source: f.source || "manual",
        review_date: (f as any).review_date || undefined,
      }});
      toast.success("Yaddaşa yazıldı");
      setEditing(null); refresh();
    } catch (e: any) { toast.error(e.message); }
  };

  const remove = async (id: string) => {
    if (!confirm("Silinsin?")) return;
    await deleteReview({ data: { id } });
    refresh();
  };

  const visible = items.filter((r) => filter === "all" || r.status === filter);
  const counts = {
    all: items.length,
    pending: items.filter((r) => r.status === "pending").length,
    approved: items.filter((r) => r.status === "approved").length,
    rejected: items.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-3xl">Rəylər</h1>
          <p className="text-muted-foreground">{visible.length} / {items.length} rəy</p>
        </div>
        <button onClick={() => setEditing({ rating: 5, status: "approved", source: "manual" })}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-gold text-primary-foreground rounded-md">
          <Plus className="h-4 w-4" /> Yeni
        </button>
      </div>

      <div className="bg-card border border-border/40 rounded-xl p-3 mb-4 inline-flex border-border rounded overflow-hidden text-xs">
        {(["all","pending","approved","rejected"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-2 ${filter === s ? "bg-primary text-primary-foreground" : ""}`}>
            {s === "all" ? "Hamısı" : s === "pending" ? "Gözləyən" : s === "approved" ? "Təsdiq" : "Rədd"}
            <span className="ml-1 opacity-60">({counts[s]})</span>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {visible.map((r) => (
          <div key={r.id} className="bg-card border border-border/40 rounded-xl p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-3">
                {(r as any).author_avatar
                  ? <img src={(r as any).author_avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                  : <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm">{r.author_name?.[0]}</div>}
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {r.author_name}
                    {r.is_featured && <Star className="h-3 w-3 fill-primary text-primary" />}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="text-primary">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    <span>·</span>
                    <span>{SOURCES.find((s) => s.v === r.source)?.l ?? r.source}</span>
                  </div>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${
                r.status === "approved" ? "bg-primary/15 text-primary" :
                r.status === "pending" ? "bg-yellow-500/15 text-yellow-600" : "bg-muted text-muted-foreground"
              }`}>{r.status}</span>
            </div>
            <p className="text-sm text-foreground/80 line-clamp-3 mb-3">{r.content}</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditing(r)} className="p-2 hover:bg-muted rounded"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(r.id)} className="p-2 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && <ReviewModal item={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function ReviewModal({ item, onClose, onSave }: { item: Partial<R>; onClose: () => void; onSave: (r: Partial<R>) => void }) {
  const [f, setF] = useState<any>(item);
  const [tab, setTab] = useState<"main" | "az" | "ru" | "en">("main");
  return (
    <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-card border border-border/40 rounded-xl p-6 max-w-lg w-full max-h-[95vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl">{f.id ? "Redaktə" : "Yeni rəy"}</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <Inp label="Müəllif adı" value={f.author_name || ""} onChange={(v) => setF({ ...f, author_name: v })} />
          <Inp label="Avatar URL" value={f.author_avatar || ""} onChange={(v) => setF({ ...f, author_avatar: v })} placeholder="https://..." />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Ulduz</label>
              <select value={f.rating || 5} onChange={(e) => setF({ ...f, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-background border border-border rounded text-sm">
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{"★".repeat(n)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Status</label>
              <select value={f.status || "approved"} onChange={(e) => setF({ ...f, status: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded text-sm">
                <option value="pending">Gözləyən</option>
                <option value="approved">Təsdiq</option>
                <option value="rejected">Rədd</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Mənbə</label>
              <select value={f.source || "manual"} onChange={(e) => setF({ ...f, source: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded text-sm">
                {SOURCES.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
              </select>
            </div>
          </div>
          <Inp label="Rəy tarixi" type="date" value={f.review_date || ""} onChange={(v) => setF({ ...f, review_date: v })} />

          <div className="flex gap-1 mt-2">
            {(["main","az","ru","en"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTab(t)}
                className={`px-3 py-1 text-xs rounded ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {t === "main" ? "Əsas" : t.toUpperCase()}
              </button>
            ))}
          </div>
          {tab === "main" && (
            <textarea placeholder="Rəy mətni (orijinal)" rows={4} value={f.content || ""} onChange={(e) => setF({ ...f, content: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
          )}
          {tab === "az" && (
            <textarea placeholder="AZ tərcümə" rows={4} value={f.content_az || ""} onChange={(e) => setF({ ...f, content_az: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
          )}
          {tab === "ru" && (
            <textarea placeholder="RU тарcümə" rows={4} value={f.content_ru || ""} onChange={(e) => setF({ ...f, content_ru: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
          )}
          {tab === "en" && (
            <textarea placeholder="EN translation" rows={4} value={f.content_en || ""} onChange={(e) => setF({ ...f, content_en: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
          )}

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={f.is_featured ?? false} onChange={(e) => setF({ ...f, is_featured: e.target.checked })} />
            Önə çıxar (ana səhifədə)
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

function Inp({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 bg-background border border-border rounded text-sm" />
    </div>
  );
}

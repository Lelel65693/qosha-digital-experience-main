import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Save, Globe, CheckCircle } from "lucide-react";
import { getSiteSettings, updateSiteSetting, syncGoogleReviews } from "@/lib/restaurant.functions";
import { toast } from "sonner";

const q = queryOptions({ queryKey: ["site-settings"], queryFn: () => getSiteSettings() });

export const Route = createFileRoute("/admin/settings")({
  loader: ({ context }) => context.queryClient.ensureQueryData(q),
  component: SettingsAdmin,
  errorComponent: ({ error }) => <div className="p-8 text-destructive">{error.message}</div>,
});

const DAYS = [
  { key: "mon", label: "Bazar ertəsi" },
  { key: "tue", label: "Çərşənbə axşamı" },
  { key: "wed", label: "Çərşənbə" },
  { key: "thu", label: "Cümə axşamı" },
  { key: "fri", label: "Cümə" },
  { key: "sat", label: "Şənbə" },
  { key: "sun", label: "Bazar" },
];

function SettingsAdmin() {
  const { data: settings } = useSuspenseQuery(q);
  const qc = useQueryClient();
  const [contact, setContact] = useState(settings.contact_info ?? {});
  const [hours,   setHours]   = useState(settings.working_hours ?? {});
  const [banner,  setBanner]  = useState(settings.announcement_banner ?? {});
  const [social,  setSocial]  = useState(settings.social_links ?? {});
  const [googleSync, setGoogleSync] = useState(settings.google_reviews_settings ?? { apiKey: "", placeId: "" });
  const [syncing, setSyncing] = useState(false);

  const save = async (key: string, value: any) => {
    try {
      await updateSiteSetting({ data: { key, value } });
      toast.success("Yadda saxlanıldı — saytda dərhal aktiv olur");
      qc.invalidateQueries({ queryKey: ["site-settings"] });
    } catch (e: any) { toast.error(e.message); }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await syncGoogleReviews();
      toast.success(`${res.synced} yeni rəy Google-dan idxal edildi!`);
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      qc.invalidateQueries({ queryKey: ["reviews"] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl mb-1">Sayt Ayarları</h1>
        <div className="flex items-center gap-2 text-sm text-emerald-500 mt-1">
          <Globe className="h-4 w-4" />
          <CheckCircle className="h-3.5 w-3.5" />
          <span>Burada yadda saxlanan bütün məlumatlar saytın əsas səhifəsində, əlaqə bölməsində və altbilgidə <strong>avtomatik</strong> göstərilir</span>
        </div>
      </div>

      {/* ── Elan Banneri ── */}
      <Card
        title="📢 Elan Banneri"
        subtitle="Saytın yuxarısında qızılı rəngli elan şeridi"
        onSave={() => save("announcement_banner", banner)}
      >
        <label className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 accent-primary"
            checked={banner.active ?? false}
            onChange={(e) => setBanner({ ...banner, active: e.target.checked })}
          />
          <span className="text-sm">Aktiv et — saytın yuxarısında göstər</span>
        </label>
        <Field label="Mətn (Azərbaycanca)">
          <input value={banner.text_az || ""} onChange={(e) => setBanner({ ...banner, text_az: e.target.value })} className="inp" placeholder="Yeni il endirimləri başladı! 🎉" />
        </Field>
        <Field label="Mətn (Rusca)">
          <input value={banner.text_ru || ""} onChange={(e) => setBanner({ ...banner, text_ru: e.target.value })} className="inp" placeholder="Новогодние скидки начались! 🎉" />
        </Field>
        <Field label="Mətn (İngiliscə)">
          <input value={banner.text_en || ""} onChange={(e) => setBanner({ ...banner, text_en: e.target.value })} className="inp" placeholder="New Year discounts started! 🎉" />
        </Field>
      </Card>

      {/* ── Əlaqə Məlumatları ── */}
      <Card
        title="📞 Əlaqə Məlumatları"
        subtitle="Əlaqə səhifəsi və altbilgidə göstərilir"
        onSave={() => save("contact_info", contact)}
      >
        <Field label="Əsas Telefon">
          <input
            value={contact.phone || ""}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            className="inp" placeholder="+994 50 790 88 88"
          />
        </Field>
        <Field label="İkinci Telefon (əlavə nömrə)">
          <input
            value={contact.phone2 || ""}
            onChange={(e) => setContact({ ...contact, phone2: e.target.value })}
            className="inp" placeholder="+994 51 615 88 88"
          />
        </Field>
        <Field label="E-poçt">
          <input
            value={contact.email || ""}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            className="inp" placeholder="info@qoshaqala.az"
          />
        </Field>
        <Field label="Ünvan">
          <input
            value={contact.address || ""}
            onChange={(e) => setContact({ ...contact, address: e.target.value })}
            className="inp" placeholder="Buzovna, Bağlar Massivi 67, Mərdəkan, Bakı"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Xəritə eni (lat)">
            <input
              type="number" step="0.0001"
              value={contact.map_lat || ""}
              onChange={(e) => setContact({ ...contact, map_lat: Number(e.target.value) })}
              className="inp"
            />
          </Field>
          <Field label="Xəritə uzunu (lng)">
            <input
              type="number" step="0.0001"
              value={contact.map_lng || ""}
              onChange={(e) => setContact({ ...contact, map_lng: Number(e.target.value) })}
              className="inp"
            />
          </Field>
        </div>
      </Card>

      {/* ── İş Saatları ── */}
      <Card
        title="🕐 İş Saatları"
        subtitle="Əlaqə səhifəsindəki iş saatları bölməsini idarə edir"
        onSave={() => save("working_hours", hours)}
      >
        <div className="space-y-2">
          {DAYS.map((d) => (
            <div key={d.key} className="flex items-center gap-3">
              <span className="w-36 text-sm text-muted-foreground">{d.label}</span>
              <input
                value={hours[d.key] || ""}
                onChange={(e) => setHours({ ...hours, [d.key]: e.target.value })}
                placeholder="10:00–23:00  (boş = qapalı)"
                className="inp flex-1 font-mono text-sm"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Məsələn: <code className="bg-muted px-1 rounded">10:00–01:00</code> · Qapalı günlər üçün sahəni boş buraxın
        </p>
      </Card>

      {/* ── Sosial Şəbəkələr ── */}
      <Card
        title="🌐 Sosial Şəbəkələr"
        subtitle="Altbilgi və əlaqə səhifəsindəki linklər"
        onSave={() => save("social_links", social)}
      >
        <Field label="Instagram URL">
          <input value={social.instagram || ""} onChange={(e) => setSocial({ ...social, instagram: e.target.value })} className="inp" placeholder="https://instagram.com/qoshaqala" />
        </Field>
        <Field label="WhatsApp nömrəsi (rəqəmlər)">
          <input value={social.whatsapp || ""} onChange={(e) => setSocial({ ...social, whatsapp: e.target.value })} className="inp" placeholder="994507908888" />
        </Field>
        <Field label="Facebook URL">
          <input value={social.facebook || ""} onChange={(e) => setSocial({ ...social, facebook: e.target.value })} className="inp" placeholder="https://facebook.com/qoshaqala" />
        </Field>
      </Card>

      {/* ── Google Maps Rəyləri Sinxronizasiyası ── */}
      <Card
        title="⭐ Google Maps Sinxronizasiyası"
        subtitle="Rəyləri Google-dan avtomatik sayta idxal edin"
        onSave={() => save("google_reviews_settings", googleSync)}
      >
        <Field label="Google Place ID">
          <input
            value={googleSync.placeId || ""}
            onChange={(e) => setGoogleSync({ ...googleSync, placeId: e.target.value })}
            className="inp"
            placeholder="Məsələn: ChIJ3dXzGWg_MDQRo-VwJEPFYq0"
          />
        </Field>
        <Field label="Google Places API Key">
          <input
            type="password"
            value={googleSync.apiKey || ""}
            onChange={(e) => setGoogleSync({ ...googleSync, apiKey: e.target.value })}
            className="inp"
            placeholder="Google Cloud Console API Açarınız"
          />
        </Field>
        
        <Field label="Avtomatik Sinxronizasiya Tokeni (Webhook Token)">
          <input
            value={googleSync.webhookToken || ""}
            onChange={(e) => setGoogleSync({ ...googleSync, webhookToken: e.target.value })}
            className="inp"
            placeholder="Məsələn: qoshaqala-secure-sync-token-123"
          />
        </Field>

        {googleSync.webhookToken && (
          <div className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded border border-border/40 space-y-1">
            <p className="font-semibold text-foreground">Avtomatik sinxronizasiya linki (Cron / Webhook):</p>
            <code className="block break-all bg-background p-1.5 rounded select-all font-mono text-[10px] text-primary">
              {typeof window !== "undefined" ? window.location.origin : ""}/api/public/sync-reviews?token={googleSync.webhookToken}
            </code>
            <p className="text-[10px] mt-1">Bu linki hər gün və ya hər həftə çağırmaq üçün <a href="https://cron-job.org" target="_blank" rel="noreferrer" className="underline text-primary">cron-job.org</a> kimi pulsuz xidmətdə qeyd edə bilərsiniz.</p>
          </div>
        )}
        
        <div className="pt-2">
          <button
            onClick={handleSync}
            disabled={syncing || !googleSync.apiKey || !googleSync.placeId}
            className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/95 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {syncing ? (
              <>
                <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                Sinxronizasiya olunur...
              </>
            ) : (
              "Rəyləri İndi Sinxron Et"
            )}
          </button>
        </div>
      </Card>

      <style>{`.inp { width:100%; padding:.5rem .75rem; background:hsl(var(--background)); border:1px solid hsl(var(--border)); border-radius:.375rem; outline:none; transition: border-color 0.15s; } .inp:focus { border-color: hsl(var(--primary)); }`}</style>
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
  onSave,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onSave: () => void;
}) {
  return (
    <div className="bg-card border border-border/40 rounded-xl p-6">
      <div className="flex justify-between items-start mb-4 gap-3">
        <div>
          <h2 className="font-display text-xl">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <button
          onClick={onSave}
          className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-gradient-gold text-primary-foreground text-sm rounded-md hover:opacity-90 transition"
        >
          <Save className="h-4 w-4" /> Yadda saxla
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      {children}
    </div>
  );
}

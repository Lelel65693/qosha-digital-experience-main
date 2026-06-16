import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { q as q$5, n as updateSiteSetting, o as syncGoogleReviews } from "./router-Cyx6-Q3j.mjs";
import { a as useSuspenseQuery, b as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { G as Globe, x as CircleCheckBig, t as Save } from "../_libs/lucide-react.mjs";
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
const DAYS = [{
  key: "mon",
  label: "Bazar ertəsi"
}, {
  key: "tue",
  label: "Çərşənbə axşamı"
}, {
  key: "wed",
  label: "Çərşənbə"
}, {
  key: "thu",
  label: "Cümə axşamı"
}, {
  key: "fri",
  label: "Cümə"
}, {
  key: "sat",
  label: "Şənbə"
}, {
  key: "sun",
  label: "Bazar"
}];
function SettingsAdmin() {
  const {
    data: settings
  } = useSuspenseQuery(q$5);
  const qc = useQueryClient();
  const [contact, setContact] = reactExports.useState(settings.contact_info ?? {});
  const [hours, setHours] = reactExports.useState(settings.working_hours ?? {});
  const [banner, setBanner] = reactExports.useState(settings.announcement_banner ?? {});
  const [social, setSocial] = reactExports.useState(settings.social_links ?? {});
  const [googleSync, setGoogleSync] = reactExports.useState(settings.google_reviews_settings ?? {
    apiKey: "",
    placeId: ""
  });
  const [syncing, setSyncing] = reactExports.useState(false);
  const save = async (key, value) => {
    try {
      await updateSiteSetting({
        data: {
          key,
          value
        }
      });
      toast.success("Yadda saxlanıldı — saytda dərhal aktiv olur");
      qc.invalidateQueries({
        queryKey: ["site-settings"]
      });
    } catch (e) {
      toast.error(e.message);
    }
  };
  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await syncGoogleReviews();
      toast.success(`${res.synced} yeni rəy Google-dan idxal edildi!`);
      qc.invalidateQueries({
        queryKey: ["admin-reviews"]
      });
      qc.invalidateQueries({
        queryKey: ["reviews"]
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSyncing(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 max-w-3xl space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl mb-1", children: "Sayt Ayarları" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-emerald-500 mt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3.5 w-3.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Burada yadda saxlanan bütün məlumatlar saytın əsas səhifəsində, əlaqə bölməsində və altbilgidə ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "avtomatik" }),
          " göstərilir"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "📢 Elan Banneri", subtitle: "Saytın yuxarısında qızılı rəngli elan şeridi", onSave: () => save("announcement_banner", banner), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 p-3 bg-muted/30 rounded-lg cursor-pointer select-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "w-4 h-4 accent-primary", checked: banner.active ?? false, onChange: (e) => setBanner({
          ...banner,
          active: e.target.checked
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Aktiv et — saytın yuxarısında göstər" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Mətn (Azərbaycanca)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: banner.text_az || "", onChange: (e) => setBanner({
        ...banner,
        text_az: e.target.value
      }), className: "inp", placeholder: "Yeni il endirimləri başladı! 🎉" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Mətn (Rusca)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: banner.text_ru || "", onChange: (e) => setBanner({
        ...banner,
        text_ru: e.target.value
      }), className: "inp", placeholder: "Новогодние скидки начались! 🎉" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Mətn (İngiliscə)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: banner.text_en || "", onChange: (e) => setBanner({
        ...banner,
        text_en: e.target.value
      }), className: "inp", placeholder: "New Year discounts started! 🎉" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "📞 Əlaqə Məlumatları", subtitle: "Əlaqə səhifəsi və altbilgidə göstərilir", onSave: () => save("contact_info", contact), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Əsas Telefon", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: contact.phone || "", onChange: (e) => setContact({
        ...contact,
        phone: e.target.value
      }), className: "inp", placeholder: "+994 50 790 88 88" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "İkinci Telefon (əlavə nömrə)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: contact.phone2 || "", onChange: (e) => setContact({
        ...contact,
        phone2: e.target.value
      }), className: "inp", placeholder: "+994 51 615 88 88" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "E-poçt", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: contact.email || "", onChange: (e) => setContact({
        ...contact,
        email: e.target.value
      }), className: "inp", placeholder: "info@qoshaqala.az" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Ünvan", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: contact.address || "", onChange: (e) => setContact({
        ...contact,
        address: e.target.value
      }), className: "inp", placeholder: "Buzovna, Bağlar Massivi 67, Mərdəkan, Bakı" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Xəritə eni (lat)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.0001", value: contact.map_lat || "", onChange: (e) => setContact({
          ...contact,
          map_lat: Number(e.target.value)
        }), className: "inp" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Xəritə uzunu (lng)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.0001", value: contact.map_lng || "", onChange: (e) => setContact({
          ...contact,
          map_lng: Number(e.target.value)
        }), className: "inp" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "🕐 İş Saatları", subtitle: "Əlaqə səhifəsindəki iş saatları bölməsini idarə edir", onSave: () => save("working_hours", hours), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: DAYS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-36 text-sm text-muted-foreground", children: d.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: hours[d.key] || "", onChange: (e) => setHours({
          ...hours,
          [d.key]: e.target.value
        }), placeholder: "10:00–23:00  (boş = qapalı)", className: "inp flex-1 font-mono text-sm" })
      ] }, d.key)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
        "Məsələn: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-muted px-1 rounded", children: "10:00–01:00" }),
        " · Qapalı günlər üçün sahəni boş buraxın"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "🌐 Sosial Şəbəkələr", subtitle: "Altbilgi və əlaqə səhifəsindəki linklər", onSave: () => save("social_links", social), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Instagram URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: social.instagram || "", onChange: (e) => setSocial({
        ...social,
        instagram: e.target.value
      }), className: "inp", placeholder: "https://instagram.com/qoshaqala" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "WhatsApp nömrəsi (rəqəmlər)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: social.whatsapp || "", onChange: (e) => setSocial({
        ...social,
        whatsapp: e.target.value
      }), className: "inp", placeholder: "994507908888" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Facebook URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: social.facebook || "", onChange: (e) => setSocial({
        ...social,
        facebook: e.target.value
      }), className: "inp", placeholder: "https://facebook.com/qoshaqala" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { title: "⭐ Google Maps Sinxronizasiyası", subtitle: "Rəyləri Google-dan avtomatik sayta idxal edin", onSave: () => save("google_reviews_settings", googleSync), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Google Place ID", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: googleSync.placeId || "", onChange: (e) => setGoogleSync({
        ...googleSync,
        placeId: e.target.value
      }), className: "inp", placeholder: "Məsələn: ChIJ3dXzGWg_MDQRo-VwJEPFYq0" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Google Places API Key", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: googleSync.apiKey || "", onChange: (e) => setGoogleSync({
        ...googleSync,
        apiKey: e.target.value
      }), className: "inp", placeholder: "Google Cloud Console API Açarınız" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Avtomatik Sinxronizasiya Tokeni (Webhook Token)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: googleSync.webhookToken || "", onChange: (e) => setGoogleSync({
        ...googleSync,
        webhookToken: e.target.value
      }), className: "inp", placeholder: "Məsələn: qoshaqala-secure-sync-token-123" }) }),
      googleSync.webhookToken && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground bg-muted/30 p-2.5 rounded border border-border/40 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Avtomatik sinxronizasiya linki (Cron / Webhook):" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("code", { className: "block break-all bg-background p-1.5 rounded select-all font-mono text-[10px] text-primary", children: [
          typeof window !== "undefined" ? window.location.origin : "",
          "/api/public/sync-reviews?token=",
          googleSync.webhookToken
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] mt-1", children: [
          "Bu linki hər gün və ya hər həftə çağırmaq üçün ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://cron-job.org", target: "_blank", rel: "noreferrer", className: "underline text-primary", children: "cron-job.org" }),
          " kimi pulsuz xidmətdə qeyd edə bilərsiniz."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSync, disabled: syncing || !googleSync.apiKey || !googleSync.placeId, className: "w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/95 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2", children: syncing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" }),
        "Sinxronizasiya olunur..."
      ] }) : "Rəyləri İndi Sinxron Et" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `.inp { width:100%; padding:.5rem .75rem; background:hsl(var(--background)); border:1px solid hsl(var(--border)); border-radius:.375rem; outline:none; transition: border-color 0.15s; } .inp:focus { border-color: hsl(var(--primary)); }` })
  ] });
}
function Card({
  title,
  subtitle,
  children,
  onSave
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/40 rounded-xl p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl", children: title }),
        subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: subtitle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onSave, className: "flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-gradient-gold text-primary-foreground text-sm rounded-md hover:opacity-90 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
        " Yadda saxla"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground mb-1 block", children: label }),
    children
  ] });
}
export {
  SettingsAdmin as component
};

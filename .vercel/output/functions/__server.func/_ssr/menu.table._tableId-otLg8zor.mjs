import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { V as Route$3, W as ctxQ, X as menuQ, Y as categoriesQ, Z as settingsQ } from "./router-Cyx6-Q3j.mjs";
import { a as getImageSrc } from "./image-src-Blq9uxfN.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { L as LanguageSwitcher } from "./LanguageSwitcher-DVGXWYX_.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { $ as TriangleAlert, P as Phone, y as MessageCircle, Y as Calendar, X, N as Scale, j as Clock, n as Flame } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
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
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/use-sync-external-store.mjs";
function QrMenuPage() {
  const {
    tableId
  } = Route$3.useParams();
  const n = Number(tableId);
  const {
    t,
    i18n
  } = useTranslation();
  const {
    data: ctx
  } = useSuspenseQuery(ctxQ(n));
  const {
    data: items
  } = useSuspenseQuery(menuQ);
  const {
    data: categories
  } = useSuspenseQuery(categoriesQ);
  const {
    data: siteSettings
  } = useSuspenseQuery(settingsQ);
  const [activeCategory, setActiveCategory] = reactExports.useState("all");
  const [selectedItem, setSelectedItem] = reactExports.useState(null);
  const [isOffline, setIsOffline] = reactExports.useState(false);
  const navRef = reactExports.useRef(null);
  const isScrollingRef = reactExports.useRef(false);
  const table = ctx.table;
  const template = ctx.template;
  const lang = i18n.language || "az";
  reactExports.useEffect(() => {
    if (template?.lang_default && i18n.language !== template.lang_default) {
      i18n.changeLanguage(template.lang_default);
    }
  }, [template?.lang_default]);
  reactExports.useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsOffline(!navigator.onLine);
    }
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").then((reg) => console.log("SW registered on route:", reg.scope)).catch((err) => console.error("SW registration failed:", err));
    }
  }, []);
  const allowedCategories = reactExports.useMemo(() => {
    if (ctx.visibleCategorySlugs?.length) {
      return categories.filter((c) => ctx.visibleCategorySlugs.includes(c.slug));
    }
    const mf = table?.menu_filter;
    if (mf && mf.length && !mf.includes("all")) {
      return categories.filter((c) => mf.includes(c.slug));
    }
    return categories.filter((c) => c.is_active);
  }, [categories, ctx.visibleCategorySlugs, table]);
  const allowedSlugs = reactExports.useMemo(() => allowedCategories.map((c) => c.slug), [allowedCategories]);
  const groupedItems = reactExports.useMemo(() => {
    const filtered = items.filter((i) => allowedSlugs.includes(i.category));
    const groups = {};
    for (const item of filtered) {
      (groups[item.category] ||= []).push(item);
    }
    for (const slug of Object.keys(groups)) {
      groups[slug].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }
    return groups;
  }, [items, allowedSlugs]);
  reactExports.useEffect(() => {
    if (isScrollingRef.current) return;
    const observerOptions = {
      root: null,
      rootMargin: "-120px 0px -60% 0px",
      // triggers when category header enters viewport top
      threshold: 0
    };
    const observer = new IntersectionObserver((entries) => {
      if (isScrollingRef.current) return;
      const visibleEntry = entries.find((e) => e.isIntersecting);
      if (visibleEntry) {
        const slug = visibleEntry.target.id.replace("sec-", "");
        setActiveCategory(slug);
        const tabEl = document.getElementById(`tab-${slug}`);
        if (tabEl && navRef.current) {
          navRef.current.scrollTo({
            left: tabEl.offsetLeft - 16,
            behavior: "smooth"
          });
        }
      }
    }, observerOptions);
    allowedSlugs.forEach((slug) => {
      const el = document.getElementById(`sec-${slug}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [allowedSlugs]);
  const scrollToCategory = (slug) => {
    setActiveCategory(slug);
    const el = document.getElementById(`sec-${slug}`);
    if (el) {
      isScrollingRef.current = true;
      const yOffset = -110;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: "smooth"
      });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  };
  const accentColor = template?.accent_color || "#C9A84C";
  const showPrices = template?.show_prices ?? true;
  if (!table) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center p-6 text-center bg-[#0A0A0A] text-[#F5F0E8]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl mb-2", children: "Masa tapılmadı" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
        "Masa #",
        n
      ] })
    ] }) });
  }
  const getLoc = (obj, prefix) => {
    return obj[`${prefix}_${lang}`] || obj[`${prefix}_az`] || "";
  };
  const contacts = siteSettings.contact_info || {};
  const phoneVal = contacts.phone1 || "+994 50 615 88 88";
  const cleanPhone = phoneVal.replace(/[^0-9+]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Salam, masa #" + table.table_number + " üçün menyu haqqında kömək istəyirəm.")}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#0A0A0A] text-[#F5F0E8] font-sans pb-28 relative", children: [
    isOffline && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-500 text-black px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 sticky top-0 z-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Offline rejim — qiymətlər dəyişmiş ola bilər" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-[#111111]/90 backdrop-blur-md sticky top-0 z-40 border-b border-border/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-[#1A1A1A] border border-border/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold text-[#C9A84C]", children: "QQ" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-bold tracking-wider", style: {
              color: accentColor
            }, children: "QOŞA QALA" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-[#9E9E9E]", children: [
              "Masa #",
              table.table_number
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSwitcher, {}) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-1 bg-gold/5 border-t border-border/5 text-[10px] text-center text-[#C9A84C] font-semibold", children: [
        "Xidmət haqqı: ",
        contacts.service_charge || 10,
        "%"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: navRef, className: "overflow-x-auto px-4 py-2.5 flex gap-2 scrollbar-hide bg-[#111111] border-t border-border/5", children: allowedCategories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { id: `tab-${c.slug}`, onClick: () => scrollToCategory(c.slug), className: `px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${activeCategory === c.slug ? "bg-gradient-gold text-primary-foreground border-transparent font-bold" : "bg-[#1A1A1A] border-border/10 text-[#9E9E9E] hover:text-white"}`, style: activeCategory === c.slug ? {
        background: `linear-gradient(135deg, ${accentColor} 0%, #8B6914 100%)`,
        color: "#0A0A0A"
      } : void 0, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1", children: c.icon }),
        getLoc(c, "name")
      ] }, c.id)) })
    ] }),
    table.custom_message && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-4 mt-4 p-4 rounded-xl bg-[#111111] border border-border/10 text-xs leading-relaxed text-[#9E9E9E]", children: [
      "💬 ",
      table.custom_message
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "px-4 pt-4 space-y-6", children: allowedCategories.map((c) => {
      const catItems = groupedItems[c.slug] || [];
      if (!catItems.length) return null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: `sec-${c.slug}`, className: "pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-bold tracking-wider mb-4 border-b border-border/10 pb-1.5 flex items-center gap-2", style: {
          color: accentColor
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: getLoc(c, "name") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: catItems.map((item) => {
          const title = getLoc(item, "name");
          const desc = getLoc(item, "desc");
          const hasBadges = item.badges && item.badges.length > 0;
          const isChefSpecial = item.badges?.includes("chef-special");
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedItem(item), className: "w-full text-left bg-[#111111] hover:border-gold/30 rounded-xl overflow-hidden border border-border/10 flex flex-col justify-between group transition-all", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[4/3] bg-neutral-900 overflow-hidden w-full", children: [
              item.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getImageSrc(item.image_url), alt: title, className: "w-full h-full object-cover group-hover:scale-105 transition duration-300", loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-[#9E9E9E] text-2xl font-serif", children: "🍽️" }),
              hasBadges && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 left-2 flex flex-col gap-1 z-10", children: [
                item.badges.includes("new") && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-emerald-500 text-black font-bold text-[9px] px-1.5 py-0.5 rounded uppercase", children: "🆕 Yeni" }),
                item.badges.includes("popular") && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-amber-500 text-black font-bold text-[9px] px-1.5 py-0.5 rounded uppercase", children: "🔥 Populyar" }),
                isChefSpecial && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-rose-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded uppercase", children: "⭐ Şefin Seçimi" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex-1 flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between gap-1 items-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm leading-snug line-clamp-2 text-[#F5F0E8]", children: title }) }),
                desc && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-[#9E9E9E] line-clamp-2 mt-1 leading-normal", children: desc })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-2 border-t border-border/5 flex items-center justify-between flex-wrap gap-1", children: [
                showPrices ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                  item.old_price && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-[#9E9E9E] line-through", children: [
                    item.old_price,
                    " ₼"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold font-serif", style: {
                    color: accentColor
                  }, children: [
                    item.price,
                    " ₼"
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[#9E9E9E]", children: "Sifariş üçün" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  (item.spicy_level ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex text-rose-500 text-[10px]", children: Array.from({
                    length: item.spicy_level ?? 0
                  }).map((_, k) => "🌶") }),
                  item.weight_grams && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-[#9E9E9E]", children: [
                    item.weight_grams,
                    "q"
                  ] })
                ] })
              ] })
            ] })
          ] }, item.id);
        }) })
      ] }, c.slug);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "fixed bottom-0 left-0 right-0 z-40 bg-[#111111]/95 backdrop-blur-lg border-t border-border/15 p-3 flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `tel:${cleanPhone}`, className: "flex-1 py-3 bg-[#1A1A1A] hover:bg-[#252525] border border-border/10 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 text-[#F5F0E8]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 text-[#C9A84C]" }),
        "Zəng Et"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: whatsappUrl, target: "_blank", rel: "noreferrer", className: "flex-1 py-3 bg-[#1A1A1A] hover:bg-[#252525] border border-border/10 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 text-[#F5F0E8]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4 text-emerald-500" }),
        "WhatsApp"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/reservation", className: "flex-1 py-3 bg-gradient-gold text-primary-foreground font-bold rounded-xl text-xs text-center flex items-center justify-center gap-2", style: {
        background: `linear-gradient(135deg, ${accentColor} 0%, #8B6914 100%)`,
        color: "#0A0A0A"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
        "Rezervasiya"
      ] })
    ] }),
    selectedItem && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/85 z-50 flex items-end justify-center transition-opacity", onClick: () => setSelectedItem(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#111111] border-t border-border/15 rounded-t-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto animate-slideUp z-50 flex flex-col", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[16/9] w-full bg-neutral-900", children: [
        selectedItem.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getImageSrc(selectedItem.image_url), alt: getLoc(selectedItem, "name"), className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-4xl", children: "🍽️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedItem(null), className: "absolute top-4 right-4 bg-black/60 backdrop-blur-sm p-2 rounded-full border border-border/10 text-white hover:bg-black/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-[#F5F0E8]", children: getLoc(selectedItem, "name") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mt-2", children: [
              selectedItem.badges?.includes("new") && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-emerald-500/10 text-emerald-500 font-bold text-[9px] px-2 py-0.5 rounded", children: "🆕 Yeni" }),
              selectedItem.badges?.includes("popular") && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-amber-500/10 text-amber-500 font-bold text-[9px] px-2 py-0.5 rounded", children: "🔥 Populyar" }),
              selectedItem.badges?.includes("chef-special") && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-rose-500/10 text-rose-500 font-bold text-[9px] px-2 py-0.5 rounded", children: "⭐ Şefin Özəli" }),
              selectedItem.spicy_level > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-rose-500/10 text-rose-500 font-bold text-[9px] px-2 py-0.5 rounded flex items-center", children: [
                "🌶 ",
                Array.from({
                  length: selectedItem.spicy_level
                }).map(() => "🌶")
              ] })
            ] })
          ] }),
          showPrices && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-bold font-serif block", style: {
              color: accentColor
            }, children: [
              selectedItem.price,
              " ₼"
            ] }),
            selectedItem.old_price && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-[#9E9E9E] line-through block mt-0.5", children: [
              selectedItem.old_price,
              " ₼"
            ] })
          ] })
        ] }),
        getLoc(selectedItem, "desc") && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[#9E9E9E] leading-relaxed border-t border-border/5 pt-3", children: getLoc(selectedItem, "desc") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 border-t border-b border-border/5 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[#9E9E9E] uppercase block mb-1", children: "Çəki" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold flex justify-center items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-3.5 w-3.5 text-[#C9A84C]" }),
              selectedItem.weight_grams ? `${selectedItem.weight_grams} q` : "—"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center border-l border-r border-border/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[#9E9E9E] uppercase block mb-1", children: "Hazırlanma" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold flex justify-center items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-[#C9A84C]" }),
              selectedItem.cooking_time ? `${selectedItem.cooking_time} dəq` : "—"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[#9E9E9E] uppercase block mb-1", children: "Kalori" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold flex justify-center items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3.5 w-3.5 text-[#C9A84C]" }),
              selectedItem.calories ? `${selectedItem.calories} kcal` : "—"
            ] })
          ] })
        ] }),
        selectedItem.allergens && selectedItem.allergens.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-[#9E9E9E]", children: "⚠️ Allergenlər" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: selectedItem.allergens.map((alg) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 bg-[#1C1C1C] border border-border/5 rounded", children: alg }, alg)) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        .bg-gradient-gold {
          background: linear-gradient(135deg, #C9A84C 0%, #8B6914 100%);
          color: #0A0A0A;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      ` })
  ] });
}
export {
  QrMenuPage as component
};

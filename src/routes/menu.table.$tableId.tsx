import { getImageSrc } from "@/lib/image-src";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState, useMemo, useEffect, useRef } from "react";
import { Phone, Flame, Clock, Scale, MessageCircle, Calendar, X, Globe, AlertTriangle } from "lucide-react";
import { getMenuItems, getQrContext, getMenuCategories, getSiteSettings } from "@/lib/restaurant.functions";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

// Query options
const ctxQ = (n: number) =>
  queryOptions({
    queryKey: ["qr-context", n],
    queryFn: () => getQrContext({ data: { tableNumber: n } }),
  });

const menuQ = queryOptions({ queryKey: ["menu_items"], queryFn: () => getMenuItems() });
const categoriesQ = queryOptions({ queryKey: ["menu_categories"], queryFn: () => getMenuCategories() });
const settingsQ = queryOptions({ queryKey: ["site_settings"], queryFn: () => getSiteSettings() });

export const Route = createFileRoute("/menu/table/$tableId")({
  loader: async ({ context, params }) => {
    const n = Number(params.tableId);
    if (!Number.isFinite(n)) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(ctxQ(n)),
      context.queryClient.ensureQueryData(menuQ),
      context.queryClient.ensureQueryData(categoriesQ),
      context.queryClient.ensureQueryData(settingsQ),
    ]);
  },
  component: QrMenuPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center bg-[#0A0A0A] text-[#F5F0E8]">
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function QrMenuPage() {
  const { tableId } = Route.useParams();
  const n = Number(tableId);
  const { t, i18n } = useTranslation();
  
  const { data: ctx } = useSuspenseQuery(ctxQ(n));
  const { data: items } = useSuspenseQuery(menuQ);
  const { data: categories } = useSuspenseQuery(categoriesQ);
  const { data: siteSettings } = useSuspenseQuery(settingsQ);

  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const table = ctx.table;
  const template = ctx.template;
  const lang = (i18n.language || "az") as "az" | "ru" | "en";

  // Handle template default language
  useEffect(() => {
    if (template?.lang_default && i18n.language !== template.lang_default) {
      i18n.changeLanguage(template.lang_default);
    }
  }, [template?.lang_default]);

  // Offline status listener
  useEffect(() => {
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

  // PWA Service Worker Registration
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("SW registered on route:", reg.scope))
        .catch((err) => console.error("SW registration failed:", err));
    }
  }, []);

  // Filter allowed categories based on template or table menu filter
  const allowedCategories = useMemo(() => {
    if (ctx.visibleCategorySlugs?.length) {
      return categories.filter((c) => ctx.visibleCategorySlugs!.includes(c.slug));
    }
    const mf = (table as any)?.menu_filter as string[] | undefined;
    if (mf && mf.length && !mf.includes("all")) {
      return categories.filter((c) => mf.includes(c.slug));
    }
    return categories.filter((c) => c.is_active);
  }, [categories, ctx.visibleCategorySlugs, table]);

  // Allowed category slugs
  const allowedSlugs = useMemo(() => allowedCategories.map((c) => c.slug), [allowedCategories]);

  // Filter menu items by allowed categories and current active tab
  const groupedItems = useMemo(() => {
    const filtered = items.filter((i) => allowedSlugs.includes(i.category));
    const groups: Record<string, typeof items> = {};
    
    // Group all allowed items
    for (const item of filtered) {
      (groups[item.category] ||= []).push(item);
    }
    
    // Sort items inside each category by sort_order
    for (const slug of Object.keys(groups)) {
      groups[slug].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }
    
    return groups;
  }, [items, allowedSlugs]);

  // Intersection Observer for category sync
  useEffect(() => {
    if (isScrollingRef.current) return;
    
    const observerOptions = {
      root: null,
      rootMargin: "-120px 0px -60% 0px", // triggers when category header enters viewport top
      threshold: 0,
    };
    
    const observer = new IntersectionObserver((entries) => {
      if (isScrollingRef.current) return;
      
      const visibleEntry = entries.find((e) => e.isIntersecting);
      if (visibleEntry) {
        const slug = visibleEntry.target.id.replace("sec-", "");
        setActiveCategory(slug);
        
        // Scroll navigation bar into view
        const tabEl = document.getElementById(`tab-${slug}`);
        if (tabEl && navRef.current) {
          navRef.current.scrollTo({
            left: tabEl.offsetLeft - 16,
            behavior: "smooth",
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

  // Scroll to category
  const scrollToCategory = (slug: string) => {
    setActiveCategory(slug);
    const el = document.getElementById(`sec-${slug}`);
    if (el) {
      isScrollingRef.current = true;
      const yOffset = -110; // offset header
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: "smooth" });
      
      // Release scroll block after animation completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  };

  const accentColor = template?.accent_color || "#C9A84C";
  const showPrices = template?.show_prices ?? true;

  if (!table) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center bg-[#0A0A0A] text-[#F5F0E8]">
        <div>
          <h1 className="font-display text-2xl mb-2">Masa tapılmadı</h1>
          <p className="text-muted-foreground">Masa #{n}</p>
        </div>
      </div>
    );
  }

  // Get localized strings helper
  const getLoc = (obj: any, prefix: string) => {
    return obj[`${prefix}_${lang}`] || obj[`${prefix}_az`] || "";
  };

  // Contacts from settings
  const contacts = siteSettings.contact_info || {};
  const phoneVal = contacts.phone1 || "+994 50 615 88 88";
  const cleanPhone = phoneVal.replace(/[^0-9+]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Salam, masa #" + table.table_number + " üçün menyu haqqında kömək istəyirəm.")}`;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] font-sans pb-28 relative">
      
      {/* OFFLINE BANNER */}
      {isOffline && (
        <div className="bg-amber-500 text-black px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 sticky top-0 z-50">
          <AlertTriangle className="h-4 w-4" />
          <span>Offline rejim — qiymətlər dəyişmiş ola bilər</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <header className="bg-[#111111]/90 backdrop-blur-md sticky top-0 z-40 border-b border-border/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Embedded mini logo */}
            <div className="h-9 w-9 rounded-full bg-[#1A1A1A] border border-border/10 flex items-center justify-center">
              <span className="font-display text-sm font-bold text-[#C9A84C]">QQ</span>
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-wider" style={{ color: accentColor }}>QOŞA QALA</h1>
              <p className="text-[10px] text-[#9E9E9E]">Masa #{table.table_number}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </div>

        {/* SERVICE FEE BANNER */}
        <div className="px-4 py-1 bg-gold/5 border-t border-border/5 text-[10px] text-center text-[#C9A84C] font-semibold">
          Xidmət haqqı: {contacts.service_charge || 10}%
        </div>

        {/* STICKY CATEGORY NAV */}
        <div 
          ref={navRef}
          className="overflow-x-auto px-4 py-2.5 flex gap-2 scrollbar-hide bg-[#111111] border-t border-border/5"
        >
          {allowedCategories.map((c) => (
            <button
              id={`tab-${c.slug}`}
              key={c.id}
              onClick={() => scrollToCategory(c.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                activeCategory === c.slug
                  ? "bg-gradient-gold text-primary-foreground border-transparent font-bold"
                  : "bg-[#1A1A1A] border-border/10 text-[#9E9E9E] hover:text-white"
              }`}
              style={activeCategory === c.slug ? { background: `linear-gradient(135deg, ${accentColor} 0%, #8B6914 100%)`, color: "#0A0A0A" } : undefined}
            >
              <span className="mr-1">{c.icon}</span>
              {getLoc(c, "name")}
            </button>
          ))}
        </div>
      </header>

      {/* CUSTOM HELLO MESSAGE */}
      {table.custom_message && (
        <section className="mx-4 mt-4 p-4 rounded-xl bg-[#111111] border border-border/10 text-xs leading-relaxed text-[#9E9E9E]">
          💬 {table.custom_message}
        </section>
      )}

      {/* MENU ITEMS GRID SECTION */}
      <main className="px-4 pt-4 space-y-6">
        {allowedCategories.map((c) => {
          const catItems = groupedItems[c.slug] || [];
          if (!catItems.length) return null;
          
          return (
            <section key={c.slug} id={`sec-${c.slug}`} className="pt-2">
              <h2 
                className="font-display text-xl font-bold tracking-wider mb-4 border-b border-border/10 pb-1.5 flex items-center gap-2"
                style={{ color: accentColor }}
              >
                <span>{c.icon}</span>
                <span>{getLoc(c, "name")}</span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {catItems.map((item) => {
                  const title = getLoc(item, "name");
                  const desc = getLoc(item, "desc");
                  const hasBadges = item.badges && item.badges.length > 0;
                  const isChefSpecial = item.badges?.includes("chef-special");
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="w-full text-left bg-[#111111] hover:border-gold/30 rounded-xl overflow-hidden border border-border/10 flex flex-col justify-between group transition-all"
                    >
                      {/* Image container */}
                      <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden w-full">
                        {item.image_url ? (
                          <img 
                            src={getImageSrc(item.image_url)} 
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#9E9E9E] text-2xl font-serif">
                            🍽️
                          </div>
                        )}
                        
                        {/* Custom tags/badges overlay */}
                        {hasBadges && (
                          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                            {item.badges.includes("new") && (
                              <span className="bg-emerald-500 text-black font-bold text-[9px] px-1.5 py-0.5 rounded uppercase">🆕 Yeni</span>
                            )}
                            {item.badges.includes("popular") && (
                              <span className="bg-amber-500 text-black font-bold text-[9px] px-1.5 py-0.5 rounded uppercase">🔥 Populyar</span>
                            )}
                            {isChefSpecial && (
                              <span className="bg-rose-500 text-white font-bold text-[9px] px-1.5 py-0.5 rounded uppercase">⭐ Şefin Seçimi</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Content panel */}
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between gap-1 items-start">
                            <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-[#F5F0E8]">{title}</h3>
                          </div>
                          {desc && (
                            <p className="text-[11px] text-[#9E9E9E] line-clamp-2 mt-1 leading-normal">{desc}</p>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-border/5 flex items-center justify-between flex-wrap gap-1">
                          {/* Price */}
                          {showPrices ? (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {item.old_price && (
                                <span className="text-[10px] text-[#9E9E9E] line-through">
                                  {item.old_price} ₼
                                </span>
                              )}
                              <span className="text-xs font-bold font-serif" style={{ color: accentColor }}>
                                {item.price} ₼
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-[#9E9E9E]">Sifariş üçün</span>
                          )}

                          {/* Quick indicators */}
                          <div className="flex items-center gap-1">
                            {(item.spicy_level ?? 0) > 0 && (
                              <span className="flex text-rose-500 text-[10px]">
                                {Array.from({ length: item.spicy_level ?? 0 }).map((_, k) => "🌶")}
                              </span>
                            )}
                            {item.weight_grams && (
                              <span className="text-[10px] text-[#9E9E9E]">{item.weight_grams}q</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* STICKY BOTTOM CTA BAR */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#111111]/95 backdrop-blur-lg border-t border-border/15 p-3 flex gap-2">
        <a 
          href={`tel:${cleanPhone}`}
          className="flex-1 py-3 bg-[#1A1A1A] hover:bg-[#252525] border border-border/10 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 text-[#F5F0E8]"
        >
          <Phone className="h-4 w-4 text-[#C9A84C]" />
          Zəng Et
        </a>

        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-3 bg-[#1A1A1A] hover:bg-[#252525] border border-border/10 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 text-[#F5F0E8]"
        >
          <MessageCircle className="h-4 w-4 text-emerald-500" />
          WhatsApp
        </a>

        <Link 
          to="/reservation"
          className="flex-1 py-3 bg-gradient-gold text-primary-foreground font-bold rounded-xl text-xs text-center flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #8B6914 100%)`, color: "#0A0A0A" }}
        >
          <Calendar className="h-4 w-4" />
          Rezervasiya
        </Link>
      </footer>

      {/* ITEM DETAIL BOTTOM SHEET MODAL */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/85 z-50 flex items-end justify-center transition-opacity"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-[#111111] border-t border-border/15 rounded-t-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto animate-slideUp z-50 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative aspect-[16/9] w-full bg-neutral-900">
              {selectedItem.image_url ? (
                <img 
                  src={getImageSrc(selectedItem.image_url)} 
                  alt={getLoc(selectedItem, "name")} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  🍽️
                </div>
              )}
              
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm p-2 rounded-full border border-border/10 text-white hover:bg-black/90"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Contents */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#F5F0E8]">{getLoc(selectedItem, "name")}</h2>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedItem.badges?.includes("new") && (
                      <span className="bg-emerald-500/10 text-emerald-500 font-bold text-[9px] px-2 py-0.5 rounded">🆕 Yeni</span>
                    )}
                    {selectedItem.badges?.includes("popular") && (
                      <span className="bg-amber-500/10 text-amber-500 font-bold text-[9px] px-2 py-0.5 rounded">🔥 Populyar</span>
                    )}
                    {selectedItem.badges?.includes("chef-special") && (
                      <span className="bg-rose-500/10 text-rose-500 font-bold text-[9px] px-2 py-0.5 rounded">⭐ Şefin Özəli</span>
                    )}
                    {selectedItem.spicy_level > 0 && (
                      <span className="bg-rose-500/10 text-rose-500 font-bold text-[9px] px-2 py-0.5 rounded flex items-center">
                        🌶 {Array.from({ length: selectedItem.spicy_level }).map(() => "🌶")}
                      </span>
                    )}
                  </div>
                </div>

                {showPrices && (
                  <div className="text-right">
                    <span className="text-2xl font-bold font-serif block" style={{ color: accentColor }}>
                      {selectedItem.price} ₼
                    </span>
                    {selectedItem.old_price && (
                      <span className="text-xs text-[#9E9E9E] line-through block mt-0.5">
                        {selectedItem.old_price} ₼
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {getLoc(selectedItem, "desc") && (
                <p className="text-sm text-[#9E9E9E] leading-relaxed border-t border-border/5 pt-3">
                  {getLoc(selectedItem, "desc")}
                </p>
              )}

              {/* Metadata details */}
              <div className="grid grid-cols-3 gap-3 border-t border-b border-border/5 py-4">
                <div className="text-center">
                  <span className="text-[10px] text-[#9E9E9E] uppercase block mb-1">Çəki</span>
                  <span className="text-xs font-semibold flex justify-center items-center gap-1">
                    <Scale className="h-3.5 w-3.5 text-[#C9A84C]" />
                    {selectedItem.weight_grams ? `${selectedItem.weight_grams} q` : "—"}
                  </span>
                </div>
                <div className="text-center border-l border-r border-border/5">
                  <span className="text-[10px] text-[#9E9E9E] uppercase block mb-1">Hazırlanma</span>
                  <span className="text-xs font-semibold flex justify-center items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#C9A84C]" />
                    {selectedItem.cooking_time ? `${selectedItem.cooking_time} dəq` : "—"}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-[#9E9E9E] uppercase block mb-1">Kalori</span>
                  <span className="text-xs font-semibold flex justify-center items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-[#C9A84C]" />
                    {selectedItem.calories ? `${selectedItem.calories} kcal` : "—"}
                  </span>
                </div>
              </div>

              {/* Allergens */}
              {selectedItem.allergens && selectedItem.allergens.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#9E9E9E]">⚠️ Allergenlər</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.allergens.map((alg: string) => (
                      <span key={alg} className="text-[10px] px-2 py-0.5 bg-[#1C1C1C] border border-border/5 rounded">
                        {alg}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PWA bottom sheet slide anim */}
      <style>{`
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
      `}</style>
    </div>
  );
}

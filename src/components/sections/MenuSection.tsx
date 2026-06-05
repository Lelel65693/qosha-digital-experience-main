import { getImageSrc } from "@/lib/image-src";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Flame, Clock, Scale } from "lucide-react";
import { getMenuItems } from "@/lib/restaurant.functions";
import { SectionHeading } from "@/components/SectionHeading";
import { useMenuSync } from "@/hooks/use-menu-sync";
import { MenuItemDialog } from "@/components/MenuItemDialog";

export const menuQueryOptions = queryOptions({
  queryKey: ["menu_items"],
  queryFn: () => getMenuItems(),
});

const CATEGORIES = [
  "all", "cold-appetizers", "hot-appetizers", "salads", "main-dishes",
  "bbq", "seafood", "desserts", "drinks", "alcohol",
];

export function MenuSection({ limit }: { limit?: number }) {
  const { t, i18n } = useTranslation();
  useMenuSync();
  const { data: items } = useSuspenseQuery(menuQueryOptions);
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<any | null>(null);
  const lang = i18n.language as "az" | "ru" | "en";

  const filtered = useMemo(() => {
    let list = items;
    if (cat !== "all") list = list.filter((i) => i.category === cat);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((i) =>
        [i.name_az, i.name_ru, i.name_en, i.desc_az, i.desc_ru, i.desc_en]
          .some((x) => x?.toLowerCase().includes(q))
      );
    }
    return limit ? list.slice(0, limit) : list;
  }, [items, cat, search, limit]);

  const nameKey = `name_${lang}` as const;
  const descKey = `desc_${lang}` as const;

  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("menu.title")} subtitle={t("menu.subtitle")} />

        <div className="max-w-md mx-auto mb-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("menu.search")}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-md focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm transition-all ${
                cat === c
                  ? "bg-gradient-gold text-primary-foreground"
                  : "bg-card border border-border/40 text-foreground/80 hover:border-primary/40"
              }`}
            >
              {c === "all" ? t("menu.all") : t(`menu.categories.${c}`)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">{t("menu.empty")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item, i) => (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setActive(item)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 9) * 0.05 }}
                whileHover={{ y: -6 }}
                className="text-left bg-card border border-border/40 rounded-lg overflow-hidden hover:border-primary/50 hover:shadow-glow transition-all shimmer-gold group"
              >
                {item.image_url && (
                  <div className="relative overflow-hidden h-44">
                    <img
                      src={getImageSrc(item.image_url)}
                      alt={item[nameKey] ?? ""}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/0 to-transparent" />
                    <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-background/85 backdrop-blur text-primary font-semibold text-sm">
                      {item.old_price && <span className="text-muted-foreground line-through mr-1 text-xs">{item.old_price}</span>}
                      {item.price} ₼
                    </span>
                    {item.is_featured && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] uppercase tracking-wider">★ Tövsiyə</span>
                    )}
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display text-lg">{item[nameKey] || item.name_az}</h3>
                    {!item.image_url && (
                      <span className="text-primary font-semibold whitespace-nowrap">{item.price} ₼</span>
                    )}
                  </div>
                  {item[descKey] && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{item[descKey]}</p>
                  )}
                  {(item.weight_grams || item.cooking_time || (item.spicy_level ?? 0) > 0) && (
                    <div className="flex flex-wrap gap-3 mt-3 text-[11px] text-muted-foreground">
                      {item.weight_grams && <span className="flex items-center gap-1"><Scale className="h-3 w-3" />{item.weight_grams}g</span>}
                      {item.cooking_time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.cooking_time}'</span>}
                      {(item.spicy_level ?? 0) > 0 && <span className="flex items-center gap-0.5 text-destructive">{Array.from({length: item.spicy_level ?? 0}).map((_, k) => <Flame key={k} className="h-3 w-3" />)}</span>}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.badge && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-primary/15 text-primary">
                        {t(`menu.badges.${item.badge}`, { defaultValue: item.badge })}
                      </span>
                    )}
                    {item.badges?.map((b: string) => (
                      <span key={b} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-foreground/70">{b}</span>
                    ))}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
      <MenuItemDialog item={active} onClose={() => setActive(null)} />
    </section>
  );
}

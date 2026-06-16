import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as getImageSrc } from "./image-src-Blq9uxfN.mjs";
import { a as useSuspenseQuery, q as queryOptions, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { T as getMenuItems, R as getItemVariants, S as getItemExtras } from "./router-Cyx6-Q3j.mjs";
import { u as useMenuSync, S as SectionHeading } from "./use-menu-sync-CZjROMcT.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { s as Search, N as Scale, j as Clock, n as Flame, X, O as Wheat } from "../_libs/lucide-react.mjs";
import { m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
function MenuItemDialog({ item, onClose }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const open = !!item;
  const { data: variants = [] } = useQuery({
    queryKey: ["item-variants", item?.id],
    queryFn: () => getItemVariants({ data: { itemId: item.id } }),
    enabled: open
  });
  const { data: extras = [] } = useQuery({
    queryKey: ["item-extras", item?.id],
    queryFn: () => getItemExtras({ data: { itemId: item.id } }),
    enabled: open
  });
  const [variantId, setVariantId] = reactExports.useState(null);
  const [extraIds, setExtraIds] = reactExports.useState(/* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    if (!open) return;
    setExtraIds(/* @__PURE__ */ new Set());
    const def = variants.find((v) => v.is_default) ?? variants[0];
    setVariantId(def?.id ?? null);
  }, [open, variants]);
  const nameKey = `name_${lang}`;
  const descKey = `desc_${lang}`;
  const basePrice = reactExports.useMemo(() => {
    const v = variants.find((x) => x.id === variantId);
    return v ? Number(v.price) : Number(item?.price ?? 0);
  }, [variants, variantId, item]);
  const extrasTotal = reactExports.useMemo(
    () => extras.filter((e) => extraIds.has(e.id)).reduce((s, e) => s + Number(e.price), 0),
    [extras, extraIds]
  );
  const total = basePrice + extrasTotal;
  const toggleExtra = (id) => {
    const n = new Set(extraIds);
    n.has(id) ? n.delete(id) : n.add(id);
    setExtraIds(n);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      onClick: onClose,
      className: "fixed inset-0 bg-background/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.95, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.95, opacity: 0 },
          onClick: (e) => e.stopPropagation(),
          className: "bg-card border border-border/40 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-auto",
          children: [
            item.image_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-56", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getImageSrc(item.image_url), alt: item[nameKey], className: "w-full h-full object-cover rounded-t-2xl" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "absolute top-3 right-3 p-2 bg-background/80 backdrop-blur rounded-full hover:bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
              !item.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "float-right p-2 hover:bg-muted rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl mb-1", children: item[nameKey] || item.name_az }),
              item[descKey] && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: item[descKey] }),
              (item.weight_grams || item.calories || item.cooking_time || (item.spicy_level ?? 0) > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 text-xs text-muted-foreground mb-4", children: [
                item.weight_grams && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-3.5 w-3.5" }),
                  " ",
                  item.weight_grams,
                  "g"
                ] }),
                item.calories && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  "🔥 ",
                  item.calories,
                  " kkal"
                ] }),
                item.cooking_time && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
                  " ",
                  item.cooking_time,
                  " dəq"
                ] }),
                (item.spicy_level ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-0.5 text-destructive", children: Array.from({ length: item.spicy_level ?? 0 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3.5 w-3.5" }, i)) })
              ] }),
              item.allergens?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 mb-4 p-3 bg-muted/40 rounded text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wheat, { className: "h-4 w-4 mt-0.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Allergenlər:" }),
                  " ",
                  item.allergens.join(", ")
                ] })
              ] }),
              variants.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-2", children: "Ölçü" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: variants.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `flex items-center justify-between p-3 rounded border cursor-pointer transition ${variantId === v.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", checked: variantId === v.id, onChange: () => setVariantId(v.id), className: "accent-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: v[nameKey] || v.name_az }),
                      v.weight_grams && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                        v.weight_grams,
                        "g"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-semibold", children: [
                    v.price,
                    " ₼"
                  ] })
                ] }, v.id)) })
              ] }),
              extras.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-2", children: "Əlavələr" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: extras.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `flex items-center justify-between p-3 rounded border cursor-pointer transition ${extraIds.has(e.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: extraIds.has(e.id), onChange: () => toggleExtra(e.id), className: "accent-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", children: [
                      e[nameKey] || e.name_az,
                      e.is_required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive ml-1", children: "*" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-medium", children: [
                    "+",
                    e.price,
                    " ₼"
                  ] })
                ] }, e.id)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pt-4 border-t border-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  item.old_price && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground line-through", children: [
                    item.old_price,
                    " ₼"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-display text-primary", children: [
                    total.toFixed(2),
                    " ₼"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground text-right max-w-[180px]", children: "Sifariş üçün xidmətçini çağırın" })
              ] })
            ] })
          ]
        }
      )
    }
  ) });
}
const menuQueryOptions = queryOptions({
  queryKey: ["menu_items"],
  queryFn: () => getMenuItems()
});
const CATEGORIES = [
  "all",
  "cold-appetizers",
  "hot-appetizers",
  "salads",
  "main-dishes",
  "bbq",
  "seafood",
  "desserts",
  "drinks",
  "alcohol"
];
function MenuSection({ limit }) {
  const { t, i18n } = useTranslation();
  useMenuSync();
  const { data: items } = useSuspenseQuery(menuQueryOptions);
  const [cat, setCat] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [active, setActive] = reactExports.useState(null);
  const lang = i18n.language;
  const filtered = reactExports.useMemo(() => {
    let list = items;
    if (cat !== "all") list = list.filter((i) => i.category === cat);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) => [i.name_az, i.name_ru, i.name_en, i.desc_az, i.desc_ru, i.desc_en].some((x) => x?.toLowerCase().includes(q))
      );
    }
    return limit ? list.slice(0, limit) : list;
  }, [items, cat, search, limit]);
  const nameKey = `name_${lang}`;
  const descKey = `desc_${lang}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-20 sm:py-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { title: t("menu.title"), subtitle: t("menu.subtitle") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto mb-8 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: t("menu.search"),
            className: "w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-md focus:outline-none focus:border-primary"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-2 mb-10", children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setCat(c),
          className: `px-4 py-1.5 rounded-full text-xs sm:text-sm transition-all ${cat === c ? "bg-gradient-gold text-primary-foreground" : "bg-card border border-border/40 text-foreground/80 hover:border-primary/40"}`,
          children: c === "all" ? t("menu.all") : t(`menu.categories.${c}`)
        },
        c
      )) }),
      filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground py-12", children: t("menu.empty") }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: filtered.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.button,
        {
          type: "button",
          onClick: () => setActive(item),
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: i % 9 * 0.05 },
          whileHover: { y: -6 },
          className: "text-left bg-card border border-border/40 rounded-lg overflow-hidden hover:border-primary/50 hover:shadow-glow transition-all shimmer-gold group",
          children: [
            item.image_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden h-44", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: getImageSrc(item.image_url),
                  alt: item[nameKey] ?? "",
                  className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
                  loading: "lazy"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-card/90 via-card/0 to-transparent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute bottom-3 right-3 px-3 py-1 rounded-full bg-background/85 backdrop-blur text-primary font-semibold text-sm", children: [
                item.old_price && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground line-through mr-1 text-xs", children: item.old_price }),
                item.price,
                " ₼"
              ] }),
              item.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 left-3 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] uppercase tracking-wider", children: "★ Tövsiyə" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg", children: item[nameKey] || item.name_az }),
                !item.image_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-semibold whitespace-nowrap", children: [
                  item.price,
                  " ₼"
                ] })
              ] }),
              item[descKey] && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: item[descKey] }),
              (item.weight_grams || item.cooking_time || (item.spicy_level ?? 0) > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mt-3 text-[11px] text-muted-foreground", children: [
                item.weight_grams && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-3 w-3" }),
                  item.weight_grams,
                  "g"
                ] }),
                item.cooking_time && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                  item.cooking_time,
                  "'"
                ] }),
                (item.spicy_level ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-0.5 text-destructive", children: Array.from({ length: item.spicy_level ?? 0 }).map((_, k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-3 w-3" }, k)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mt-3", children: [
                item.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-primary/15 text-primary", children: t(`menu.badges.${item.badge}`, { defaultValue: item.badge }) }),
                item.badges?.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-foreground/70", children: b }, b))
              ] })
            ] })
          ]
        },
        item.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItemDialog, { item: active, onClose: () => setActive(null) })
  ] });
}
export {
  MenuSection as M
};

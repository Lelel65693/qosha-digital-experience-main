import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useSuspenseQuery, q as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { u as useMenuSync, S as SectionHeading } from "./use-menu-sync-CZjROMcT.mjs";
import { U as getGallery } from "./router-Cyx6-Q3j.mjs";
import { a as getImageSrc, g as getVideoSrc } from "./image-src-Blq9uxfN.mjs";
import { V as VideoBackground } from "./VideoBackground-3DNY5J9s.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { Q as Play, X } from "../_libs/lucide-react.mjs";
const galleryQueryOptions = queryOptions({
  queryKey: ["gallery"],
  queryFn: () => getGallery()
});
function Gallery({ limit, hideVideoBackground = false } = {}) {
  const { t, i18n } = useTranslation();
  useMenuSync();
  const { data: all } = useSuspenseQuery(galleryQueryOptions);
  const [lightbox, setLightbox] = reactExports.useState(null);
  const [cat, setCat] = reactExports.useState("all");
  const items = (all ?? []).filter((g) => g.is_active !== false);
  const categories = Array.from(new Set(items.map((g) => g.category))).filter(Boolean);
  const filtered = cat === "all" ? items : items.filter((g) => g.category === cat);
  const images = limit ? filtered.slice(0, limit) : filtered;
  const lang = i18n.language;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "py-20 sm:py-28 relative overflow-hidden", children: [
    !hideVideoBackground && /* @__PURE__ */ jsxRuntimeExports.jsx(VideoBackground, { position: "absolute", preload: "auto", overlayOpacityClass: "bg-background/50" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { title: t("gallery.title"), subtitle: t("gallery.subtitle") }),
      !limit && categories.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 justify-center mb-8", children: ["all", ...categories].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setCat(c),
          className: `px-4 py-1.5 rounded-full text-sm transition ${cat === c ? "bg-gradient-gold text-primary-foreground" : "bg-card border border-border/40 hover:border-primary/40"}`,
          children: t(`gallery.cat.${c}`, { defaultValue: c === "all" ? "Hamısı" : c })
        },
        c
      )) }),
      images.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-muted-foreground py-12", children: t("gallery.empty", { defaultValue: "Tezliklə..." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4", children: images.map((g, i) => {
        const isVideo = g.media_type === "video";
        const thumb = isVideo ? g.thumbnail_url || g.url : g.url;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.button,
          {
            initial: { opacity: 0, scale: 0.95 },
            whileInView: { opacity: 1, scale: 1 },
            viewport: { once: true },
            transition: { delay: i * 0.05 },
            onClick: () => setLightbox({ url: g.url, type: isVideo ? "video" : "image" }),
            className: `relative overflow-hidden rounded-lg group ${i === 1 || i === 4 ? "md:row-span-2" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: getImageSrc(thumb),
                  alt: g[`caption_${lang}`] || g.title || `Gallery ${i + 1}`,
                  loading: "lazy",
                  className: "w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-700"
                }
              ),
              isVideo && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-7 w-7 ml-1" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 ring-1 ring-inset ring-primary/0 group-hover:ring-primary/40 transition" })
            ]
          },
          g.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: lightbox && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center p-4",
        onClick: () => setLightbox(null),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "absolute top-4 right-4 p-2 text-foreground", onClick: () => setLightbox(null), "aria-label": "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-6 w-6" }) }),
          lightbox.type === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "video",
            {
              src: getVideoSrc(lightbox.url),
              controls: true,
              autoPlay: true,
              className: "max-h-full max-w-full rounded-lg shadow-elegant",
              onClick: (e) => e.stopPropagation()
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.img,
            {
              initial: { scale: 0.9, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              exit: { scale: 0.95, opacity: 0 },
              transition: { duration: 0.25 },
              src: getImageSrc(lightbox.url),
              alt: "",
              className: "max-h-full max-w-full rounded-lg shadow-elegant"
            }
          )
        ]
      }
    ) })
  ] });
}
export {
  Gallery as G
};

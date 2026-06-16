import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { getGallery } from "@/lib/restaurant.functions";
import { useMenuSync } from "@/hooks/use-menu-sync";
import { getImageSrc, getVideoSrc } from "@/lib/image-src";
import { VideoBackground } from "@/components/VideoBackground";

export const galleryQueryOptions = queryOptions({
  queryKey: ["gallery"],
  queryFn: () => getGallery(),
});

export function Gallery({ limit, hideVideoBackground = false }: { limit?: number; hideVideoBackground?: boolean } = {}) {
  const { t, i18n } = useTranslation();
  useMenuSync();
  const { data: all } = useSuspenseQuery(galleryQueryOptions);
  const [lightbox, setLightbox] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const [cat, setCat] = useState<string>("all");
  const items = (all ?? []).filter((g: any) => g.is_active !== false);
  const categories = Array.from(new Set(items.map((g: any) => g.category))).filter(Boolean);
  const filtered = cat === "all" ? items : items.filter((g: any) => g.category === cat);
  const images = limit ? filtered.slice(0, limit) : filtered;
  const lang = i18n.language as "az" | "ru" | "en";

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {!hideVideoBackground && (
        <VideoBackground position="absolute" preload="auto" overlayOpacityClass="bg-background/50" />
      )}
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading title={t("gallery.title")} subtitle={t("gallery.subtitle")} />
        {!limit && categories.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {["all", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-1.5 rounded-full text-sm transition ${
                  cat === c
                    ? "bg-gradient-gold text-primary-foreground"
                    : "bg-card border border-border/40 hover:border-primary/40"
                }`}
              >
                {t(`gallery.cat.${c}`, { defaultValue: c === "all" ? "Hamısı" : c })}
              </button>
            ))}
          </div>
        )}
        {images.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">{t("gallery.empty", { defaultValue: "Tezliklə..." })}</p>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {images.map((g: any, i: number) => {
            const isVideo = g.media_type === "video";
            const thumb = isVideo ? g.thumbnail_url || g.url : g.url;
            return (
              <motion.button
                key={g.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setLightbox({ url: g.url, type: isVideo ? "video" : "image" })}
                className={`relative overflow-hidden rounded-lg group ${i === 1 || i === 4 ? "md:row-span-2" : ""}`}
              >
                <img
                  src={getImageSrc(thumb)}
                  alt={g[`caption_${lang}`] || g.title || `Gallery ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-700"
                />
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="h-16 w-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-glow">
                      <Play className="h-7 w-7 ml-1" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 ring-1 ring-inset ring-primary/0 group-hover:ring-primary/40 transition" />
              </motion.button>
            );
          })}
        </div>
        )}
      </div>
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 right-4 p-2 text-foreground" onClick={() => setLightbox(null)} aria-label="Close">
              <X className="h-6 w-6" />
            </button>
            {lightbox.type === "video" ? (
              <video
                src={getVideoSrc(lightbox.url)}
                controls
                autoPlay
                className="max-h-full max-w-full rounded-lg shadow-elegant"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25 }}
                src={getImageSrc(lightbox.url)}
                alt=""
                className="max-h-full max-w-full rounded-lg shadow-elegant"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

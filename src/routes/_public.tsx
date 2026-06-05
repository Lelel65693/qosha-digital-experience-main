import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BackToTop } from "@/components/BackToTop";
import { X } from "lucide-react";
import { useState } from "react";
import { useSiteSettings, siteSettingsQueryOptions } from "@/lib/useSiteSettings";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_public")({
  loader: ({ context }) =>
    (context as any).queryClient?.prefetchQuery(siteSettingsQueryOptions).catch(() => {}),
  component: PublicLayout,
});

function AnnouncementBanner() {
  const { banner } = useSiteSettings();
  const { i18n } = useTranslation();
  const [dismissed, setDismissed] = useState(false);

  if (!banner.active || dismissed) return null;

  const lang = i18n.language?.slice(0, 2) ?? "az";
  const text =
    lang === "ru" ? banner.text_ru :
    lang === "en" ? banner.text_en :
    banner.text_az;

  if (!text) return null;

  return (
    <div className="relative z-50 bg-gradient-gold text-primary-foreground text-center text-sm py-2 px-10">
      <span>{text}</span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition"
        aria-label="Bağla"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function PublicLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBanner />
      <SiteHeader />
      <main className={`flex-1 ${pathname === "/" ? "" : "pt-16"}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
}

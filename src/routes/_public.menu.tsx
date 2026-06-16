import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { MenuSection } from "@/components/sections/MenuSection";
import { VideoBackground } from "@/components/VideoBackground";

export const Route = createFileRoute("/_public/menu")({
  head: () => ({
    meta: [
      { title: "Menyu — Qoşa Qala" },
      { name: "description", content: "Azərbaycan, Avropa və dünya mətbəxi. Soyuq qəlyanaltılar, kebablar, dəniz məhsulları, şərab və daha çox." },
      { property: "og:title", content: "Menyu — Qoşa Qala" },
      { property: "og:description", content: "18+ yemək, 9 kateqoriya. Qafqaz mətbəxinin ən yaxşı seçimləri." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  return (
    <div className="relative min-h-screen">
      <VideoBackground position="fixed" preload="auto" overlayOpacityClass="bg-background/25" />

      <Suspense fallback={<div className="py-32 text-center text-muted-foreground">Yüklənir…</div>}>
        <MenuSection />
      </Suspense>
    </div>
  );
}

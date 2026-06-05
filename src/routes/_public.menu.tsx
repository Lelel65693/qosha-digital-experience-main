import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { MenuSection } from "@/components/sections/MenuSection";
import { getVideoSrc } from "@/lib/image-src";
import heroImg from "@/assets/hero-restaurant.jpg";

const HERO_VIDEO =
  "https://monyo.az/v4/uploads-video/pv_2384d6a4d34_profile.mp4?x=1683810091";

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
  const [videoOk, setVideoOk] = useState(true);

  return (
    <div className="relative min-h-screen">
      {/* Background video */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {videoOk ? (
          <video
            src={getVideoSrc(HERO_VIDEO)}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroImg}
            onError={() => setVideoOk(false)}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={heroImg}
            alt="Qoşa Qala interior"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-background/45" />
        <div className="absolute inset-0 bg-gradient-dark" />
      </div>

      <Suspense fallback={<div className="py-32 text-center text-muted-foreground">Yüklənir…</div>}>
        <MenuSection />
      </Suspense>
    </div>
  );
}

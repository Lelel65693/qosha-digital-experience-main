import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Features } from "@/components/sections/Features";
import { MenuSection } from "@/components/sections/MenuSection";
import { Reviews } from "@/components/sections/Reviews";
import { Gallery } from "@/components/sections/Gallery";
import { Contact } from "@/components/sections/Contact";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "Qoşa Qala — Mərdəkan, Bakı | Restoran" },
      { name: "description", content: "Qafqaz qonaqpərvərliyi, Avropa mətbəxi, Xəzər mənzərəsi. Hər gün 10:00–01:00. Mərdəkan, Bakı." },
      { property: "og:title", content: "Qoşa Qala Restoran" },
      { property: "og:description", content: "Qafqaz qonaqpərvərliyi, Avropa mətbəxi, unutulmaz anlar." },
      { property: "og:type", content: "restaurant" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "Qoşa Qala",
          image: "https://qoshaqala.az/og.jpg",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Buzovna, Bağlar Massivi 67",
            addressLocality: "Mərdəkan, Bakı",
            addressCountry: "AZ",
          },
          telephone: "+994 50 790 88 88",
          openingHours: "Mo-Su 10:00-01:00",
          servesCuisine: ["Azerbaijani", "European", "Caucasian"],
          priceRange: "₼₼",
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <Suspense fallback={<div className="py-32 text-center text-muted-foreground">Yüklənir…</div>}>
        <MenuSection limit={9} />
      </Suspense>
      <Suspense fallback={null}>
        <Reviews />
      </Suspense>
      <Suspense fallback={null}>
        <Gallery limit={6} />
      </Suspense>
      <Contact />
    </>
  );
}

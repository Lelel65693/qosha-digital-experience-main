import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Gallery } from "@/components/sections/Gallery";

export const Route = createFileRoute("/_public/gallery")({
  head: () => ({
    meta: [
      { title: "Qalereya — Qoşa Qala" },
      { name: "description", content: "Restoranımızın atmosferi, interyer, yeməklər və tədbirlərdən kadrlar." },
      { property: "og:title", content: "Qalereya — Qoşa Qala" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <Suspense fallback={<div className="py-32 text-center text-muted-foreground">Yüklənir…</div>}>
      <Gallery />
    </Suspense>
  );
}

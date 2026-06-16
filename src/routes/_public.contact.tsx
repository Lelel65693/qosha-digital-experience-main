import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/sections/Contact";
import { VideoBackground } from "@/components/VideoBackground";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({
    meta: [
      { title: "Əlaqə — Qoşa Qala" },
      { name: "description", content: "Buzovna, Bağlar Massivi 67, Mərdəkan, Bakı. Telefon: +994 50 790 88 88. Hər gün 10:00–01:00." },
      { property: "og:title", content: "Əlaqə — Qoşa Qala" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="relative min-h-screen">
      <VideoBackground position="fixed" preload="auto" overlayOpacityClass="bg-background/25" />

      <div className="relative z-10">
        <Contact />
      </div>
    </div>
  );
}

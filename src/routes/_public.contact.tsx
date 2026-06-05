import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Contact } from "@/components/sections/Contact";
import { getVideoSrc } from "@/lib/image-src";
import heroImg from "@/assets/hero-restaurant.jpg";

const HERO_VIDEO =
  "https://monyo.az/v4/uploads-video/pv_2384d6a4d34_profile.mp4?x=1683810091";

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

      <div className="relative z-10">
        <Contact />
      </div>
    </div>
  );
}

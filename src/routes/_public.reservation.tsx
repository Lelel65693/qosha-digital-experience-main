import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ReservationForm } from "@/components/sections/ReservationForm";
import { getVideoSrc } from "@/lib/image-src";
import heroImg from "@/assets/hero-restaurant.jpg";

const HERO_VIDEO =
  "https://monyo.az/v4/uploads-video/pv_2384d6a4d34_profile.mp4?x=1683810091";

export const Route = createFileRoute("/_public/reservation")({
  head: () => ({
    meta: [
      { title: "Rezervasiya — Qoşa Qala" },
      { name: "description", content: "Onlayn masa sifarişi. Sizə uyğun tarix və vaxt seçin, biz hazır olacağıq." },
      { property: "og:title", content: "Masa Sifarişi — Qoşa Qala" },
    ],
  }),
  component: ReservationPage,
});

function ReservationPage() {
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

      <div className="py-20 sm:py-28 relative z-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <ReservationForm />
        </div>
      </div>
    </div>
  );
}

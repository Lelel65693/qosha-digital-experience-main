import { createFileRoute } from "@tanstack/react-router";
import { ReservationForm } from "@/components/sections/ReservationForm";
import { VideoBackground } from "@/components/VideoBackground";

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
  return (
    <div className="relative min-h-screen">
      <VideoBackground position="fixed" preload="auto" overlayOpacityClass="bg-background/25" />

      <div className="py-20 sm:py-28 relative z-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <ReservationForm />
        </div>
      </div>
    </div>
  );
}

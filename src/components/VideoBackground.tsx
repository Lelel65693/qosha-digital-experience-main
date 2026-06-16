import { useState } from "react";
import { getVideoSrc } from "@/lib/image-src";
import heroImg from "@/assets/hero-restaurant.jpg";

const HERO_VIDEO =
  "https://monyo.az/v4/uploads-video/pv_2384d6a4d34_profile.mp4?x=1683810091";

interface VideoBackgroundProps {
  className?: string;
  overlayOpacityClass?: string; // e.g. "bg-background/45"
  position?: "fixed" | "absolute";
  preload?: "auto" | "metadata" | "none";
}

export function VideoBackground({
  className = "",
  overlayOpacityClass = "bg-background/25",
  position = "fixed",
  preload = "auto",
}: VideoBackgroundProps) {
  const [videoOk, setVideoOk] = useState(true);

  return (
    <div className={`${position} inset-0 -z-10 overflow-hidden ${className}`}>
      {videoOk ? (
        <video
          src={getVideoSrc(HERO_VIDEO)}
          autoPlay
          muted
          loop
          playsInline
          preload={preload}
          poster={heroImg}
          onError={() => setVideoOk(false)}
          className="w-full h-full object-cover"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          // @ts-ignore
          fetchpriority="high"
          disablePictureInPicture
          disableRemotePlayback
        />
      ) : (
        <img
          src={heroImg}
          alt="Qoşa Qala interior"
          className="w-full h-full object-cover"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      <div className={`absolute inset-0 ${overlayOpacityClass}`} />
      <div className="absolute inset-0 bg-gradient-dark" />
    </div>
  );
}

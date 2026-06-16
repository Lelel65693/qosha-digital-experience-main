import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as getVideoSrc } from "./image-src-Blq9uxfN.mjs";
const heroImg = "/assets/hero-restaurant-bZm_vxAj.jpg";
const HERO_VIDEO = "https://monyo.az/v4/uploads-video/pv_2384d6a4d34_profile.mp4?x=1683810091";
function VideoBackground({
  className = "",
  overlayOpacityClass = "bg-background/25",
  position = "fixed",
  preload = "auto"
}) {
  const [videoOk, setVideoOk] = reactExports.useState(true);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${position} inset-0 -z-10 overflow-hidden ${className}`, children: [
    videoOk ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "video",
      {
        src: getVideoSrc(HERO_VIDEO),
        autoPlay: true,
        muted: true,
        loop: true,
        playsInline: true,
        preload,
        poster: heroImg,
        onError: () => setVideoOk(false),
        className: "w-full h-full object-cover",
        style: { width: "100%", height: "100%", objectFit: "cover" },
        fetchpriority: "high",
        disablePictureInPicture: true,
        disableRemotePlayback: true
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: heroImg,
        alt: "Qoşa Qala interior",
        className: "w-full h-full object-cover",
        style: { width: "100%", height: "100%", objectFit: "cover" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute inset-0 ${overlayOpacityClass}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-dark" })
  ] });
}
export {
  VideoBackground as V
};

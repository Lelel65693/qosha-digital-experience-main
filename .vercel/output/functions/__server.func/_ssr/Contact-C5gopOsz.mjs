import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useSiteSettings } from "./router-Cyx6-Q3j.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { P as Phone, R as Mail, g as MapPin, j as Clock } from "../_libs/lucide-react.mjs";
const DAYS = {
  mon: "B.e.",
  tue: "Ç.a.",
  wed: "Çər.",
  thu: "C.a.",
  fri: "Cümə",
  sat: "Şən.",
  sun: "Bz."
};
function Contact() {
  const { t, i18n } = useTranslation();
  const { contact, hours, social } = useSiteSettings();
  const hoursText = Object.keys(DAYS).filter((k) => hours[k]).map((k) => `${DAYS[k]}: ${hours[k]}`).join("  |  ");
  const phone = contact.phone || t("contact.phone");
  const email = contact.email || t("contact.email");
  const address = contact.address || t("contact.address");
  const phone2 = contact.phone2 || null;
  const mapLat = contact.map_lat ?? 40.5118;
  const mapLng = contact.map_lng ?? 50.1382;
  const mapSrc = `https://www.google.com/maps?q=${mapLat},${mapLng}&z=15&output=embed`;
  social.instagram || "https://instagram.com";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 sm:py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 grid lg:grid-cols-2 gap-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl sm:text-4xl mb-8", children: t("contact.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 text-foreground/90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: `tel:${phone.replace(/\s/g, "")}`,
            className: "flex items-start gap-4 hover:text-primary transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5 text-primary mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: phone })
            ]
          }
        ),
        phone2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: `tel:${phone2.replace(/\s/g, "")}`,
            className: "flex items-start gap-4 hover:text-primary transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5 text-primary/70 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: phone2 })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: `mailto:${email}`,
            className: "flex items-start gap-4 hover:text-primary transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5 text-primary mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: email })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 text-primary mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: address })
        ] }),
        hoursText ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-primary mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm leading-relaxed", children: hoursText })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-primary mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("contact.hours") })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg overflow-hidden border border-border/40 min-h-[320px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "iframe",
      {
        title: "Qoşa Qala Map",
        src: mapSrc,
        className: "w-full h-full min-h-[320px] border-0",
        loading: "lazy"
      }
    ) })
  ] }) });
}
export {
  Contact as C
};

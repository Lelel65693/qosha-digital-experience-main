import { j as jsxRuntimeExports, r as reactExports } from "./_libs/react.mjs";
import { e as useRouterState, O as Outlet, L as Link } from "./_libs/tanstack__react-router.mjs";
import { L as LanguageSwitcher } from "./_ssr/LanguageSwitcher-DVGXWYX_.mjs";
import { u as useSiteSettings } from "./_ssr/router-Cyx6-Q3j.mjs";
import "./_libs/sonner.mjs";
import "./_ssr/index.mjs";
import "./_libs/seroval.mjs";
import { A as AnimatePresence, m as motion } from "./_libs/framer-motion.mjs";
import { u as useTranslation } from "./_libs/react-i18next.mjs";
import { X, M as Menu, g as MapPin, P as Phone, h as Instagram, i as Facebook, A as ArrowUp } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/radix-ui__react-dropdown-menu.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-menu.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-roving-focus.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "tslib";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_ssr/utils-H80jjgLf.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_ssr/client-Cg-358lU.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "./_libs/supabase__functions-js.mjs";
import "./_ssr/auth-middleware-B_zzLJ1T.mjs";
import "./_libs/zod.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_libs/motion-dom.mjs";
import "./_libs/motion-utils.mjs";
import "./_libs/use-sync-external-store.mjs";
function SiteHeader() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = reactExports.useState(false);
  const [open, setOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/menu", label: t("nav.menu") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/reservation", label: t("nav.reservation") },
    { to: "/contact", label: t("nav.contact") }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "header",
    {
      className: `fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/35 backdrop-blur-md border-b border-border/15 shadow-sm" : "bg-transparent"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 sm:px-6 flex items-center justify-between h-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-display text-2xl text-gradient-gold tracking-tight", children: "Qoşa Qala" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden md:flex items-center gap-7", children: links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: l.to,
              className: "text-sm text-foreground/80 hover:text-primary transition-colors",
              activeProps: { className: "text-primary" },
              children: l.label
            },
            l.to
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LanguageSwitcher, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "md:hidden p-2", onClick: () => setOpen(!open), "aria-label": "Menu", children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" }) })
          ] })
        ] }),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden bg-background/95 backdrop-blur border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "container mx-auto px-4 py-4 flex flex-col gap-3", children: links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: l.to,
            onClick: () => setOpen(false),
            className: "text-base py-2 text-foreground/80 hover:text-primary",
            children: l.label
          },
          l.to
        )) }) })
      ]
    }
  );
}
function SiteFooter() {
  const { t } = useTranslation();
  const { contact, social } = useSiteSettings();
  const phone = contact.phone || t("contact.phone");
  const phone2 = contact.phone2 || null;
  const address = contact.address || t("contact.address");
  const instagramUrl = social.instagram || "https://instagram.com";
  const facebookUrl = social.facebook || null;
  const whatsapp = social.whatsapp || null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border/40 bg-card/40 pattern-azeri", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl text-gradient-gold mb-2", children: "Qoşa Qala" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("footer.tagline") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/menu", className: "block text-foreground/80 hover:text-primary", children: t("nav.menu") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/gallery", className: "block text-foreground/80 hover:text-primary", children: t("nav.gallery") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/reservation", className: "block text-foreground/80 hover:text-primary", children: t("nav.reservation") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "block text-foreground/80 hover:text-primary", children: t("nav.contact") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 mt-0.5 text-primary flex-shrink-0" }),
          address
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `tel:${phone.replace(/\s/g, "")}`, className: "flex items-center gap-2 hover:text-primary transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 text-primary" }),
          phone
        ] }),
        phone2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `tel:${phone2.replace(/\s/g, "")}`, className: "flex items-center gap-2 hover:text-primary transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 text-primary/70" }),
          phone2
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: instagramUrl,
            target: "_blank",
            rel: "noreferrer",
            className: "inline-flex items-center gap-2 hover:text-primary transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-4 w-4" }),
              " Instagram"
            ]
          }
        ),
        facebookUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: facebookUrl,
            target: "_blank",
            rel: "noreferrer",
            className: "inline-flex items-center gap-2 hover:text-primary transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Facebook, { className: "h-4 w-4" }),
              " Facebook"
            ]
          }
        ),
        whatsapp && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`,
            target: "_blank",
            rel: "noreferrer",
            className: "inline-flex items-center gap-2 hover:text-primary transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 text-green-500" }),
              " WhatsApp"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/40 py-4 text-center text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Qoşa Qala — ",
      t("footer.rights")
    ] })
  ] });
}
function BackToTop() {
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: visible && /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.button,
    {
      initial: { opacity: 0, y: 20, scale: 0.8 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 20, scale: 0.8 },
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      "aria-label": "Back to top",
      className: "fixed bottom-6 right-6 z-40 h-11 w-11 rounded-full bg-gradient-gold text-primary-foreground shadow-glow flex items-center justify-center hover:opacity-90 transition-opacity",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-5 w-5" })
    }
  ) });
}
function AnnouncementBanner() {
  const {
    banner
  } = useSiteSettings();
  const {
    i18n
  } = useTranslation();
  const [dismissed, setDismissed] = reactExports.useState(false);
  if (!banner.active || dismissed) return null;
  const lang = i18n.language?.slice(0, 2) ?? "az";
  const text = lang === "ru" ? banner.text_ru : lang === "en" ? banner.text_en : banner.text_az;
  if (!text) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-50 bg-gradient-gold text-primary-foreground text-center text-sm py-2 px-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: text }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDismissed(true), className: "absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition", "aria-label": "Bağla", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
  ] });
}
function PublicLayout() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnnouncementBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: `flex-1 ${pathname === "/" ? "" : "pt-16"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", initial: false, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      y: 12
    }, animate: {
      opacity: 1,
      y: 0
    }, exit: {
      opacity: 0,
      y: -8
    }, transition: {
      duration: 0.35,
      ease: "easeOut"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }, pathname) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BackToTop, {})
  ] });
}
export {
  PublicLayout as component
};

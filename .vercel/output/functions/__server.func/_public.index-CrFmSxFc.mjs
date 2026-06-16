import { j as jsxRuntimeExports, r as reactExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { V as VideoBackground } from "./_ssr/VideoBackground-3DNY5J9s.mjs";
import { C as CountUp } from "./_libs/react-countup.mjs";
import { S as SectionHeading } from "./_ssr/use-menu-sync-CZjROMcT.mjs";
import { M as MenuSection } from "./_ssr/MenuSection-BDb6MH5n.mjs";
import { a as useSuspenseQuery, q as queryOptions } from "./_libs/tanstack__react-query.mjs";
import { g as getApprovedReviews } from "./_ssr/router-Cyx6-Q3j.mjs";
import { G as Gallery } from "./_ssr/Gallery-CEA2Ysv-.mjs";
import { C as Contact } from "./_ssr/Contact-C5gopOsz.mjs";
import "./_libs/sonner.mjs";
import "./_ssr/index.mjs";
import "./_libs/seroval.mjs";
import { u as useTranslation } from "./_libs/react-i18next.mjs";
import { u as useScroll, a as useTransform, m as motion, b as useInView } from "./_libs/framer-motion.mjs";
import { c as Star, j as Clock, l as Music, m as CircleParking, n as Flame, o as Coffee, W as Wine, p as Wifi, q as Sun, r as PartyPopper, B as Baby } from "./_libs/lucide-react.mjs";
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
import "./_ssr/image-src-Blq9uxfN.mjs";
import "./_libs/countup.js.mjs";
import "./_ssr/client-Cg-358lU.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_ssr/auth-middleware-B_zzLJ1T.mjs";
import "./_libs/zod.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_libs/use-sync-external-store.mjs";
import "./_libs/motion-dom.mjs";
import "./_libs/motion-utils.mjs";
function Hero() {
  const { t } = useTranslation();
  const ref = reactExports.useRef(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 140]);
  const contentY = useTransform(scrollY, [0, 600], [0, -40]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { ref, className: "relative min-h-screen flex items-center justify-center overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { style: { y: bgY }, className: "absolute inset-0 -top-10 -bottom-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VideoBackground, { position: "absolute", preload: "auto", overlayOpacityClass: "bg-background/25" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "gold-orb absolute -top-24 -left-24 h-96 w-96 rounded-full pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "gold-orb absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full pointer-events-none", style: { animationDelay: "-3s" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        style: { y: contentY, opacity: contentOpacity },
        className: "relative z-10 container mx-auto px-4 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.1 },
              className: "text-primary tracking-[0.3em] uppercase text-xs sm:text-sm mb-4",
              children: t("hero.subtitle")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.h1,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.2, duration: 0.8 },
              className: "font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-gradient-gold leading-[1.15] pb-4 pt-2 mb-2",
              children: t("hero.title")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, scaleX: 0 },
              animate: { opacity: 1, scaleX: 1 },
              transition: { delay: 0.45, duration: 0.7 },
              className: "ornament-divider mb-8 origin-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diamond" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.55 },
              className: "text-base sm:text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto mb-10",
              children: t("hero.tagline")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.7 },
              className: "flex flex-col sm:flex-row gap-3 justify-center mb-16",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/reservation",
                    className: "px-7 py-3.5 bg-gradient-gold text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity shadow-glow shimmer-gold",
                    children: t("hero.ctaReserve")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/menu",
                    className: "px-7 py-3.5 border border-primary/60 text-primary rounded-md hover:bg-primary/10 transition-colors",
                    children: t("hero.ctaMenu")
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.95 },
              className: "flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm",
              children: [
                { icon: Star, label: "4.9 " + t("hero.rating") },
                { icon: Clock, label: t("hero.hours") },
                { icon: Music, label: t("hero.music") }
              ].map(({ icon: Icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur border border-border/40",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/90", children: label })
                  ]
                },
                label
              ))
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 1.4, duration: 0.8 },
        style: { opacity: contentOpacity },
        className: "absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float",
        "aria-hidden": true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scroll-cue" })
      }
    )
  ] });
}
function About() {
  const { t } = useTranslation();
  const ref = reactExports.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const stats = [
    { value: 5e4, label: t("about.stats.guests"), suffix: "+" },
    { value: 120, label: t("about.stats.dishes"), suffix: "+" },
    { value: 15, label: t("about.stats.years"), suffix: "" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 sm:py-28 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center", ref, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4", children: stats.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: inView ? { opacity: 1, y: 0 } : {},
        transition: { delay: i * 0.1 },
        className: "text-center p-6 rounded-lg bg-card/60 border border-border/40",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-3xl sm:text-4xl text-gradient-gold mb-2", children: [
            inView && /* @__PURE__ */ jsxRuntimeExports.jsx(CountUp, { end: s.value, duration: 2.2, separator: "," }),
            s.suffix
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: s.label })
        ]
      },
      s.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary tracking-[0.2em] uppercase text-xs mb-3", children: t("about.eyebrow") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl sm:text-4xl md:text-5xl mb-5", children: t("about.title") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ornament-divider !justify-start mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diamond" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/80 leading-relaxed", children: t("about.body") })
    ] })
  ] }) });
}
const FEATURES = [
  { key: "music", icon: Music },
  { key: "parking", icon: CircleParking },
  { key: "bbq", icon: Flame },
  { key: "breakfast", icon: Coffee },
  { key: "wine", icon: Wine },
  { key: "wifi", icon: Wifi },
  { key: "terrace", icon: Sun },
  { key: "banquet", icon: PartyPopper },
  { key: "kids", icon: Baby }
];
function Features() {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 sm:py-28 bg-card/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { title: t("features.title") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 md:grid-cols-3 gap-4", children: FEATURES.map((f, i) => {
      const Icon = f.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: i * 0.05 },
          whileHover: { y: -4 },
          className: "p-6 rounded-lg bg-card border border-border/40 hover:border-primary/40 hover:shadow-glow transition-all",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-7 w-7 text-primary mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg mb-1", children: t(`features.items.${f.key}.title`) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t(`features.items.${f.key}.desc`) })
          ]
        },
        f.key
      );
    }) })
  ] }) });
}
const reviewsQueryOptions = queryOptions({
  queryKey: ["reviews_approved"],
  queryFn: () => getApprovedReviews()
});
function Reviews() {
  const { t } = useTranslation();
  const { data: reviews } = useSuspenseQuery(reviewsQueryOptions);
  const avg = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "5.0";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 sm:py-28 bg-card/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionHeading,
      {
        title: t("reviews.title"),
        subtitle: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5 fill-primary text-primary" }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: avg }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-sm", children: [
            "· ",
            t("reviews.count", { count: reviews.length })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto", children: reviews.slice(0, 6).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { delay: i * 0.07 },
        className: "p-6 rounded-lg bg-card border border-border/40",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-semibold text-sm", children: r.author_name.split(" ").map((n) => n[0]).join("").slice(0, 2) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: r.author_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex", children: Array.from({ length: r.rating }).map((_, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-primary text-primary" }, idx)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80 leading-relaxed", children: r.content })
        ]
      },
      r.id
    )) })
  ] }) });
}
function HomePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(About, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Features, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-32 text-center text-muted-foreground", children: "Yüklənir…" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(MenuSection, { limit: 9 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Reviews, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gallery, { limit: 6 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Contact, {})
  ] });
}
export {
  HomePage as component
};

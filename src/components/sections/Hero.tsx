import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Clock, Music } from "lucide-react";
import { useRef } from "react";
import { VideoBackground } from "@/components/VideoBackground";

export function Hero() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 140]);
  const contentY = useTransform(scrollY, [0, 600], [0, -40]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax background: video with image fallback */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -top-10 -bottom-10">
        <VideoBackground position="absolute" preload="auto" overlayOpacityClass="bg-background/25" />
      </motion.div>

      {/* Floating gold orbs */}
      <div className="gold-orb absolute -top-24 -left-24 h-96 w-96 rounded-full pointer-events-none" />
      <div className="gold-orb absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full pointer-events-none" style={{ animationDelay: "-3s" }} />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 container mx-auto px-4 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-primary tracking-[0.3em] uppercase text-xs sm:text-sm mb-4"
        >
          {t("hero.subtitle")}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-gradient-gold leading-[1.15] pb-4 pt-2 mb-2"
        >
          {t("hero.title")}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="ornament-divider mb-8 origin-center"
        >
          <span className="diamond" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="text-base sm:text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto mb-10"
        >
          {t("hero.tagline")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
        >
          <Link
            to="/reservation"
            className="px-7 py-3.5 bg-gradient-gold text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity shadow-glow shimmer-gold"
          >
            {t("hero.ctaReserve")}
          </Link>
          <Link
            to="/menu"
            className="px-7 py-3.5 border border-primary/60 text-primary rounded-md hover:bg-primary/10 transition-colors"
          >
            {t("hero.ctaMenu")}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm"
        >
          {[
            { icon: Star, label: "4.9 " + t("hero.rating") },
            { icon: Clock, label: t("hero.hours") },
            { icon: Music, label: t("hero.music") },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur border border-border/40"
            >
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-foreground/90">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float"
        aria-hidden
      >
        <div className="scroll-cue" />
      </motion.div>
    </section>
  );
}

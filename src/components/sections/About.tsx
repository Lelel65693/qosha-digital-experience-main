import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function About() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: 50000, label: t("about.stats.guests"), suffix: "+" },
    { value: 120, label: t("about.stats.dishes"), suffix: "+" },
    { value: 15, label: t("about.stats.years"), suffix: "" },
  ];

  return (
    <section className="py-20 sm:py-28 relative">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center" ref={ref}>
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-lg bg-card/60 border border-border/40"
            >
              <div className="font-display text-3xl sm:text-4xl text-gradient-gold mb-2">
                {inView && <CountUp end={s.value} duration={2.2} separator="," />}{s.suffix}
              </div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
        <div>
          <p className="text-primary tracking-[0.2em] uppercase text-xs mb-3">{t("about.eyebrow")}</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-5">{t("about.title")}</h2>
          <div className="ornament-divider !justify-start mb-5">
            <span className="diamond" />
          </div>
          <p className="text-foreground/80 leading-relaxed">{t("about.body")}</p>
        </div>
      </div>
    </section>
  );
}

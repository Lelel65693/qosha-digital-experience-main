import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Music, ParkingCircle, Flame, Coffee, Wine, Wifi, Sun, PartyPopper, Baby } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

const FEATURES = [
  { key: "music", icon: Music },
  { key: "parking", icon: ParkingCircle },
  { key: "bbq", icon: Flame },
  { key: "breakfast", icon: Coffee },
  { key: "wine", icon: Wine },
  { key: "wifi", icon: Wifi },
  { key: "terrace", icon: Sun },
  { key: "banquet", icon: PartyPopper },
  { key: "kids", icon: Baby },
];

export function Features() {
  const { t } = useTranslation();
  return (
    <section className="py-20 sm:py-28 bg-card/30">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("features.title")} />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-lg bg-card border border-border/40 hover:border-primary/40 hover:shadow-glow transition-all"
              >
                <Icon className="h-7 w-7 text-primary mb-3" />
                <h3 className="font-display text-lg mb-1">{t(`features.items.${f.key}.title`)}</h3>
                <p className="text-sm text-muted-foreground">{t(`features.items.${f.key}.desc`)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

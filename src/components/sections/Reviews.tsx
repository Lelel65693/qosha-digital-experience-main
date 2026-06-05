import { useTranslation } from "react-i18next";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { getApprovedReviews } from "@/lib/restaurant.functions";
import { SectionHeading } from "@/components/SectionHeading";

export const reviewsQueryOptions = queryOptions({
  queryKey: ["reviews_approved"],
  queryFn: () => getApprovedReviews(),
});

export function Reviews() {
  const { t } = useTranslation();
  const { data: reviews } = useSuspenseQuery(reviewsQueryOptions);

  const avg = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <section className="py-20 sm:py-28 bg-card/30">
      <div className="container mx-auto px-4">
        <SectionHeading
          title={t("reviews.title")}
          subtitle={
            <span className="inline-flex items-center justify-center gap-2">
              <span className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </span>
              <span className="text-primary font-semibold">{avg}</span>
              <span className="text-muted-foreground text-sm">· {t("reviews.count", { count: reviews.length })}</span>
            </span>
          }
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {reviews.slice(0, 6).map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="p-6 rounded-lg bg-card border border-border/40"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {r.author_name.split(" ").map(n => n[0]).join("").slice(0,2)}
                </div>
                <div>
                  <p className="font-medium text-sm">{r.author_name}</p>
                  <div className="flex">
                    {Array.from({ length: r.rating }).map((_, idx) => (
                      <Star key={idx} className="h-3 w-3 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{r.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

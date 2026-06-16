import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { b as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { supabase } from "./client-Cg-358lU.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = ""
}) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col ${alignment} mb-12 ${className}`, children: [
    eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.p,
      {
        initial: { opacity: 0, y: 8 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.5 },
        className: "text-primary tracking-[0.3em] uppercase text-xs mb-3",
        children: eyebrow
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.h2,
      {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.6, delay: 0.05 },
        className: "font-display text-3xl sm:text-4xl md:text-5xl",
        children: title
      }
    ),
    align === "center" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, scaleX: 0 },
        whileInView: { opacity: 1, scaleX: 1 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.7, delay: 0.2 },
        className: "ornament-divider mt-5 origin-center",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "diamond" })
      }
    ),
    subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.p,
      {
        initial: { opacity: 0, y: 8 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.5, delay: 0.25 },
        className: "text-muted-foreground mt-4 max-w-2xl",
        children: subtitle
      }
    )
  ] });
}
function useMenuSync(tableNumber) {
  const qc = useQueryClient();
  reactExports.useEffect(() => {
    const channel = supabase.channel(`menu-sync-${"global"}-${Math.random().toString(36).slice(2)}`).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "menu_items" },
      () => qc.invalidateQueries({ queryKey: ["menu_items"] })
    ).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "menu_categories" },
      () => qc.invalidateQueries({ queryKey: ["menu_categories"] })
    ).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "restaurant_tables" },
      () => {
      }
    ).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "gallery" },
      () => qc.invalidateQueries({ queryKey: ["gallery"] })
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc, tableNumber]);
}
export {
  SectionHeading as S,
  useMenuSync as u
};

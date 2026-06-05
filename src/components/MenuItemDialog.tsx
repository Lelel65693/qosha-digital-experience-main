import { getImageSrc } from "@/lib/image-src";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Clock, Scale, Wheat } from "lucide-react";
import { getItemVariants, getItemExtras } from "@/lib/restaurant.functions";

type Item = any;

export function MenuItemDialog({ item, onClose }: { item: Item | null; onClose: () => void }) {
  const { i18n } = useTranslation();
  const lang = i18n.language as "az" | "ru" | "en";
  const open = !!item;

  const { data: variants = [] } = useQuery({
    queryKey: ["item-variants", item?.id],
    queryFn: () => getItemVariants({ data: { itemId: item!.id } }),
    enabled: open,
  });
  const { data: extras = [] } = useQuery({
    queryKey: ["item-extras", item?.id],
    queryFn: () => getItemExtras({ data: { itemId: item!.id } }),
    enabled: open,
  });

  const [variantId, setVariantId] = useState<string | null>(null);
  const [extraIds, setExtraIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;
    setExtraIds(new Set());
    const def = variants.find((v: any) => v.is_default) ?? variants[0];
    setVariantId(def?.id ?? null);
  }, [open, variants]);

  const nameKey = `name_${lang}` as const;
  const descKey = `desc_${lang}` as const;

  const basePrice = useMemo(() => {
    const v = variants.find((x: any) => x.id === variantId);
    return v ? Number(v.price) : Number(item?.price ?? 0);
  }, [variants, variantId, item]);

  const extrasTotal = useMemo(
    () => extras.filter((e: any) => extraIds.has(e.id)).reduce((s: number, e: any) => s + Number(e.price), 0),
    [extras, extraIds]
  );
  const total = basePrice + extrasTotal;

  const toggleExtra = (id: string) => {
    const n = new Set(extraIds);
    n.has(id) ? n.delete(id) : n.add(id);
    setExtraIds(n);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border/40 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-auto"
          >
            {item.image_url && (
              <div className="relative h-56">
                <img src={getImageSrc(item.image_url)} alt={item[nameKey]} className="w-full h-full object-cover rounded-t-2xl" />
                <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur rounded-full hover:bg-background">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="p-6">
              {!item.image_url && (
                <button onClick={onClose} className="float-right p-2 hover:bg-muted rounded-full"><X className="h-4 w-4" /></button>
              )}
              <h2 className="font-display text-2xl mb-1">{item[nameKey] || item.name_az}</h2>
              {item[descKey] && <p className="text-sm text-muted-foreground mb-4">{item[descKey]}</p>}

              {(item.weight_grams || item.calories || item.cooking_time || (item.spicy_level ?? 0) > 0) && (
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                  {item.weight_grams && <span className="flex items-center gap-1"><Scale className="h-3.5 w-3.5" /> {item.weight_grams}g</span>}
                  {item.calories && <span className="flex items-center gap-1">🔥 {item.calories} kkal</span>}
                  {item.cooking_time && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {item.cooking_time} dəq</span>}
                  {(item.spicy_level ?? 0) > 0 && <span className="flex items-center gap-0.5 text-destructive">{Array.from({length: item.spicy_level ?? 0}).map((_, i) => <Flame key={i} className="h-3.5 w-3.5" />)}</span>}
                </div>
              )}

              {item.allergens?.length > 0 && (
                <div className="flex items-start gap-2 mb-4 p-3 bg-muted/40 rounded text-xs">
                  <Wheat className="h-4 w-4 mt-0.5 text-primary" />
                  <div><span className="font-medium">Allergenlər:</span> {item.allergens.join(", ")}</div>
                </div>
              )}

              {variants.length > 0 && (
                <div className="mb-5">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Ölçü</div>
                  <div className="space-y-2">
                    {variants.map((v: any) => (
                      <label key={v.id} className={`flex items-center justify-between p-3 rounded border cursor-pointer transition ${variantId === v.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" checked={variantId === v.id} onChange={() => setVariantId(v.id)} className="accent-primary" />
                          <div>
                            <div className="text-sm font-medium">{v[nameKey] || v.name_az}</div>
                            {v.weight_grams && <div className="text-xs text-muted-foreground">{v.weight_grams}g</div>}
                          </div>
                        </div>
                        <span className="text-primary font-semibold">{v.price} ₼</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {extras.length > 0 && (
                <div className="mb-5">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Əlavələr</div>
                  <div className="space-y-2">
                    {extras.map((e: any) => (
                      <label key={e.id} className={`flex items-center justify-between p-3 rounded border cursor-pointer transition ${extraIds.has(e.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={extraIds.has(e.id)} onChange={() => toggleExtra(e.id)} className="accent-primary" />
                          <span className="text-sm">{e[nameKey] || e.name_az}{e.is_required && <span className="text-destructive ml-1">*</span>}</span>
                        </div>
                        <span className="text-primary font-medium">+{e.price} ₼</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-border/40">
                <div>
                  {item.old_price && (
                    <div className="text-xs text-muted-foreground line-through">{item.old_price} ₼</div>
                  )}
                  <div className="text-2xl font-display text-primary">{total.toFixed(2)} ₼</div>
                </div>
                <div className="text-xs text-muted-foreground text-right max-w-[180px]">
                  Sifariş üçün xidmətçini çağırın
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

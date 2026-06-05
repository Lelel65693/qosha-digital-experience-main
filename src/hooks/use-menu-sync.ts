import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribes to realtime changes on menu-related tables.
 * When admin updates anything, QR menu pages refresh automatically.
 */
export function useMenuSync(tableNumber?: number) {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`menu-sync-${tableNumber ?? "global"}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items" },
        () => qc.invalidateQueries({ queryKey: ["menu_items"] }),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_categories" },
        () => qc.invalidateQueries({ queryKey: ["menu_categories"] }),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "restaurant_tables" },
        () => {
          if (tableNumber !== undefined) {
            qc.invalidateQueries({ queryKey: ["table", tableNumber] });
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "gallery" },
        () => qc.invalidateQueries({ queryKey: ["gallery"] }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc, tableNumber]);
}
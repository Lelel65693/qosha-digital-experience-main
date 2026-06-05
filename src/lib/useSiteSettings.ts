import { queryOptions, useQuery } from "@tanstack/react-query";
import { getSiteSettings } from "@/lib/restaurant.functions";
import { useState, useEffect } from "react";

export const siteSettingsQueryOptions = queryOptions({
  queryKey: ["site-settings"],
  queryFn: () => getSiteSettings(),
  staleTime: 60_000, // 1 minute
});

/** Non-suspense hook — returns {} while loading/SSR so components degrade gracefully and don't cause hydration mismatch */
export function useSiteSettings() {
  const { data } = useQuery(siteSettingsQueryOptions);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeData = mounted ? data : undefined;

  return {
    contact: (activeData?.contact_info ?? {}) as Record<string, any>,
    hours: (activeData?.working_hours ?? {}) as Record<string, string>,
    banner: (activeData?.announcement_banner ?? {}) as {
      active?: boolean;
      text_az?: string;
      text_ru?: string;
      text_en?: string;
    },
    social: (activeData?.social_links ?? {}) as Record<string, string>,
  };
}

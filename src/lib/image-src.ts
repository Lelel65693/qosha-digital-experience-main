// Helper: xarici URL-ləri proxy üzərindən serve etmək üçün
const ALLOWED_PROXY_HOSTS = [
  "monyo.az",
  "lh3.googleusercontent.com",
  "lh4.googleusercontent.com",
  "lh5.googleusercontent.com",
  "lh6.googleusercontent.com",
  "maps.googleapis.com",
  "streetviewpixels-pa.googleapis.com",
];

function isProxyHost(hostname: string) {
  return ALLOWED_PROXY_HOSTS.some(
    (d) => hostname === d || hostname.endsWith("." + d),
  );
}

/** Xarici şəkilləri serverimizin proxy-si üzərindən göstərir (CORS / referer fix). */
export function getImageSrc(url?: string | null): string {
  if (!url) return "/placeholder.svg";
  if (
    url.startsWith("/") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  )
    return url;

  try {
    const parsed = new URL(url);
    // Eyni origin və ya öz storage-imiz — birbaşa işlət
    if (typeof window !== "undefined" && parsed.origin === window.location.origin)
      return url;
    if (parsed.hostname.endsWith(".supabase.co")) return url;

    if (isProxyHost(parsed.hostname)) {
      return `/api/public/proxy/image?url=${encodeURIComponent(url)}`;
    }
    return url;
  } catch {
    return url;
  }
}

/** Video üçün eyni məntiq, ayrı proxy endpoint (range request dəstəyi ilə). */
export function getVideoSrc(url?: string | null): string {
  if (!url) return "";
  if (
    url.startsWith("/") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  )
    return url;

  try {
    const parsed = new URL(url);
    if (typeof window !== "undefined" && parsed.origin === window.location.origin)
      return url;
    if (parsed.hostname.endsWith(".supabase.co")) return url;

    if (isProxyHost(parsed.hostname)) {
      return `/api/public/proxy/video?url=${encodeURIComponent(url)}`;
    }
    return url;
  } catch {
    return url;
  }
}

const ALLOWED_PROXY_HOSTS = [
  "monyo.az",
  "lh3.googleusercontent.com",
  "lh4.googleusercontent.com",
  "lh5.googleusercontent.com",
  "lh6.googleusercontent.com",
  "maps.googleapis.com",
  "streetviewpixels-pa.googleapis.com"
];
function isProxyHost(hostname) {
  return ALLOWED_PROXY_HOSTS.some(
    (d) => hostname === d || hostname.endsWith("." + d)
  );
}
function getImageSrc(url) {
  if (!url) return "/placeholder.svg";
  if (url.startsWith("/") || url.startsWith("data:") || url.startsWith("blob:"))
    return url;
  try {
    const parsed = new URL(url);
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
function getVideoSrc(url) {
  if (!url) return "";
  if (url.startsWith("/") || url.startsWith("data:") || url.startsWith("blob:"))
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
export {
  getImageSrc as a,
  getVideoSrc as g
};

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Detect hosting provider from environment variables
const getNitroPreset = () => {
  if (process.env.VERCEL) return "vercel";
  if (process.env.NETLIFY) return "netlify";
  if (process.env.CF_PAGES || process.env.CF_PAGES_URL) return "cloudflare-pages";
  return "node-server"; // default for standard local production builds
};

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: getNitroPreset(),
    externals: {
      inline: ["tslib"],
    },
  },
});

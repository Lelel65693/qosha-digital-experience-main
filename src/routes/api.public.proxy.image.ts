import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/proxy/image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const urlObj = new URL(request.url);
        const targetUrl = urlObj.searchParams.get("url");

        if (!targetUrl) {
          return new Response("Missing url parameter", { status: 400 });
        }

        try {
          const response = await fetch(targetUrl);
          if (!response.ok) {
            return new Response(`Failed to fetch target image: ${response.statusText}`, { status: response.status });
          }

          const contentType = response.headers.get("content-type") || "image/jpeg";
          const body = response.body;

          return new Response(body, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=86400",
            },
          });
        } catch (error: any) {
          return new Response(`Error proxying image: ${error.message}`, { status: 500 });
        }
      },
    },
  },
});

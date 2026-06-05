import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/proxy/video")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const urlObj = new URL(request.url);
        const targetUrl = urlObj.searchParams.get("url");

        if (!targetUrl) {
          return new Response("Missing url parameter", { status: 400 });
        }

        try {
          const headers: Record<string, string> = {};
          const rangeHeader = request.headers.get("Range") || request.headers.get("range");
          if (rangeHeader) {
            headers["Range"] = rangeHeader;
          }

          const response = await fetch(targetUrl, { headers });

          const responseHeaders = new Headers();
          const contentType = response.headers.get("content-type") || "video/mp4";
          responseHeaders.set("Content-Type", contentType);

          const contentRange = response.headers.get("content-range");
          if (contentRange) {
            responseHeaders.set("Content-Range", contentRange);
          }

          const contentLength = response.headers.get("content-length");
          if (contentLength) {
            responseHeaders.set("Content-Length", contentLength);
          }

          const acceptRanges = response.headers.get("accept-ranges");
          if (acceptRanges) {
            responseHeaders.set("Accept-Ranges", acceptRanges);
          }

          return new Response(response.body, {
            status: response.status,
            headers: responseHeaders,
          });
        } catch (error: any) {
          return new Response(`Error proxying video: ${error.message}`, { status: 500 });
        }
      },
    },
  },
});

const CACHE_NAME = "qosha-qala-menu-cache-v1";
const OFFLINE_URLS = [
  "/",
  "/manifest.json",
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Network-first falling back to Cache)
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // We only want to handle same-origin GET requests
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Network-first strategy for dynamic menu data and assets
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseCopy);
          });
        }
        return response;
      })
      .catch(() => {
        // Fail -> serve from cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Default offline fallback
          if (request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/");
          }
          return new Response("Offline content not available", {
            status: 503,
            statusText: "Service Unavailable",
          });
        });
      })
  );
});

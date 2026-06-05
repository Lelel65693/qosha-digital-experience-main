import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
      },
    },
  });
}

export function createRouter() {
  const queryClient = makeQueryClient();

  const router = createTanStackRouter({
    routeTree,
    context: {
      queryClient,
    },
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
  });

  return router;
}

// Singleton router for client-side hydration
// TanStack Start's hydrateStart imports `getRouter` from this module
let _router: ReturnType<typeof createRouter> | undefined;

export function getRouter() {
  if (!_router) {
    _router = createRouter();
  }
  return _router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

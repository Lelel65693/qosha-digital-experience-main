import { createMiddleware } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { getRequestHeaders } from "@tanstack/react-start/server";

/**
 * TanStack Start middleware that gets the client-side Supabase token,
 * passes it in the Authorization header, validates it on the server,
 * and injects `context.userId` into the server function context.
 */
export const requireSupabaseAuth = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token ?? "";
    return next({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  })
  .server(async ({ next }) => {
    const headers = getRequestHeaders() as any;
    const authHeader = headers["authorization"] ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

    if (!token) {
      throw new Error("Unauthorized: missing token");
    }

    const SUPABASE_URL =
      process.env.SUPABASE_URL ?? 
      process.env.VITE_SUPABASE_URL ?? 
      ((import.meta as any).env ? (import.meta as any).env.VITE_SUPABASE_URL : "") ?? 
      "";
    const SUPABASE_ANON_KEY =
      process.env.SUPABASE_PUBLISHABLE_KEY ??
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
      process.env.SUPABASE_ANON_KEY ??
      process.env.VITE_SUPABASE_ANON_KEY ??
      ((import.meta as any).env ? (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY : "") ??
      "";

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error("Server configuration error: missing Supabase credentials");
    }

    // Create a per-request Supabase client using the user token
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new Error("Unauthorized: invalid or expired token");
    }

    return next({ context: { userId: user.id } });
  });

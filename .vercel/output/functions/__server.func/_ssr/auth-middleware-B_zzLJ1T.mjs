import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { a as createMiddleware, b as getRequestHeaders } from "./index.mjs";
function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  let SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (SUPABASE_SERVICE_ROLE_KEY) {
      console.warn(
        "[Supabase] SUPABASE_SERVICE_ROLE_KEY is missing. Falling back to PUBLISHABLE_KEY for local development. Admin/audit write operations may fail."
      );
    }
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [
      ...!SUPABASE_URL ? ["SUPABASE_URL"] : [],
      ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
let _supabaseAdmin;
const supabaseAdmin = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  }
});
const requireSupabaseAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
  const { supabase } = await import("./client-Cg-358lU.mjs");
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? "";
  return next({
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}).server(async ({ next }) => {
  const headers = getRequestHeaders();
  const authHeader = headers["authorization"] ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  if (!token) {
    throw new Error("Unauthorized: missing token");
  }
  const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
  const SUPABASE_ANON_KEY = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "";
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Server configuration error: missing Supabase credentials");
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token);
  if (error || !user) {
    throw new Error("Unauthorized: invalid or expired token");
  }
  return next({ context: { userId: user.id } });
});
export {
  requireSupabaseAuth as r,
  supabaseAdmin as s
};

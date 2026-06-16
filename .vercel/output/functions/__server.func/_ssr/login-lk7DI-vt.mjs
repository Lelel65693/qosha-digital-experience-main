import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { supabase } from "./client-Cg-358lU.mjs";
import { c as checkIsAdmin } from "./router-Cyx6-Q3j.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./auth-middleware-B_zzLJ1T.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    (async () => {
      const {
        data
      } = await supabase.auth.getUser();
      if (!data.user) return;
      try {
        const res = await checkIsAdmin();
        if (res.isAdmin) navigate({
          to: "/admin",
          replace: true
        });
        else await supabase.auth.signOut();
      } catch {
        await supabase.auth.signOut();
      }
    })();
  }, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    try {
      await supabase.auth.signOut();
    } catch {
    }
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword
    });
    if (error) {
      setLoading(false);
      toast.error(error.message === "Invalid login credentials" ? "Admin e-poçtu və ya şifrə yanlışdır" : error.message);
      return;
    }
    try {
      const res = await checkIsAdmin();
      if (!res.isAdmin) {
        await supabase.auth.signOut();
        setLoading(false);
        toast.error("Bu hesabın admin icazəsi yoxdur");
        return;
      }
    } catch {
      await supabase.auth.signOut();
      setLoading(false);
      toast.error("Yoxlama uğursuz oldu, yenidən cəhd edin");
      return;
    }
    setLoading(false);
    toast.success("Xoş gəldiniz!");
    navigate({
      to: "/admin",
      replace: true
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md bg-card border border-border/40 rounded-xl p-8 shadow-elegant", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "block text-center font-display text-3xl text-gradient-gold mb-2", children: "Qoşa Qala" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-center text-muted-foreground mb-6", children: "Admin Girişi" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm text-foreground/80 mb-1 block", children: "E-poçt" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-3 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:border-primary" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm text-foreground/80 mb-1 block", children: "Şifrə" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-3 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:border-primary" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full py-3 bg-gradient-gold text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50", children: loading ? "Yoxlanılır..." : "Daxil ol" })
    ] })
  ] }) });
}
export {
  LoginPage as component
};

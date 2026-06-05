import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/restaurant.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin Girişi — Qoşa Qala" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      try {
        const res = await checkIsAdmin();
        if (res.isAdmin) navigate({ to: "/admin" as any, replace: true });
        else await supabase.auth.signOut();
      } catch {
        await supabase.auth.signOut();
      }
    })();
  }, [navigate]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Clear any stale/expired local session before a fresh admin login attempt.
    try { await supabase.auth.signOut(); } catch {}

    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });
    if (error) {
      setLoading(false);
      toast.error(
        error.message === "Invalid login credentials"
          ? "Admin e-poçtu və ya şifrə yanlışdır"
          : error.message,
      );
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
    navigate({ to: "/admin" as any, replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border/40 rounded-xl p-8 shadow-elegant">
        <Link to="/" className="block text-center font-display text-3xl text-gradient-gold mb-2">
          Qoşa Qala
        </Link>
        <h1 className="text-center text-muted-foreground mb-6">Admin Girişi</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-foreground/80 mb-1 block">E-poçt</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm text-foreground/80 mb-1 block">Şifrə</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-md focus:outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-gold text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Yoxlanılır..." : "Daxil ol"}
          </button>
        </form>

      </div>
    </div>
  );
}

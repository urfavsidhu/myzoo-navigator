import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/zoo/AppShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Smart Zoo Navigator" },
      { name: "description", content: "Create a Smart Zoo Navigator account to review animals and report issues." },
      { property: "og:title", content: "Sign up — Smart Zoo Navigator" },
      { property: "og:description", content: "Join Smart Zoo Navigator in a few seconds." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName.trim() },
      },
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data.session) {
      void navigate({ to: "/profile" });
      return;
    }
    setSent(true);
  };

  return (
    <AppShell>
      <PageHeader title="Create account" subtitle="Save reviews, reports and your profile" />
      <div className="px-4">
        {sent ? (
          <div className="rounded-3xl border border-leaf/30 bg-leaf/10 p-6 text-center">
            <p className="text-sm font-semibold text-leaf-deep">Check your email</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We sent a confirmation link to {email}. Click it to finish signing up.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none"
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-95 disabled:opacity-60"
            >
              {busy ? "Creating…" : "Sign up"}
            </button>
            <p className="pt-2 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary">
                Log in
              </Link>
            </p>
          </form>
        )}
      </div>
    </AppShell>
  );
}
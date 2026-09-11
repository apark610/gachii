"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) return setError(error.message);
      if (!data.session) {
        setCheckEmail(true);
        return;
      }
      router.push("/onboarding");
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) return setError(error.message);
    router.push(searchParams.get("next") ?? "/app");
    router.refresh();
  }

  if (checkEmail) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 text-center">
        <p className="font-medium">Check your email</p>
        <p className="mt-2 text-sm text-muted">
          We sent a confirmation link to {email}. Click it, then come back
          and log in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground/80">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 outline-none focus:border-primary"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground/80">
          Password
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 outline-none focus:border-primary"
          placeholder="At least 6 characters"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-60"
      >
        {loading
          ? "Please wait…"
          : mode === "signup"
            ? "Create account"
            : "Log in"}
      </button>
      <p className="text-center text-sm text-muted">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-primary">
              Log in
            </Link>
          </>
        ) : (
          <>
            New to Gachi?{" "}
            <Link href="/signup" className="text-primary">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

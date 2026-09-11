"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Logo } from "@/components/Logo";
import { CUISINES } from "@/lib/cuisines";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [region, setRegion] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggle(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (selected.length < 2) {
      setError("Pick at least 2 cuisines so we can find your matches.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      router.push("/login");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      username: username || user.email!.split("@")[0],
      display_name: displayName || "New Foodie",
      region,
      onboarded: true,
    });

    if (profileError) {
      setLoading(false);
      setError(profileError.message);
      return;
    }

    await supabase.from("profile_cuisines").delete().eq("profile_id", user.id);
    const { error: cuisinesError } = await supabase
      .from("profile_cuisines")
      .insert(selected.map((slug) => ({ profile_id: user.id, cuisine_slug: slug })));

    setLoading(false);
    if (cuisinesError) return setError(cuisinesError.message);

    router.push("/app");
    router.refresh();
  }

  return (
    <div className="flex flex-1 flex-col items-center px-6 py-16">
      <Logo className="mb-8" />
      <div className="w-full max-w-md">
        <h1 className="font-display text-2xl">Tell us about your taste</h1>
        <p className="mt-2 text-sm text-muted">
          This is how we&apos;ll find people whose food taste matches yours.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground/80">
                Display name
              </label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 outline-none focus:border-primary"
                placeholder="Lily"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground/80">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 outline-none focus:border-primary"
                placeholder="lily_eats"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground/80">
              Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 outline-none focus:border-primary"
            >
              <option value="">Select region…</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Orange County">Orange County</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground/80">
              Cuisines you love (pick at least 2)
            </label>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((c) => (
                <button
                  type="button"
                  key={c.slug}
                  onClick={() => toggle(c.slug)}
                  className={clsx(
                    "rounded-full border px-4 py-2 text-sm transition",
                    selected.includes(c.slug)
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-surface text-foreground/80 hover:border-primary/50"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Find my food people"}
          </button>
        </form>
      </div>
    </div>
  );
}

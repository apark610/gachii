import Link from "next/link";
import {
  getCurrentProfile,
  getOtherProfiles,
  getRestaurants,
  getMatchesForUser,
} from "@/lib/data";
import { tasteMatchScore } from "@/lib/matching";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function HomePage() {
  const session = await getCurrentProfile();
  if (!session?.profile) return null;
  const { profile, cuisines } = session;

  const [others, restaurants, matches] = await Promise.all([
    getOtherProfiles(profile.id),
    getRestaurants(),
    getMatchesForUser(profile.id),
  ]);

  const ranked = others
    .map((o) => ({ ...o, score: tasteMatchScore(cuisines, o.cuisines) }))
    .sort((a, b) => b.score - a.score);

  const topMatches = ranked.slice(0, 4);
  const avgScore = topMatches.length
    ? Math.round(
        topMatches.reduce((sum, m) => sum + m.score, 0) / topMatches.length
      )
    : 0;

  const planTogether = topMatches.slice(0, 2).map((m) => {
    const restaurant =
      restaurants.find((r) => r.cuisine_slug === m.cuisines[0]) ??
      restaurants[0];
    return { match: m, restaurant };
  });

  return (
    <div className="space-y-8 pt-4">
      <div>
        <h1 className="font-display text-2xl">
          {greeting()}, {profile.display_name.split(" ")[0]}.
        </h1>
        <p className="mt-1 text-sm text-muted">
          You have {topMatches.length} taste matches waiting.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard value={matches.length} label="Matches" />
        <StatCard value={`${avgScore}%`} label="Avg. taste match" />
        <StatCard value={cuisines.length} label="Cuisines" />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Your matches
          </h2>
          <Link href="/app/discover" className="text-xs text-primary">
            See all →
          </Link>
        </div>
        {topMatches.length === 0 ? (
          <EmptyState
            text="No matches yet — add more cuisines or check Discover."
            href="/app/discover"
            cta="Go to Discover"
          />
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {topMatches.map((m) => (
              <div
                key={m.id}
                className="w-36 shrink-0 rounded-2xl border border-border bg-surface p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft font-medium text-primary">
                  {initials(m.display_name)}
                </div>
                <p className="mt-3 truncate text-sm font-medium">
                  {m.username}
                </p>
                <p className="text-lg font-semibold text-primary">
                  {m.score}%
                </p>
                <p className="truncate text-xs text-muted">
                  {m.cuisines.slice(0, 2).join(" · ") || "No cuisines yet"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Plan together
        </h2>
        {planTogether.length === 0 || !planTogether[0].restaurant ? (
          <EmptyState
            text="Match with someone to start planning a meal."
            href="/app/discover"
            cta="Find a match"
          />
        ) : (
          <div className="space-y-3">
            {planTogether.map(
              ({ match, restaurant }) =>
                restaurant && (
                  <Link
                    key={match.id}
                    href="/app/matches"
                    className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4"
                  >
                    <div>
                      <p className="font-medium">{restaurant.name}</p>
                      <p className="text-xs text-muted">
                        {restaurant.neighborhood} · with {match.username} ·{" "}
                        {match.score}%
                      </p>
                    </div>
                    <span className="text-sm text-primary">Plan →</span>
                  </Link>
                )
            )}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Trending near you
        </h2>
        <div className="space-y-3">
          {restaurants.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4"
            >
              <div>
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-muted">
                  {r.cuisine_slug} · {r.neighborhood}
                </p>
              </div>
              <div className="flex gap-1">
                {r.vibe_tags?.slice(0, 2).map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-accent-soft px-2 py-1 text-[10px] font-medium text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3 text-center">
      <p className="font-display text-xl text-primary">{value}</p>
      <p className="text-[11px] text-muted">{label}</p>
    </div>
  );
}

function EmptyState({
  text,
  href,
  cta,
}: {
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-6 text-center">
      <p className="text-sm text-muted">{text}</p>
      <Link href={href} className="mt-3 inline-block text-sm text-primary">
        {cta} →
      </Link>
    </div>
  );
}

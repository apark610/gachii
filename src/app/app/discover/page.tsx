import {
  getCurrentProfile,
  getOtherProfiles,
  getMatchesForUser,
} from "@/lib/data";
import { tasteMatchScore } from "@/lib/matching";
import { MatchButton } from "@/components/MatchButton";
import { ProfileAvatar } from "@/components/ProfileAvatar";

export default async function DiscoverPage() {
  const session = await getCurrentProfile();
  if (!session?.profile) return null;
  const { profile, cuisines } = session;

  const [others, matches] = await Promise.all([
    getOtherProfiles(profile.id),
    getMatchesForUser(profile.id),
  ]);

  const matchedIds = new Set(
    matches.flatMap((m) => [m.user_a, m.user_b]).filter((id) => id !== profile.id)
  );

  const ranked = others
    .map((o) => ({ ...o, score: tasteMatchScore(cuisines, o.cuisines) }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-4 pt-4">
      <div>
        <h1 className="font-display text-2xl">Discover</h1>
        <p className="mt-1 text-sm text-muted">
          Ranked by how much your food taste overlaps.
        </p>
      </div>

      {ranked.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">
          No one else has joined yet — check back soon.
        </p>
      ) : (
        <div className="space-y-3">
          {ranked.map((person) => (
            <div
              key={person.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-center gap-3">
                <ProfileAvatar profile={person} size="md" />
                <div>
                  <p className="font-medium">{person.username}</p>
                  <p className="text-xs text-muted">
                    {person.cuisines.slice(0, 3).join(" · ") || "No cuisines yet"}
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    {person.score}% taste match
                  </p>
                </div>
              </div>
              <MatchButton
                otherId={person.id}
                score={person.score}
                initialMatched={matchedIds.has(person.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

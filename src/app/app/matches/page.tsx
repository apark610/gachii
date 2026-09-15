import {
  getCurrentProfile,
  getMatchesForUser,
  getProfilesByIds,
  getPlansForMatches,
  getAllRestaurants,
  getMessages,
} from "@/lib/data";
import { PlanPicker } from "@/components/PlanPicker";
import { ProposalCard } from "@/components/ProposalCard";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { MatchChat } from "@/components/MatchChat";

export default async function MatchesPage() {
  const session = await getCurrentProfile();
  if (!session?.profile) return null;
  const { profile, user } = session;

  const matches = await getMatchesForUser(profile.id);
  const otherIds = matches.map((m) =>
    m.user_a === profile.id ? m.user_b : m.user_a
  );

  const [otherProfiles, plans, restaurants, ...messagesArrays] = await Promise.all([
    getProfilesByIds(otherIds),
    getPlansForMatches(matches.map((m) => m.id)),
    getAllRestaurants(),
    ...matches.map((m) => getMessages(m.id)),
  ]);

  const profileById = new Map(otherProfiles.map((p) => [p.id, p]));
  const restaurantById = new Map(restaurants.map((r) => [r.id, r]));
  const messagesByMatch = new Map(
    matches.map((m, i) => [m.id, messagesArrays[i] || []])
  );

  // Separate incoming and outgoing proposals
  const incomingProposals = plans.filter(
    (p) => p.status === "proposed" && profileById.get(p.match_id)
  );
  const outgoingProposals = plans.filter(
    (p) => p.status === "proposed" && profileById.get(p.match_id)
  );
  const confirmedPlans = plans.filter((p) => p.status === "confirmed");

  return (
    <div className="space-y-6 pt-4">
      <div>
        <h1 className="font-display text-2xl">Matches</h1>
        <p className="mt-1 text-sm text-muted">
          {matches.length > 0
            ? "Propose restaurants and confirm plans with your matches"
            : "Find your food people"}
        </p>
      </div>

      {matches.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">
          No matches yet — head to Discover to find your food people.
        </p>
      ) : (
        <>
          {confirmedPlans.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                Confirmed Meetups
              </h2>
              <div className="space-y-3">
                {confirmedPlans.map((plan) => {
                  const match = matches.find((m) => m.id === plan.match_id);
                  if (!match) return null;
                  const otherId =
                    match.user_a === profile.id ? match.user_b : match.user_a;
                  const other = profileById.get(otherId);
                  const restaurant = restaurantById.get(plan.restaurant_id);
                  if (!other || !restaurant) return null;

                  return (
                    <ProposalCard
                      key={plan.id}
                      plan={plan}
                      restaurant={restaurant}
                      otherPerson={other}
                      isIncoming={false}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {incomingProposals.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                Pending Proposals
              </h2>
              <div className="space-y-3">
                {incomingProposals.map((plan) => {
                  const match = matches.find((m) => m.id === plan.match_id);
                  if (!match) return null;
                  const otherId =
                    match.user_a === profile.id ? match.user_b : match.user_a;
                  const other = profileById.get(otherId);
                  const restaurant = restaurantById.get(plan.restaurant_id);
                  if (!other || !restaurant) return null;

                  return (
                    <ProposalCard
                      key={plan.id}
                      plan={plan}
                      restaurant={restaurant}
                      otherPerson={other}
                      isIncoming={true}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Your Matches
            </h2>
            <div className="space-y-3">
              {matches.map((m) => {
                const otherId =
                  m.user_a === profile.id ? m.user_b : m.user_a;
                const other = profileById.get(otherId);
                const existingPlan = plans.find(
                  (p) => p.match_id === m.id && p.status !== "cancelled"
                );
                const planRestaurant = existingPlan
                  ? restaurantById.get(existingPlan.restaurant_id)
                  : undefined;
                if (!other) return null;

                return (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-border bg-surface p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ProfileAvatar profile={other} size="md" />
                        <div>
                          <p className="font-medium">{other.username}</p>
                          <p className="text-xs text-muted">
                            {m.taste_match}% taste match
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <MatchChat
                          matchId={m.id}
                          match={other}
                          messages={messagesByMatch.get(m.id) || []}
                          currentUserId={user.id}
                        />
                        <PlanPicker
                          matchId={m.id}
                          restaurants={restaurants}
                          existingPlanName={planRestaurant?.name}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

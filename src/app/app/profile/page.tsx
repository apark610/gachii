import {
  getCurrentProfile,
  getSavedRestaurantsWithDetails,
  getOtherProfiles,
  getMatchesForUser,
} from "@/lib/data";
import { ProfileForm } from "@/components/ProfileForm";
import { SavedRestaurantsList } from "@/components/SavedRestaurantsList";
import { ProfileCard } from "@/components/ProfileCard";

export default async function ProfilePage() {
  const session = await getCurrentProfile();
  if (!session?.profile) return null;
  const { profile, cuisines, user } = session;

  const [savedRestaurants, matches] = await Promise.all([
    getSavedRestaurantsWithDetails(user.id),
    getMatchesForUser(user.id),
  ]);

  const otherProfiles = await getOtherProfiles(user.id);
  const matchedProfiles = otherProfiles.filter((p) =>
    matches.some((m) => m.user_a === p.id || m.user_b === p.id)
  );

  return (
    <div className="space-y-6 pt-4">
      <ProfileCard profile={profile} cuisines={cuisines} />

      <div>
        <h2 className="mb-4 text-lg font-semibold">Saved Restaurants</h2>
        <SavedRestaurantsList restaurants={savedRestaurants} matches={matchedProfiles} />
      </div>
    </div>
  );
}

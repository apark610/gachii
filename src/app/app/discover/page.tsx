import {
  getCurrentProfile,
  getAllRestaurants,
  getSavedRestaurantsWithDetails,
} from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";

export default async function DiscoverPage() {
  const session = await getCurrentProfile();
  if (!session?.profile) return null;
  const { profile, user } = session;

  const [allRestaurants, savedRestaurants] = await Promise.all([
    getAllRestaurants(),
    getSavedRestaurantsWithDetails(user.id),
  ]);

  const savedIds = new Set(savedRestaurants.map((r) => r.id));
  const unsavedRestaurants = allRestaurants.filter((r) => !savedIds.has(r.id));

  return (
    <div className="space-y-4 pt-4">
      <div>
        <h1 className="font-display text-2xl">Discover Restaurants</h1>
        <p className="mt-1 text-sm text-muted">
          Find restaurants you want to try, match with people going to the same place
        </p>
      </div>

      {unsavedRestaurants.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted">
          You've saved all available restaurants! Check back soon for more.
        </p>
      ) : (
        <div className="space-y-3">
          {unsavedRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              userId={user.id}
              isSaved={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

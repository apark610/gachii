import { getCurrentProfile, getAllRestaurants, getSavedRestaurants } from "@/lib/data";
import { RestaurantsClient } from "./RestaurantsClient";
import type { Restaurant } from "@/lib/data";

export type { Restaurant };

export default async function RestaurantsPage() {
  const session = await getCurrentProfile();
  if (!session?.profile) return null;

  const [restaurants, savedIds] = await Promise.all([
    getAllRestaurants(),
    getSavedRestaurants(session.profile.id),
  ]);

  return (
    <RestaurantsClient
      restaurantsData={restaurants as Restaurant[]}
      savedIds={savedIds}
    />
  );
}

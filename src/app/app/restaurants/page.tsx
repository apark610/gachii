import { getCurrentProfile, getAllRestaurants, getSavedRestaurants } from "@/lib/data";
import { RestaurantsClient } from "./RestaurantsClient";

export type Restaurant = {
  id: string;
  name: string;
  cuisine_slug: string;
  neighborhood: string;
  region: string;
  address: string;
  hours: string;
  price_range: string;
};

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

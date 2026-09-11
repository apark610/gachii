import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  region: string;
  onboarded: boolean;
  photo_url?: string;
};

export type ProfileWithCuisines = Profile & { cuisines: string[] };

export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const { data: cuisineRows } = await supabase
    .from("profile_cuisines")
    .select("cuisine_slug")
    .eq("profile_id", user.id);

  return {
    user,
    profile: profile as Profile | null,
    cuisines: (cuisineRows ?? []).map((r) => r.cuisine_slug as string),
  };
}

export async function getOtherProfiles(excludeId: string) {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .neq("id", excludeId)
    .eq("onboarded", true);

  const { data: cuisineRows } = await supabase
    .from("profile_cuisines")
    .select("profile_id, cuisine_slug");

  const cuisinesByProfile = new Map<string, string[]>();
  for (const row of cuisineRows ?? []) {
    const list = cuisinesByProfile.get(row.profile_id) ?? [];
    list.push(row.cuisine_slug);
    cuisinesByProfile.set(row.profile_id, list);
  }

  return (profiles ?? []).map((p) => ({
    ...(p as Profile),
    cuisines: cuisinesByProfile.get(p.id) ?? [],
  })) as ProfileWithCuisines[];
}

export async function getRestaurants() {
  const supabase = await createClient();
  const { data } = await supabase.from("restaurants").select("*");
  return data ?? [];
}

export async function getMatchesForUser(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("matches")
    .select("*")
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .eq("status", "matched")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getPlansForMatches(matchIds: string[]) {
  if (matchIds.length === 0) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("plans")
    .select("*")
    .in("match_id", matchIds)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getProfilesByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").in("id", ids);
  return (data ?? []) as Profile[];
}

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

export async function getAllRestaurants() {
  const supabase = await createClient();
  const { data } = await supabase.from("restaurants").select("*");
  return (data ?? []) as Restaurant[];
}

export async function getSavedRestaurants(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("saved_restaurants")
    .select("restaurant_id")
    .eq("profile_id", userId);
  return (data ?? []).map((r) => r.restaurant_id);
}

export async function getSavedRestaurantsWithDetails(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("saved_restaurants")
    .select("restaurants(*)")
    .eq("profile_id", userId);
  return (data ?? []).map((row) => row.restaurants as Restaurant);
}

export async function getPlansWithDetails(userId: string) {
  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .or(`match_id.in.(select id from matches where user_a='${userId}' or user_b='${userId}')`);

  if (!plans) return [];

  const restaurantIds = [...new Set(plans.map((p) => p.restaurant_id))];
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("*")
    .in("id", restaurantIds);

  const restaurantMap = new Map(
    (restaurants ?? []).map((r) => [r.id, r as Restaurant])
  );

  return plans.map((p) => ({
    ...p,
    restaurant: restaurantMap.get(p.restaurant_id),
  }));
}

export async function getMessages(matchId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });
  return data ?? [];
}

export type Message = {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

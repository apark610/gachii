"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createMatch(otherId: string, score: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const [user_a, user_b] = [user.id, otherId].sort();

  const { error } = await supabase
    .from("matches")
    .upsert(
      { user_a, user_b, status: "matched", taste_match: score },
      { onConflict: "user_a,user_b" }
    );

  revalidatePath("/app");
  revalidatePath("/app/discover");
  revalidatePath("/app/matches");

  if (error) return { error: error.message };
  return { error: null };
}

export async function updateProfile(input: {
  displayName: string;
  region: string;
  bio: string;
  photoUrl?: string;
  cuisines: string[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      display_name: input.displayName,
      region: input.region,
      bio: input.bio,
      photo_url: input.photoUrl,
    })
    .eq("id", user.id);

  if (profileError) return { error: profileError.message };

  await supabase.from("profile_cuisines").delete().eq("profile_id", user.id);
  const { error: cuisinesError } = await supabase
    .from("profile_cuisines")
    .insert(input.cuisines.map((slug) => ({ profile_id: user.id, cuisine_slug: slug })));

  revalidatePath("/app/profile");
  revalidatePath("/app");
  revalidatePath("/app/discover");

  if (cuisinesError) return { error: cuisinesError.message };
  return { error: null };
}

export async function createPlan(
  matchId: string,
  restaurantId: string,
  scheduledFor?: string,
  scheduledTime?: string
) {
  const supabase = await createClient();

  let scheduledForTimestamp = null;
  if (scheduledFor && scheduledTime) {
    scheduledForTimestamp = new Date(`${scheduledFor}T${scheduledTime}`).toISOString();
  }

  const { error } = await supabase.from("plans").insert({
    match_id: matchId,
    restaurant_id: restaurantId,
    scheduled_for: scheduledForTimestamp,
    status: "proposed",
  });

  revalidatePath("/app/matches");
  revalidatePath("/app/profile");

  if (error) return { error: error.message };
  return { error: null };
}

export async function acceptPlan(planId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("plans")
    .update({ status: "confirmed" })
    .eq("id", planId);

  revalidatePath("/app/matches");

  if (error) return { error: error.message };
  return { error: null };
}

export async function declinePlan(planId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("plans")
    .update({ status: "cancelled" })
    .eq("id", planId);

  revalidatePath("/app/matches");

  if (error) return { error: error.message };
  return { error: null };
}

export async function sendMessage(matchId: string, content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { error } = await supabase.from("messages").insert({
    match_id: matchId,
    sender_id: user.id,
    content,
  });

  revalidatePath("/app/matches");

  if (error) return { error: error.message };
  return { error: null };
}

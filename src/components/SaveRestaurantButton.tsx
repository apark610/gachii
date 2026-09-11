"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SaveRestaurantButton({
  restaurantId,
  isSaved: initialSaved = false,
}: {
  restaurantId: string;
  isSaved?: boolean;
}) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggleSave() {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (isSaved) {
      await supabase
        .from("saved_restaurants")
        .delete()
        .eq("profile_id", user.id)
        .eq("restaurant_id", restaurantId);
      setIsSaved(false);
    } else {
      await supabase.from("saved_restaurants").insert({
        profile_id: user.id,
        restaurant_id: restaurantId,
      });
      setIsSaved(true);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggleSave}
      disabled={loading}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        isSaved
          ? "bg-accent-soft text-accent"
          : "border border-border text-foreground/80 hover:border-primary"
      } disabled:opacity-60`}
    >
      {isSaved ? "✓ Saved" : "Save"}
    </button>
  );
}

"use client";

import { useState, useTransition } from "react";
import { saveRestaurant } from "@/app/app/actions";
import { RestaurantDetail } from "./RestaurantDetail";
import type { Restaurant } from "@/lib/data";

export function RestaurantCard({
  restaurant,
  userId,
  isSaved,
}: {
  restaurant: Restaurant;
  userId: string;
  isSaved: boolean;
}) {
  const [saved, setSaved] = useState(isSaved);
  const [showPeople, setShowPeople] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSave() {
    startTransition(async () => {
      const result = await saveRestaurant(restaurant.id);
      if (!result.error) {
        setSaved(true);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <button
          onClick={() => setShowDetail(true)}
          className="flex-1 text-left transition hover:opacity-70"
        >
          <p className="font-medium text-lg">
            {restaurant.name} <span className="text-xs text-muted">· map</span>
          </p>
          <p className="text-xs text-muted">{restaurant.neighborhood}</p>
          {restaurant.vibe_tags && restaurant.vibe_tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {restaurant.vibe_tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-block rounded-full bg-primary-soft px-2 py-1 text-xs text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </button>
        <button
          onClick={handleSave}
          disabled={isPending || saved}
          className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            saved
              ? "bg-accent text-accent-soft"
              : "bg-primary text-primary-foreground hover:opacity-90"
          } disabled:opacity-60`}
        >
          {saved ? "✓ Saved" : isPending ? "..." : "Save"}
        </button>
      </div>

      {saved && (
        <button
          onClick={() => setShowPeople(!showPeople)}
          className="mt-3 text-xs text-muted hover:text-foreground"
        >
          👥 See who else wants to go
        </button>
      )}

      {showDetail && (
        <RestaurantDetail
          restaurant={restaurant}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}

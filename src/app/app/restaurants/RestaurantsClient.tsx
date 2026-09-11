"use client";

import { useState, useMemo } from "react";
import { SaveRestaurantButton } from "@/components/SaveRestaurantButton";
import { CUISINES } from "@/lib/cuisines";
import type { Restaurant } from "./page";

const PRICE_RANGES = [
  { value: "$", label: "Budget" },
  { value: "$$", label: "Moderate" },
  { value: "$$$", label: "Upscale" },
];

const FOOD_KEYWORDS: Record<string, string[]> = {
  korean: ["kbbq", "korean bbq", "bibimbap", "bulgogi"],
  japanese: ["sushi", "ramen", "tempura", "udon"],
  thai: ["pad thai", "curry", "tom yum"],
  vietnamese: ["pho", "banh mi", "banh"],
  chinese: ["dim sum", "dumplings"],
  mexican: ["tacos", "burritos", "enchiladas"],
  italian: ["pizza", "pasta", "risotto"],
  indian: ["curry", "tandoori", "naan"],
  mediterranean: ["hummus", "falafel", "kebab"],
  american: ["burger", "steak", "bbq"],
  french: ["croissant", "crepe", "escargot"],
  filipino: ["adobo", "lumpia"],
};

export function RestaurantsClient({
  restaurantsData,
  savedIds,
}: {
  restaurantsData: Restaurant[];
  savedIds: string[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return restaurantsData.filter((r) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        r.name.toLowerCase().includes(searchLower) ||
        r.neighborhood.toLowerCase().includes(searchLower) ||
        CUISINES.find((c) => c.slug === r.cuisine_slug)?.label.toLowerCase().includes(searchLower) ||
        (FOOD_KEYWORDS[r.cuisine_slug]?.some((keyword) =>
          keyword.includes(searchLower) || searchLower.includes(keyword)
        ) ?? false);

      const matchesCuisine =
        selectedCuisines.length === 0 || selectedCuisines.includes(r.cuisine_slug);

      const matchesPrice =
        selectedPrices.length === 0 || selectedPrices.includes(r.price_range);

      return matchesSearch && matchesCuisine && matchesPrice;
    });
  }, [restaurantsData, searchQuery, selectedCuisines, selectedPrices]);

  function toggleCuisine(slug: string) {
    setSelectedCuisines((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function togglePrice(price: string) {
    setSelectedPrices((prev) =>
      prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <div>
        <h1 className="font-display text-2xl">Restaurants</h1>
        <p className="mt-1 text-sm text-muted">
          Save places you want to try, then propose them to your matches.
        </p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search by name or neighborhood…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 outline-none focus:border-primary"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Cuisine
        </p>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <button
              key={c.slug}
              onClick={() => toggleCuisine(c.slug)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                selectedCuisines.includes(c.slug)
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border text-foreground/80 hover:border-primary/50"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Price
        </p>
        <div className="flex gap-2">
          {PRICE_RANGES.map((p) => (
            <button
              key={p.value}
              onClick={() => togglePrice(p.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                selectedPrices.includes(p.value)
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border text-foreground/80 hover:border-primary/50"
              }`}
            >
              {p.label} {p.value}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-muted">{filtered.length} restaurants found</p>
        {filtered.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-border bg-surface p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-medium">{r.name}</h3>
                <p className="text-xs text-muted">
                  {r.neighborhood} · {r.region}
                </p>
                <p className="mt-1 text-xs text-muted">{r.address}</p>
                <p className="text-xs text-muted">{r.hours}</p>
                <p className="mt-2 text-sm font-semibold text-primary">
                  {r.price_range}
                </p>
              </div>
              <SaveRestaurantButton
                restaurantId={r.id}
                isSaved={savedIds.includes(r.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

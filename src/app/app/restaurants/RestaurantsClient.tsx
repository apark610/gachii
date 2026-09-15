"use client";

import { useState, useMemo, useEffect } from "react";
import { saveLiveRestaurant } from "@/app/app/actions";
import { SaveRestaurantButton } from "@/components/SaveRestaurantButton";
import { RestaurantDetail } from "@/components/RestaurantDetail";
import { CUISINES } from "@/lib/cuisines";
import type { Restaurant } from "./page";

type LiveResult = {
  external_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

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
  const [detail, setDetail] = useState<Restaurant | null>(null);
  const [live, setLive] = useState<LiveResult[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);

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
        selectedPrices.length === 0 ||
        (r.price_range !== undefined && selectedPrices.includes(r.price_range));

      return matchesSearch && matchesCuisine && matchesPrice;
    });
  }, [restaurantsData, searchQuery, selectedCuisines, selectedPrices]);

  // Live search runs only after the user pauses typing, and only past 3
  // characters — every call counts against the Places API monthly free tier.
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 3) {
      setLive([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLiveLoading(true);
      try {
        const res = await fetch(
          `/api/restaurants/search?q=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        const curatedNames = new Set(
          restaurantsData.map((r) => r.name.toLowerCase())
        );
        setLive(
          (data.results ?? []).filter(
            (r: LiveResult) => !curatedNames.has(r.name.toLowerCase())
          )
        );
      } catch {
        // Aborted or offline — leave the curated results as they are.
      } finally {
        setLiveLoading(false);
      }
    }, 600);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchQuery, restaurantsData]);

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
              <button
                onClick={() => setDetail(r)}
                className="flex-1 text-left transition hover:opacity-70"
              >
                <h3 className="font-medium">
                  {r.name} <span className="text-xs text-muted">· map</span>
                </h3>
                <p className="text-xs text-muted">
                  {r.neighborhood} · {r.region}
                </p>
                <p className="mt-1 text-xs text-muted">{r.address}</p>
                <p className="text-xs text-muted">{r.hours}</p>
                <p className="mt-2 text-sm font-semibold text-primary">
                  {r.price_range}
                </p>
              </button>
              <SaveRestaurantButton
                restaurantId={r.id}
                isSaved={savedIds.includes(r.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {(liveLoading || live.length > 0) && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            More places matching &ldquo;{searchQuery.trim()}&rdquo;
          </p>
          {liveLoading && live.length === 0 ? (
            <p className="text-xs text-muted">Searching…</p>
          ) : (
            live.map((r) => (
              <LiveResultRow
                key={r.external_id}
                result={r}
                onOpen={() =>
                  setDetail({
                    id: r.external_id,
                    name: r.name,
                    cuisine_slug: "",
                    neighborhood: r.address.split(",")[1]?.trim() || "",
                    address: r.address,
                    lat: r.lat,
                    lng: r.lng,
                  })
                }
              />
            ))
          )}
        </div>
      )}

      {detail && (
        <RestaurantDetail restaurant={detail} onClose={() => setDetail(null)} />
      )}
    </div>
  );
}

function LiveResultRow({
  result,
  onOpen,
}: {
  result: LiveResult;
  onOpen: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const res = await saveLiveRestaurant(result);
    setSaving(false);
    if (!res.error) setSaved(true);
  }

  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <button
          onClick={onOpen}
          className="flex-1 text-left transition hover:opacity-70"
        >
          <h3 className="font-medium">
            {result.name} <span className="text-xs text-muted">· map</span>
          </h3>
          <p className="mt-1 text-xs text-muted">{result.address}</p>
        </button>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            saved
              ? "bg-accent-soft text-accent"
              : "bg-primary text-primary-foreground hover:opacity-90"
          } disabled:opacity-60`}
        >
          {saved ? "✓ Saved" : saving ? "…" : "Save"}
        </button>
      </div>
    </div>
  );
}

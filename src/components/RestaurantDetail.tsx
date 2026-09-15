"use client";

import dynamic from "next/dynamic";
import type { Restaurant } from "@/lib/data";

// Leaflet reads `window` at import time, so it can never render on the server.
const RestaurantMap = dynamic(() => import("./RestaurantMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[220px] animate-pulse rounded-xl border border-border bg-primary-soft/30" />
  ),
});

function yelpUrl(r: Restaurant) {
  const params = new URLSearchParams({
    find_desc: r.name,
    find_loc: r.address || `${r.neighborhood}, CA`,
  });
  return `https://www.yelp.com/search?${params}`;
}

function directionsUrl(r: Restaurant) {
  const params = new URLSearchParams({
    api: "1",
    destination: r.address ? `${r.name}, ${r.address}` : `${r.name}, ${r.neighborhood}, CA`,
  });
  return `https://www.google.com/maps/dir/?${params}`;
}

export function RestaurantDetail({
  restaurant,
  onClose,
}: {
  restaurant: Restaurant;
  onClose: () => void;
}) {
  const hasCoords =
    typeof restaurant.lat === "number" && typeof restaurant.lng === "number";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-border bg-surface sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-xl">{restaurant.name}</h2>
            <p className="text-xs text-muted">
              {restaurant.neighborhood}
              {restaurant.price_range ? ` · ${restaurant.price_range}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-lg leading-none text-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 p-5">
          {hasCoords ? (
            <RestaurantMap
              points={[
                {
                  id: restaurant.id,
                  name: restaurant.name,
                  lat: restaurant.lat as number,
                  lng: restaurant.lng as number,
                },
              ]}
            />
          ) : (
            <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted">
              Map location not available for this spot yet.
            </p>
          )}

          {restaurant.address && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Address
              </p>
              <p className="mt-1 text-sm">{restaurant.address}</p>
            </div>
          )}

          {restaurant.hours && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Hours
              </p>
              <p className="mt-1 text-sm">{restaurant.hours}</p>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <a
              href={yelpUrl(restaurant)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Reviews &amp; photos
            </a>
            <a
              href={directionsUrl(restaurant)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full border border-border px-4 py-2.5 text-center text-sm font-medium transition hover:border-primary hover:text-primary"
            >
              Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

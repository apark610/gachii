import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Bounding box covering Los Angeles + Orange County.
const LA_OC_BOUNDS = {
  low: { latitude: 33.4, longitude: -118.7 },
  high: { latitude: 34.4, longitude: -117.5 },
};

// The field mask decides which pricing SKU the call bills at, and the SKU
// decides the monthly free allowance: Pro gets 5,000 calls, Enterprise only
// 1,000. Requesting rating/reviews/photos moves this call to Enterprise, so
// those stay out — reviews are handled by linking to Yelp instead.
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
].join(",");

export type LiveRestaurant = {
  external_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    // Not configured yet — the UI falls back to the curated list.
    return NextResponse.json({ results: [], unavailable: true });
  }

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery: query,
        includedType: "restaurant",
        maxResultCount: 15,
        locationRestriction: { rectangle: LA_OC_BOUNDS },
      }),
    });

    if (!res.ok) {
      // Most likely the daily quota cap was hit. Degrade quietly.
      console.error("Places search failed:", res.status, await res.text());
      return NextResponse.json({ results: [], unavailable: true });
    }

    const data = await res.json();
    const results: LiveRestaurant[] = (data.places ?? [])
      .filter((p: any) => p.id && p.location)
      .map((p: any) => ({
        external_id: p.id,
        name: p.displayName?.text ?? "Unknown",
        address: p.formattedAddress ?? "",
        lat: p.location.latitude,
        lng: p.location.longitude,
      }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Places search error:", error);
    return NextResponse.json({ results: [], unavailable: true });
  }
}

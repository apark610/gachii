"use client";

import { useState } from "react";
import { createPlan } from "@/app/app/actions";
import type { Restaurant } from "@/lib/data";
import type { ProfileWithCuisines } from "@/lib/data";
import { CUISINES } from "@/lib/cuisines";

export function SavedRestaurantsList({
  restaurants,
  matches,
}: {
  restaurants: Restaurant[];
  matches: ProfileWithCuisines[];
}) {
  const [proposingFor, setProposingFor] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const restaurantBeingProposed = proposingFor
    ? restaurants.find((r) => r.id === proposingFor)
    : null;

  async function handlePropose() {
    if (!selectedMatch || !selectedDate || !selectedTime) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    const result = await createPlan(selectedMatch, proposingFor!, selectedDate, selectedTime);
    setIsSubmitting(false);

    if (result.error) {
      alert("Failed to propose: " + result.error);
    } else {
      alert("Proposal sent!");
      setProposingFor(null);
      setSelectedMatch("");
      setSelectedDate("");
      setSelectedTime("");
    }
  }

  if (restaurants.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-center">
        <p className="text-sm text-muted">
          You haven't saved any restaurants yet. Browse the Restaurants tab to start saving!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {restaurants.map((r) => (
        <div
          key={r.id}
          className="rounded-2xl border border-border bg-surface p-4"
        >
          <div className="space-y-2">
            <h3 className="font-medium">{r.name}</h3>
            <p className="text-xs text-muted">
              {r.neighborhood} · {r.region}
            </p>
            <p className="text-xs text-muted">{r.address}</p>
            <p className="text-xs text-muted">{r.hours}</p>
            <p className="text-xs font-semibold text-primary">{r.price_range}</p>
            <button
              onClick={() => setProposingFor(r.id)}
              className="mt-3 inline-block rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-surface transition hover:opacity-90"
            >
              Propose Meetup
            </button>
          </div>
        </div>
      ))}

      {proposingFor && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50" onClick={() => setProposingFor(null)}>
          <div className="w-full rounded-t-3xl border border-border bg-surface p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-xl font-semibold">Propose a Meetup</h2>
            <p className="mb-4 text-sm text-muted">
              at <span className="font-medium text-foreground">{restaurantBeingProposed?.name}</span>
            </p>

            {matches.length === 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted">
                  You don't have any matches yet. Go to the Discover tab to find people!
                </p>
                <button
                  onClick={() => setProposingFor(null)}
                  className="w-full rounded-lg border border-border px-4 py-2.5 font-medium transition hover:bg-surface-2"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">
                    Who would you like to invite?
                  </label>
                  <select
                    value={selectedMatch}
                    onChange={(e) => setSelectedMatch(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 outline-none focus:border-primary"
                  >
                    <option value="">Select a match</option>
                    {matches.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.display_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-muted mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handlePropose}
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-primary px-4 py-2.5 font-medium text-surface transition disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send Proposal"}
                  </button>
                  <button
                    onClick={() => setProposingFor(null)}
                    className="flex-1 rounded-lg border border-border px-4 py-2.5 font-medium transition hover:bg-surface-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

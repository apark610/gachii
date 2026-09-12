"use client";

import { useState, useTransition } from "react";
import { createPlan } from "@/app/app/actions";

type Restaurant = { id: string; name: string; neighborhood: string };

export function PlanPicker({
  matchId,
  restaurants,
  existingPlanName,
}: {
  matchId: string;
  restaurants: Restaurant[];
  existingPlanName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"restaurant" | "datetime">("restaurant");
  const [isPending, startTransition] = useTransition();
  const [planned, setPlanned] = useState(existingPlanName ?? null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (planned) {
    return (
      <p className="text-sm text-accent">Plan set: {planned} ✓</p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Plan →
      </button>
    );
  }

  if (step === "restaurant") {
    return (
      <div className="flex flex-wrap gap-2">
        {restaurants.map((r) => (
          <button
            key={r.id}
            onClick={() => {
              setSelectedRestaurant(r);
              setStep("datetime");
            }}
            className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-primary hover:text-primary"
          >
            {r.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-4">
        <h3 className="font-medium">{selectedRestaurant?.name}</h3>
        <p className="text-xs text-muted">{selectedRestaurant?.neighborhood}</p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              setStep("restaurant");
              setDate("");
              setTime("");
            }}
            className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface-2"
          >
            Back
          </button>
          <button
            disabled={isPending || !date || !time}
            onClick={() =>
              startTransition(async () => {
                if (selectedRestaurant) {
                  await createPlan(matchId, selectedRestaurant.id, date, time);
                  setPlanned(selectedRestaurant.name);
                  setOpen(false);
                }
              })
            }
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition disabled:opacity-50"
          >
            {isPending ? "..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

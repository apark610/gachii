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
  const [isPending, startTransition] = useTransition();
  const [planned, setPlanned] = useState(existingPlanName ?? null);

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

  return (
    <div className="flex flex-wrap gap-2">
      {restaurants.map((r) => (
        <button
          key={r.id}
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await createPlan(matchId, r.id);
              setPlanned(r.name);
            })
          }
          className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-primary hover:text-primary disabled:opacity-60"
        >
          {r.name}
        </button>
      ))}
    </div>
  );
}

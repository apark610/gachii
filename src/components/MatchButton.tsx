"use client";

import { useState, useTransition } from "react";
import { createMatch } from "@/app/app/actions";

export function MatchButton({
  otherId,
  score,
  initialMatched = false,
}: {
  otherId: string;
  score: number;
  initialMatched?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(initialMatched);

  if (done) {
    return (
      <span className="rounded-full bg-accent-soft px-4 py-2 text-sm font-medium text-accent">
        Matched
      </span>
    );
  }

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await createMatch(otherId, score);
          setDone(true);
        })
      }
      className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
    >
      {isPending ? "…" : "Match"}
    </button>
  );
}

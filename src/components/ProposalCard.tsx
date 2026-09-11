"use client";

import { useState } from "react";
import { acceptPlan, declinePlan } from "@/app/app/actions";
import type { Restaurant, Profile } from "@/lib/data";

export function ProposalCard({
  plan,
  restaurant,
  otherPerson,
  isIncoming,
}: {
  plan: any;
  restaurant: Restaurant;
  otherPerson: Profile;
  isIncoming: boolean;
}) {
  const [status, setStatus] = useState(plan.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scheduledDate = plan.scheduled_for
    ? new Date(plan.scheduled_for).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Date TBD";

  const scheduledTime = plan.scheduled_for
    ? new Date(plan.scheduled_for).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "Time TBD";

  async function handleAccept() {
    setIsSubmitting(true);
    const result = await acceptPlan(plan.id);
    setIsSubmitting(false);

    if (result.error) {
      alert("Failed to accept: " + result.error);
    } else {
      setStatus("confirmed");
    }
  }

  async function handleDecline() {
    setIsSubmitting(true);
    const result = await declinePlan(plan.id);
    setIsSubmitting(false);

    if (result.error) {
      alert("Failed to decline: " + result.error);
    } else {
      setStatus("cancelled");
    }
  }

  if (status === "cancelled") {
    return null;
  }

  if (status === "confirmed") {
    return (
      <div className="rounded-2xl border border-accent bg-accent-soft p-4">
        <div className="space-y-2">
          <h3 className="font-medium text-accent">✓ Meetup Confirmed</h3>
          <p className="text-sm text-foreground">{restaurant.name}</p>
          <p className="text-xs text-muted">
            {scheduledDate} at {scheduledTime}
          </p>
          <p className="text-xs text-muted">with {otherPerson.display_name}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-1">
            {isIncoming ? "Proposal from" : "Proposal sent to"}
          </p>
          <p className="font-medium">{otherPerson.display_name}</p>
        </div>

        <div className="border-t border-border pt-3">
          <p className="text-sm font-medium">{restaurant.name}</p>
          <p className="text-xs text-muted">{restaurant.neighborhood}</p>
          <p className="mt-2 text-sm text-muted">
            {scheduledDate} at {scheduledTime}
          </p>
        </div>

        {isIncoming && status === "proposed" && (
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleAccept}
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-surface transition disabled:opacity-50"
            >
              {isSubmitting ? "..." : "Accept"}
            </button>
            <button
              onClick={handleDecline}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-surface-2 disabled:opacity-50"
            >
              {isSubmitting ? "..." : "Decline"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

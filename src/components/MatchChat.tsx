"use client";

import { useState } from "react";
import { MessageThread } from "./MessageThread";
import { ProfileAvatar } from "./ProfileAvatar";
import type { Message, Profile } from "@/lib/data";

export function MatchChat({
  matchId,
  match,
  messages,
  currentUserId,
}: {
  matchId: string;
  match: Profile;
  messages: Message[];
  currentUserId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium transition hover:bg-surface-2"
      >
        Message
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-96 w-full max-w-sm flex-col rounded-2xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <ProfileAvatar profile={match} size="sm" />
            <p className="font-medium">{match.display_name}</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-lg text-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <MessageThread
          messages={messages}
          currentUserId={currentUserId}
          matchId={matchId}
          otherPersonName={match.display_name}
        />
      </div>
    </div>
  );
}

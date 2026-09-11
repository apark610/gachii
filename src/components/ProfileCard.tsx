"use client";

import { useState } from "react";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileForm } from "./ProfileForm";
import type { Profile } from "@/lib/data";

export function ProfileCard({
  profile,
  cuisines,
}: {
  profile: Profile;
  cuisines: string[];
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button
            onClick={() => setIsEditing(false)}
            className="text-sm text-muted hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <ProfileForm
          initialDisplayName={profile.display_name}
          initialRegion={profile.region ?? ""}
          initialBio={profile.bio ?? ""}
          initialCuisines={cuisines}
          initialPhotoUrl={profile.photo_url}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <ProfileAvatar profile={profile} size="lg" />
          <div>
            <h1 className="font-display text-2xl">{profile.display_name}</h1>
            <p className="text-sm text-muted">@{profile.username}</p>
            {profile.bio && <p className="mt-1 text-sm">{profile.bio}</p>}
            {cuisines.length > 0 && (
              <p className="mt-2 text-xs text-muted">
                {cuisines.slice(0, 3).join(" · ")}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="flex-shrink-0 rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-surface-2"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

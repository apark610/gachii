"use client";

import { useState, useTransition } from "react";
import clsx from "clsx";
import { CUISINES } from "@/lib/cuisines";
import { updateProfile } from "@/app/app/actions";
import { PhotoUpload } from "./PhotoUpload";

export function ProfileForm({
  initialDisplayName,
  initialRegion,
  initialBio,
  initialCuisines,
  initialPhotoUrl,
  initialPhoneNumber,
}: {
  initialDisplayName: string;
  initialRegion: string;
  initialBio: string;
  initialCuisines: string[];
  initialPhotoUrl?: string;
  initialPhoneNumber?: string;
}) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [region, setRegion] = useState(initialRegion);
  const [bio, setBio] = useState(initialBio);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || "");
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [selected, setSelected] = useState<string[]>(initialCuisines);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function handleSave() {
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const result = await updateProfile({
        displayName,
        region,
        bio,
        phoneNumber,
        photoUrl,
        cuisines: selected,
      });
      if (result.error) setError(result.error);
      else setSaved(true);
    });
  }

  return (
    <div className="space-y-6">
      <PhotoUpload
        currentPhotoUrl={photoUrl}
        onPhotoUrlChange={setPhotoUrl}
      />
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground/80">
          Display name
        </label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground/80">
          Region
        </label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 outline-none focus:border-primary"
        >
          <option value="">Select region…</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="Orange County">Orange County</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground/80">
          Phone Number (optional, for SMS notifications)
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+1 (555) 123-4567"
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground/80">
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 outline-none focus:border-primary"
          placeholder="A sentence about your food taste…"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground/80">
          Cuisines
        </label>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <button
              type="button"
              key={c.slug}
              onClick={() => toggle(c.slug)}
              className={clsx(
                "rounded-full border px-4 py-2 text-sm transition",
                selected.includes(c.slug)
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-surface text-foreground/80 hover:border-primary/50"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-accent">Saved.</p>}

      <button
        onClick={handleSave}
        disabled={isPending}
        className="w-full rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function PhotoUpload({
  currentPhotoUrl,
  onPhotoUrlChange,
}: {
  currentPhotoUrl?: string;
  onPhotoUrlChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentPhotoUrl || null
  );

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    setUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileName = `${user.id}-${Date.now()}`;
      const { data, error } = await supabase.storage
        .from("profile-photos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(data.path);

      onPhotoUrlChange(publicUrlData.publicUrl);
    } catch (error) {
      alert("Failed to upload photo: " + error);
      setPreviewUrl(currentPhotoUrl || null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Profile Photo</label>

      {previewUrl && (
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-surface-2">
          <img
            src={previewUrl}
            alt="Profile preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-surface-2 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Choose Photo"}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-muted">JPG or PNG, max 2MB</p>
    </div>
  );
}

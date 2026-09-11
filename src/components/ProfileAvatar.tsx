import type { Profile } from "@/lib/data";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileAvatar({
  profile,
  size = "md",
}: {
  profile: Profile;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-11 w-11 text-base",
    lg: "h-16 w-16 text-lg",
  };

  if (profile.photo_url) {
    return (
      <img
        src={profile.photo_url}
        alt={profile.display_name}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-primary-soft font-medium text-primary`}
    >
      {getInitials(profile.display_name)}
    </div>
  );
}

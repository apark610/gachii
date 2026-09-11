"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const TABS = [
  { href: "/app", label: "Home" },
  { href: "/app/discover", label: "Discover" },
  { href: "/app/restaurants", label: "Restaurants" },
  { href: "/app/matches", label: "Matches" },
  { href: "/app/profile", label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-10 flex border-t border-border bg-surface/95 backdrop-blur">
      {TABS.map((tab) => {
        const active =
          tab.href === "/app" ? pathname === "/app" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "flex-1 py-3 text-center text-xs font-medium transition",
              active ? "text-primary" : "text-muted"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

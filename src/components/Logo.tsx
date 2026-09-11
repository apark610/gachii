import clsx from "clsx";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <div className="w-8 h-8 relative">
        <Image
          src="/gachi-logo.svg"
          alt="Gachi"
          width={32}
          height={32}
          className="w-full h-full"
        />
      </div>
      <span className="font-display text-xl lowercase tracking-tight text-foreground">
        gachi
      </span>
    </div>
  );
}

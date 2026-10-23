import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ClubMapEntry } from "@/types/clubs-map";

export function toArray(value?: string | string[] | null): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function LogoStack({ club, size }: { club: ClubMapEntry; size: "sm" | "md" }) {
  const name = club.name ?? club.id;
  return (
    <span className={cn("flex shrink-0", size === "sm" ? "-space-x-2.5" : "-space-x-3")}>
      {toArray(club.logo).map((logo) => (
        <span
          key={logo}
          className={cn(
            "relative overflow-hidden rounded-full bg-white ring-2 ring-surface",
            size === "sm" ? "h-10 w-10" : club.id === "triominos" ? "h-16 w-16" : "h-12 w-12"
          )}
        >
          <Image src={logo} alt={`${name} logo`} fill sizes="64px" className="object-contain p-1" />
        </span>
      ))}
    </span>
  );
}

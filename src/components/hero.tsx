import { QuickLinks } from "@/components/quick-links";
import { ClubMap } from "@/components/club-map";
import type { ClubMapEntry } from "@/types/clubs-map";

interface HeroProps {
  clubs: ClubMapEntry[];
  clubNames?: Record<string, string>;
}

export function Hero({ clubs, clubNames }: HeroProps) {
  return (
    <section className="border-b border-border bg-muted/20">
      <div className="flex flex-col lg:flex-row">
        {/* Quick Links - Links (op container-grid) */}
        <div className="w-full lg:w-1/2">
          <div className="w-full max-w-[410px] mx-auto py-12 lg:py-16 lg:flex lg:flex-col lg:justify-center mt-20 h-full">
            <QuickLinks />
          </div>
        </div>

        {/* Map - Rechts (buiten container) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="h-full w-full">
            <ClubMap clubs={clubs} clubNames={clubNames} />
          </div>
        </div>
      </div>
    </section>
  );
}

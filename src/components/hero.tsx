import { ClubMap } from "@/components/club-map";
import Image from "next/image";
import type { ClubMapEntry } from "@/types/clubs-map";

interface HeroProps {
  clubs: ClubMapEntry[];
  clubNames?: Record<string, string>;
  introTitle?: string;
  introHtml: string;
  id?: string;
}

export function Hero({ clubs, clubNames, introTitle, introHtml, id }: HeroProps) {
  return (
    <section id={id} className="bg-muted/20 h-[50vh]">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Intro - Links (op container-grid) */}
        <div className="w-full lg:w-1/2">
          <div className="w-full max-w-[646px] ml-auto mr-30 py-12 lg:py-16 lg:flex lg:flex-col lg:justify-center mt-18 mb-10 h-full">
            <article className="space-y-4">
              <div
                className="prose prose-neutral max-w-none text-slate-700"
                dangerouslySetInnerHTML={{ __html: introHtml }}
              />
            </article>
            <div className="mt-10 flex justify-center lg:justify-start">
              <Image
                src="/liemers_heart.svg"
                alt="Het Liemers-logo"
                width={64}
                height={64}
                className="h-auto max-w-[64px]"
              />
            </div>
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

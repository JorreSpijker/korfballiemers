import Image from "next/image";
import { Pattern } from "@/components/pattern";

interface HeroProps {
  introHtml: string;
  id?: string;
}

export function Hero({ introHtml, id }: HeroProps) {
  return (
    <section id={id} className="bg-muted/20 min-h-[50vh] relative">
      <div className="w-full relative overflow-hidden">
        <Pattern />
        <div className="container h-full flex items-center">
          {/* Intro - Links, binnen container */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center h-ful pt-40 pb-20 pr-10">
            <article className="space-y-4">
              <div
                className="prose prose-neutral max-w-none text-slate-700"
                dangerouslySetInnerHTML={{ __html: introHtml }}
              />
            </article>
          </div>
        </div>
        {/* Afbeelding - buiten container, flush rechts */}
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
          <Image
            src="/hero.JPG"
            alt="Hero afbeelding"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      <div className="absolute bottom-0 left-[50%] -translate-x-[50%] translate-y-[50%] z-1 animate-heartbeat">
          <Image
            src="/liemers_heart.svg"
            alt="Het Liemers-logo"
            width={64}
            height={64}
            className="h-auto max-w-[64px]"
          />
        </div>
    </section>
  );
}

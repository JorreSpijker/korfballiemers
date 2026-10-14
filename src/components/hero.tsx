import Image from "next/image";
import { Pattern } from "@/components/pattern";

interface HeroProps {
  introHtml: string;
  id?: string;
}

export function Hero({ introHtml, id }: HeroProps) {
  return (
    <section id={id} className="relative overflow-hidden border-y border-white/[0.08]">
      <Pattern />
      <div className="container relative">
        <div className="flex min-w-0 flex-col gap-5 pt-18 pb-16 lg:min-h-[min(780px,calc(100svh-6rem))] lg:w-1/2 lg:justify-center lg:gap-7 lg:py-28 lg:pr-12 xl:pr-20">
          <h1 className="m-0 font-heading text-5xl font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-white sm:text-[68px]">
            <span className="mask-word"><span>Samen</span></span>{" "}
            <span className="mask-word"><span className="[--d:60ms]">sterker</span></span>{" "}
            <span className="mask-word"><span className="[--d:120ms]">in</span></span>{" "}
            <span className="mask-word"><span className="[--d:180ms]">de</span></span>{" "}
            <span className="mask-word">
              <span className="bg-gradient-to-r from-energie-groen to-[#3D7BFF] bg-clip-text text-transparent [--d:240ms]">
                Liemers
              </span>
            </span>
          </h1>
          <div
            className="anim-rise max-w-[540px] text-lg text-foreground [--d:420ms] [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: introHtml }}
          />
          <div className="anim-rise flex flex-wrap gap-3 pt-2 [--d:540ms]">
            <a
              href="#over"
              className="inline-flex min-h-12 items-center rounded-md bg-actie-blauw px-6 font-bold text-white transition-[color,background-color,transform] duration-200 ease-(--ease-out-quint) hover:bg-actie-blauw/85 hover:text-white motion-safe:active:scale-[0.97]"
            >
              Bekijk de clubs
            </a>
            <a
              href="#nieuws"
              className="inline-flex min-h-12 items-center rounded-md border border-white/25 px-6 font-semibold text-white transition-[color,background-color,border-color,transform] duration-200 ease-(--ease-out-quint) hover:border-white/50 hover:bg-white/5 hover:text-white motion-safe:active:scale-[0.97]"
            >
              Laatste nieuws
            </a>
          </div>
        </div>
      </div>
      {/* Afbeelding: op desktop flush rechts, de helft van de viewport */}
      <div className="anim-wipe relative min-h-[420px] overflow-hidden [--d:150ms] lg:absolute lg:inset-y-0 lg:right-0 lg:min-h-0 lg:w-1/2">
        <Image
          src="/hero.JPG"
          alt="Korfbalwedstrijd: spelers in groen en geel springen naar de bal bij de korf"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="anim-zoom object-cover object-[17%_50%] [--d:150ms]"
          priority
        />
        <div className="anim-grow absolute inset-x-0 bottom-0 flex h-1 [--d:700ms]" aria-hidden>
          <span className="flex-1 bg-energie-groen" />
          <span className="flex-1 bg-actie-blauw" />
        </div>
      </div>
    </section>
  );
}

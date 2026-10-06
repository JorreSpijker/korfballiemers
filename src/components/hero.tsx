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
      <div className="container relative flex flex-wrap items-stretch gap-14">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-5 pt-18 pb-16">
          <h1 className="m-0 font-heading text-5xl font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-white sm:text-[68px]">
            Samen sterker in de{" "}
            <span className="bg-gradient-to-r from-energie-groen to-[#3D7BFF] bg-clip-text text-transparent">
              Liemers
            </span>
          </h1>
          <div
            className="max-w-[540px] text-lg text-foreground [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: introHtml }}
          />
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#over"
              className="inline-flex min-h-12 items-center rounded-md bg-actie-blauw px-6 font-bold text-white transition-colors hover:bg-actie-blauw/85 hover:text-white"
            >
              Bekijk de clubs
            </a>
            <a
              href="#nieuws"
              className="inline-flex min-h-12 items-center rounded-md border border-white/25 px-6 font-semibold text-white transition-colors hover:bg-white/5 hover:text-white"
            >
              Laatste nieuws
            </a>
          </div>
        </div>
        <div className="relative min-h-[420px] min-w-0 flex-[1_1_460px]">
          <Image
            src="/hero.JPG"
            alt="Korfbalwedstrijd: spelers in groen en geel springen naar de bal bij de korf"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[17%_50%]"
            priority
          />
          <div className="absolute inset-x-0 bottom-0 flex h-1" aria-hidden>
            <span className="flex-1 bg-energie-groen" />
            <span className="flex-1 bg-actie-blauw" />
          </div>
        </div>
      </div>
    </section>
  );
}

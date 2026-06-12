import Image from "next/image";
import type { Metadata } from "next";
import { Pattern } from "@/components/pattern";
import { Countdown } from "@/components/countdown";

export const metadata: Metadata = {
  title: "Binnenkort online | WK Korfbal 2027 Bid Liemers",
  description:
    "De website van Korfbal in de Liemers is binnenkort beschikbaar.",
};

export default function HomePage() {
  return (
    <section className="relative min-h-[calc(100vh-66px)] flex items-center bg-muted/20 overflow-hidden">
      <Pattern />

      <div className="container relative z-10 flex flex-col items-center text-center py-24 gap-8">
        {/* Logo */}


        {/* Tag */}
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          In ontwikkeling
        </span>

        {/* Headline */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl font-heading">
            Binnenkort online
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Op deze website kun je alle informatie vinden over het WK Korfbal 2027 in de Liemers. We zijn druk bezig met het bouwen van de site.
            Tot snel!
          </p>
          <Countdown />
        </div>

        {/* Divider met hart */}
        <div className="flex items-center gap-4 w-full max-w-xs">
          <div className="flex-1 h-px bg-slate-200" />
          <Image
            src="/liemers_heart.svg"
            alt="Liemers hart"
            width={28}
            height={28}
            className="opacity-60"
          />
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Contact */}
        <p className="text-sm text-muted-foreground">
          Vragen?{" "}
          <a
            href="mailto:info@korfballiemers.nl"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            info@.nl
          </a>
        </p>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const buttonClass =
  "inline-flex size-11 items-center justify-center rounded-full border border-white/25 text-white transition-[color,background-color,border-color,opacity] duration-200 ease-(--ease-out-quint) hover:border-white/50 hover:bg-white/5 disabled:pointer-events-none disabled:opacity-30";

// Horizontaal scrollen met snap (swipen op mobiel), knoppen voor desktop
export function NewsSlider({ children }: { children: ReactNode }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const update = () => {
      setAtStart(list.scrollLeft <= 1);
      setAtEnd(list.scrollLeft + list.clientWidth >= list.scrollWidth - 1);
    };
    update();
    list.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      list.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({ left: direction * list.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <div className="reveal" role="region" aria-roledescription="carousel" aria-label="Laatste nieuws">
      {/* Padding + negatieve marge: ruimte voor de hover-lift van de kaarten.
          Fade rechts zolang er nog berichten volgen */}
      <ul
        ref={listRef}
        className={`${atEnd ? "" : "[mask-image:linear-gradient(to_right,black_calc(100%-6rem),transparent)]"} -my-2 flex snap-x snap-mandatory gap-6 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>li]:shrink-0 [&>li]:basis-[85%] [&>li]:snap-start md:[&>li]:basis-[calc((100%-1.5rem)/2)] lg:[&>li]:basis-[calc((100%-3rem)/3)]`}
      >
        {children}
      </ul>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" className={buttonClass} onClick={() => scroll(-1)} disabled={atStart} aria-label="Vorige berichten">
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <button type="button" className={buttonClass} onClick={() => scroll(1)} disabled={atEnd} aria-label="Volgende berichten">
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ChevronDown, RotateCcw } from "lucide-react";
import { LogoStack, toArray } from "@/components/club-logo-stack";
import { cn } from "@/lib/utils";
import type { ClubMapEntry } from "@/types/clubs-map";

const ClubMapPane = dynamic(() => import("@/components/club-map-pane"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#0A0F0E]" />,
});

function Stat({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="rounded-lg bg-white/[0.04] px-3 py-2.5">
      <dt className="text-xs text-foreground/60">{label}</dt>
      <dd className="m-0 font-heading text-base font-semibold text-white">{value}</dd>
    </div>
  );
}

interface ClubMapShowcaseProps {
  clubs: ClubMapEntry[];
  clubNames?: Record<string, string>;
}

export function ClubMapShowcase({ clubs, clubNames = {} }: ClubMapShowcaseProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [outsideRegion, setOutsideRegion] = useState(false);
  // Ophogen forceert terugvliegen, ook als er geen club geselecteerd was
  const [resetKey, setResetKey] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const selectedClub = clubs.find((club) => club.id === selectedId) ?? null;
  const showReset = selectedClub !== null || outsideRegion;

  const resetToRegion = () => {
    setSelectedId(null);
    setResetKey((key) => key + 1);
  };

  const toggle = (id: string) => setSelectedId((current) => (current === id ? null : id));
  const nameOf = (club: ClubMapEntry) => club.name ?? clubNames[club.id] ?? club.id;

  // Kaart pas laden als hij bijna in beeld komt (scheelt zware JavaScript bij het laden)
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapVisible, setMapVisible] = useState(false);
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="surface-dark grid overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-[0_32px_64px_-32px_rgb(15_26_23/0.55)] lg:h-[600px] lg:grid-cols-[380px_minmax(0,1fr)]">
      {/* Clublijst */}
      <div className="order-2 flex min-h-0 flex-col border-t border-white/10 lg:order-1 lg:border-t-0 lg:border-r">
        <p className="m-0 border-b border-white/10 px-5 py-4 text-sm text-foreground/65">
          Kies een club of klik op de kaart
        </p>
        <ul className="m-0 min-h-0 flex-1 list-none overflow-y-auto p-0">
          {clubs.map((club, index) => {
            const open = club.id === selectedId;
            const highlighted = open || club.id === hoveredId;
            const meta = [
              club.oprichtingsjaar && `Opgericht ${club.oprichtingsjaar}`
            ].filter(Boolean);

            return (
              <li
                key={club.id}
                className="reveal border-b border-white/[0.06]"
                style={{ "--i": index } as React.CSSProperties}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`club-${club.id}`}
                  onClick={() => toggle(club.id)}
                  onMouseEnter={() => setHoveredId(club.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={cn(
                    "flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                    highlighted ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
                  )}
                >
                  <LogoStack club={club} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block font-heading text-lg font-bold leading-tight transition-colors duration-200",
                        open ? "text-energie-groen-licht" : "text-white"
                      )}
                    >
                      {nameOf(club)}
                    </span>
                    {meta.length > 0 && (
                      <span className="mt-0.5 block text-sm text-foreground/60">{meta.join(" · ")}</span>
                    )}
                  </span>
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      "h-5 w-5 shrink-0 text-foreground/50 transition-transform duration-300 ease-(--ease-out-quint)",
                      open && "rotate-180 text-energie-groen-licht"
                    )}
                  />
                </button>

                {/* Uitklappen via grid-rows, zonder height te animeren */}
                <div
                  id={`club-${club.id}`}
                  inert={!open}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-500 ease-(--ease-out-quint)",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <div
                      className={cn(
                        "space-y-4 px-5 pt-1 pb-6 transition-opacity duration-300",
                        open ? "opacity-100 delay-100" : "opacity-0"
                      )}
                    >
                      <dl className="m-0 grid grid-cols-2 gap-2">
                        <Stat label="Seniorenteams" value={club.aantal_seniorenteams} />
                        <Stat label="Jeugdteams" value={club.aantal_jeugdteams} />
                        <Stat label="Veld" value={club.klasse_veld} />
                        <Stat label="Zaal" value={club.klasse_zaal} />
                      </dl>
                      {club.description && (
                        <p className="m-0 text-[15px] leading-relaxed text-foreground/75 my-4">{club.description}</p>
                      )}
                      {toArray(club.website).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {toArray(club.website).map((website) => (
                            <a
                              key={website}
                              href={website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-[border-color,background-color] duration-200 hover:border-energie-groen hover:bg-energie-groen/10 hover:text-white"
                            >
                              {new URL(website).hostname.replace(/^www\./, "")}
                              <span
                                aria-hidden
                                className="inline-block transition-transform duration-200 ease-(--ease-out-quint) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              >
                                ↗
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Kaart */}
      <div ref={mapRef} className="relative order-1 h-[400px] min-w-0 bg-[#0A0F0E] lg:order-2 lg:h-full">
        {mapVisible && (
          <ClubMapPane
            clubs={clubs}
            selectedClub={selectedClub}
            selectedId={selectedId}
            hoveredId={hoveredId}
            resetKey={resetKey}
            nameOf={nameOf}
            onToggle={toggle}
            onHover={setHoveredId}
            onOutsideChange={setOutsideRegion}
          />
        )}

        <button
          type="button"
          onClick={resetToRegion}
          tabIndex={showReset ? 0 : -1}
          aria-hidden={!showReset}
          className={cn(
            "absolute top-4 left-4 z-10 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0A0F0E]/85 px-4 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur transition-[opacity,transform] duration-300 ease-(--ease-out-quint) hover:bg-[#0A0F0E]",
            showReset ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
          )}
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Terug naar regio
        </button>
      </div>
    </div>
  );
}

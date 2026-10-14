"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, RotateCcw } from "lucide-react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MapRegion,
  useMap,
} from "@/components/ui/map";
import { cn } from "@/lib/utils";
import type { ClubMapEntry } from "@/types/clubs-map";
import regionMapData from "@/data/region-map.json";
import type { GeoJSON } from "geojson";

const LIEMERS_CENTER: [number, number] = [6.08, 51.96];
const DEFAULT_ZOOM = 10.6;
const CLUB_ZOOM = 12.6;
const NETHERLANDS_BOUNDS: [number, number, number, number] = [3.3, 50.5, 7.3, 53.7];
const MIN_ZOOM_NETHERLANDS = 5;

function toArray(value?: string | string[] | null): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

// Zonder `essential` springt MapLibre direct bij prefers-reduced-motion
function FlyToClub({ club, clubs }: { club: ClubMapEntry | null; clubs: ClubMapEntry[] }) {
  const { map } = useMap();
  const firstRun = useRef(true);

  useEffect(() => {
    if (!map) return;
    const duration = firstRun.current ? 0 : 1400;
    firstRun.current = false;

    if (club) {
      map.flyTo({ center: [club.lng, club.lat], zoom: CLUB_ZOOM, duration, curve: 1.6 });
      return;
    }

    // Overzicht: alle clubs in beeld, ook op smalle schermen
    const lngs = clubs.map((c) => c.lng);
    const lats = clubs.map((c) => c.lat);
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 70, maxZoom: DEFAULT_ZOOM + 0.4, duration }
    );
  }, [map, club, clubs]);

  return null;
}

function LogoStack({ club, size }: { club: ClubMapEntry; size: "sm" | "md" }) {
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const selectedClub = clubs.find((club) => club.id === selectedId) ?? null;

  const toggle = (id: string) => setSelectedId((current) => (current === id ? null : id));
  const nameOf = (club: ClubMapEntry) => club.name ?? clubNames[club.id] ?? club.id;

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
      <div className="relative order-1 h-[400px] min-w-0 lg:order-2 lg:h-full">
        <Map
          theme="dark"
          center={LIEMERS_CENTER}
          zoom={DEFAULT_ZOOM}
          minZoom={MIN_ZOOM_NETHERLANDS}
          maxBounds={NETHERLANDS_BOUNDS}
          scrollZoom={false}
          className="h-full w-full rounded-2xl"
        >
          <FlyToClub club={selectedClub} clubs={clubs} />
          <MapControls showZoom />
          <MapRegion
            id="liemers-region-showcase"
            data={regionMapData as unknown as GeoJSON.FeatureCollection}
            fillColor="#22B24C"
            fillOpacity={0.12}
            strokeColor="#3CCB68"
            strokeWidth={2}
            strokeOpacity={0.9}
          />
          {clubs.map((club, index) => {
            const selected = club.id === selectedId;
            const active = selected || club.id === hoveredId;

            return (
              <MapMarker
                key={club.id}
                longitude={club.lng}
                latitude={club.lat}
                onClick={() => toggle(club.id)}
                onMouseEnter={() => setHoveredId(club.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <MarkerContent>
                  <div
                    className="anim-pin relative flex flex-col items-center"
                    style={{ "--d": `${250 + index * 110}ms` } as React.CSSProperties}
                  >
                    <div
                      className={cn(
                        "relative rounded-full transition-[transform,box-shadow] duration-300 ease-(--ease-out-quint)",
                        active && "scale-110",
                        selected
                          ? "shadow-[0_0_0_3px_var(--energie-groen),0_0_0_9px_rgb(34_178_76/0.25)]"
                          : "shadow-[0_10px_24px_-8px_rgb(0_0_0/0.8)]"
                      )}
                    >
                      {selected && <span aria-hidden className="pin-pulse absolute inset-0 rounded-full" />}
                      <LogoStack club={club} size="md" />
                    </div>
                    <span
                      className={cn(
                        "pointer-events-none absolute top-full mt-2.5 whitespace-nowrap rounded-full bg-[#0A0F0E]/90 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/10 backdrop-blur transition-[opacity,transform] duration-200 ease-(--ease-out-quint)",
                        active ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
                      )}
                    >
                      {nameOf(club)}
                    </span>
                  </div>
                </MarkerContent>
              </MapMarker>
            );
          })}
        </Map>

        <button
          type="button"
          onClick={() => setSelectedId(null)}
          tabIndex={selectedClub ? 0 : -1}
          aria-hidden={!selectedClub}
          className={cn(
            "absolute top-4 left-4 z-10 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0A0F0E]/85 px-4 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur transition-[opacity,transform] duration-300 ease-(--ease-out-quint) hover:bg-[#0A0F0E]",
            selectedClub ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
          )}
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Hele regio
        </button>
      </div>
    </div>
  );
}

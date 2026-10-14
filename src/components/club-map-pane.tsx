"use client";

import { useEffect, useRef } from "react";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MapRegion,
  useMap,
} from "@/components/ui/map";
import { LogoStack } from "@/components/club-logo-stack";
import { cn } from "@/lib/utils";
import type { ClubMapEntry } from "@/types/clubs-map";
import regionMapData from "@/data/region-map.json";
import type { GeoJSON } from "geojson";

const LIEMERS_CENTER: [number, number] = [6.08, 51.96];
const DEFAULT_ZOOM = 10.6;
const CLUB_ZOOM = 12.6;
const NETHERLANDS_BOUNDS: [number, number, number, number] = [3.3, 50.5, 7.3, 53.7];
const MIN_ZOOM_NETHERLANDS = 5;
// Verder uitgezoomd dan dit telt als "buiten de regio"
const MIN_REGION_ZOOM = 9;

// Bounding box van de regio: [minLng, minLat, maxLng, maxLat]
const REGION_BOUNDS = (() => {
  const points = (regionMapData as unknown as GeoJSON.FeatureCollection<GeoJSON.Polygon>).features.flatMap(
    (feature) => feature.geometry.coordinates.flat()
  );
  const lngs = points.map(([lng]) => lng);
  const lats = points.map(([, lat]) => lat);
  return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)] as const;
})();

// Meldt of het kaartmidden buiten de regio ligt, of er ver is uitgezoomd
function RegionWatcher({ onChange }: { onChange: (outside: boolean) => void }) {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;
    const check = () => {
      const { lng, lat } = map.getCenter();
      const [minLng, minLat, maxLng, maxLat] = REGION_BOUNDS;
      const centerOutside = lng < minLng || lng > maxLng || lat < minLat || lat > maxLat;
      onChange(centerOutside || map.getZoom() < MIN_REGION_ZOOM);
    };
    map.on("moveend", check);
    return () => {
      map.off("moveend", check);
    };
  }, [map, onChange]);

  return null;
}

// Zonder `essential` springt MapLibre direct bij prefers-reduced-motion
function FlyToClub({
  club,
  clubs,
  resetKey,
}: {
  club: ClubMapEntry | null;
  clubs: ClubMapEntry[];
  resetKey: number;
}) {
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
  }, [map, club, clubs, resetKey]);

  return null;
}

interface ClubMapPaneProps {
  clubs: ClubMapEntry[];
  selectedClub: ClubMapEntry | null;
  selectedId: string | null;
  hoveredId: string | null;
  resetKey: number;
  nameOf: (club: ClubMapEntry) => string;
  onToggle: (id: string) => void;
  onHover: (id: string | null) => void;
  onOutsideChange: (outside: boolean) => void;
}

// Los bestand zodat MapLibre pas laadt als de kaart bijna in beeld is
export default function ClubMapPane({
  clubs,
  selectedClub,
  selectedId,
  hoveredId,
  resetKey,
  nameOf,
  onToggle,
  onHover,
  onOutsideChange,
}: ClubMapPaneProps) {
  return (
    <Map
      theme="dark"
      center={LIEMERS_CENTER}
      zoom={DEFAULT_ZOOM}
      minZoom={MIN_ZOOM_NETHERLANDS}
      maxBounds={NETHERLANDS_BOUNDS}
      scrollZoom={false}
      className="h-full w-full rounded-2xl"
    >
      <FlyToClub club={selectedClub} clubs={clubs} resetKey={resetKey} />
      <RegionWatcher onChange={onOutsideChange} />
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
            onClick={() => onToggle(club.id)}
            onMouseEnter={() => onHover(club.id)}
            onMouseLeave={() => onHover(null)}
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
  );
}

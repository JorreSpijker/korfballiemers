"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MapRegion,
} from "@/components/ui/map";
import { Card } from "@/components/ui/card";
import type { ClubMapEntry } from "@/types/clubs-map";
import regionMapData from "@/data/region-map.json";
import type { GeoJSON } from "geojson";

const LIEMERS_CENTER: [number, number] = [6.08, 51.93];
const DEFAULT_ZOOM = 10;
const NETHERLANDS_BOUNDS: [number, number, number, number] = [3.3, 50.5, 7.3, 53.7];
const MIN_ZOOM_NETHERLANDS = 5;

interface ClubMapProps {
  clubs: ClubMapEntry[];
  clubNames?: Record<string, string>;
}

function ClubSidebar({
  club,
  clubNames,
}: {
  club: ClubMapEntry;
  clubNames: Record<string, string>;
}) {
  const name = club.name ?? clubNames[club.id] ?? club.id;

  return (
    <div className="p-5 space-y-4 flex flex-col h-full">
      <div className="flex items-center gap-3">
        {club.logo && (
          <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted shrink-0">
            <Image
              src={club.logo}
              alt={`${name} logo`}
              fill
              className="object-contain p-1"
            />
          </div>
        )}
        <h2 className="font-heading font-semibold text-lg leading-tight">{name}</h2>
      </div>

      <div className="space-y-2 text-sm">
        {club.oprichtingsjaar && (
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Opgericht</span>
            <span className="font-medium">{club.oprichtingsjaar}</span>
          </div>
        )}
        {club.aantal_leden !== undefined && (
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">
              Leden
              {club.leden_datum && (
                <span className="text-xs"> ({club.leden_datum})</span>
              )}
            </span>
            <span className="font-medium">{club.aantal_leden}</span>
          </div>
        )}
        {club.klasse_veld && (
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Veld</span>
            <span className="font-medium">{club.klasse_veld}</span>
          </div>
        )}
        {club.klasse_zaal && (
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Zaal</span>
            <span className="font-medium">{club.klasse_zaal}</span>
          </div>
        )}
      </div>
      {club.description && (
      <div className="border-t pt-4">
          <p className="text-sm text-slate-600">{club.description}</p>
      </div>
        )}

      {club.website && (
        <a
          href={club.website}
          target="_blank"
          rel="noopener noreferrer"
          className="btn mt-auto"
        >
          Bezoek website →
        </a>
      )}
    </div>
  );
}

export function ClubMap({ clubs, clubNames = {} }: ClubMapProps) {
  const [selectedClub, setSelectedClub] = useState<ClubMapEntry | null>(null);

  return (
    <Card className="h-full w-full overflow-hidden rounded-none p-0 flex md:flex-row gap-0 border-1">
      <div className="flex-1 min-w-0">
        <Map
          center={LIEMERS_CENTER}
          zoom={DEFAULT_ZOOM}
          className="h-full w-full min-h-[300px]"
          minZoom={MIN_ZOOM_NETHERLANDS}
          maxBounds={NETHERLANDS_BOUNDS}
        >
          <MapControls showZoom />
          <MapRegion
            data={regionMapData as unknown as GeoJSON.FeatureCollection}
            fillColor="#801007"
            fillOpacity={0.15}
          />
          {clubs.map((club) => (
            <MapMarker
              key={club.id}
              longitude={club.lng}
              latitude={club.lat}
              onClick={() => setSelectedClub(club)}
            >
              <MarkerContent />
            </MapMarker>
          ))}
        </Map>
      </div>

      <div className="w-full md:w-72 shrink-0 border-t md:border-l md:border-t-0 bg-background overflow-y-auto">
        {selectedClub ? (
          <ClubSidebar club={selectedClub} clubNames={clubNames} />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
            Klik op een club op de kaart voor meer informatie
          </div>
        )}
      </div>
    </Card>
  );
}

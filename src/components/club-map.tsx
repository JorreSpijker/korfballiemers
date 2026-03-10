"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MapRegion,
} from "@/components/ui/map";
import { Card } from "@/components/ui/card";
import type { ClubMapEntry } from "@/types/clubs-map";
import regionMapData from "@/data/region-map.json";
import type { GeoJSON } from "geojson";

// Liemers centrum (ongeveer Zevenaar): 51.93, 6.08
const LIEMERS_CENTER: [number, number] = [6.08, 51.93];
const DEFAULT_ZOOM = 10;

interface ClubMapProps {
  clubs: ClubMapEntry[];
  clubNames?: Record<string, string>;
}

export function ClubMap({ clubs, clubNames = {} }: ClubMapProps) {
  return (
    <Card className={`h-full w-full overflow-hidden rounded-none p-0`}>
      <Map
        center={LIEMERS_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full min-h-[300px]"
      >
        <MapControls showZoom />
        <MapRegion
          data={regionMapData as unknown as GeoJSON.FeatureCollection}
          fillColor="#FF6600"
          fillOpacity={0.15}
        />
        {clubs.map((club) => (
          <MapMarker
            key={club.id}
            longitude={club.lng}
            latitude={club.lat}
          >
            <MarkerContent />
            <MarkerPopup closeButton>
              <div className="space-y-2 min-w-[200px] max-w-[280px]">
                <div className="flex items-center gap-3">
                  {club.logo && (
                    <div className="relative h-10 w-10 overflow-hidden rounded-md border border-border bg-background shrink-0">
                      <Image
                        src={club.logo}
                        alt={`${club.name ?? clubNames[club.id] ?? club.id} logo`}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-base">
                    {club.name ?? clubNames[club.id] ?? club.id}
                  </h3>
                </div>
                
                <div className="space-y-1 text-sm">
                  {club.oprichtingsjaar && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Opgericht:</span> {club.oprichtingsjaar}
                    </p>
                  )}
                  
                  {club.aantal_leden !== undefined && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Leden:</span> {club.aantal_leden}
                      {club.leden_datum && (
                        <span className="text-xs"> (peildatum: {club.leden_datum})</span>
                      )}
                    </p>
                  )}
                  
                  {club.klasse_veld && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Veld:</span> {club.klasse_veld}
                    </p>
                  )}
                  
                  {club.klasse_zaal && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Zaal:</span> {club.klasse_zaal}
                    </p>
                  )}
                  
                  {club.website && (
                    <p className="pt-1">
                      <a
                        href={club.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        Bezoek website →
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </Card>
  );
}

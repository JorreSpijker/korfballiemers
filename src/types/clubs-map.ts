export interface ClubMapEntry {
  id: string;
  name?: string;
  logo?: string;
  lat: number;
  lng: number;
  oprichtingsjaar?: number | null;
  aantal_leden?: number;
  leden_datum?: string;
  klasse_veld?: string;
  klasse_zaal?: string;
  website?: string | null;
}

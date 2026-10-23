export interface ClubMapEntry {
  id: string;
  name?: string;
  logo?: string | string[];
  lat: number;
  lng: number;
  oprichtingsjaar?: number | null;
  aantal_leden?: number;
  leden_datum?: string;
  aantal_seniorenteams?: number;
  aantal_jeugdteams?: number;
  klasse_veld?: string;
  klasse_zaal?: string;
  website?: string | string[] | null;
  description?: string | null;
}

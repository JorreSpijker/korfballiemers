# Bouwplan website WK Korfbal 2027 Bid (Liemers)

## Doel
Een snelle, goed onderhoudbare website bouwen voor de bid rondom WK Korfbal 2027 in de Liemers, met content in Markdown en een interactieve clubkaart met MapLibre via shadcn-map.

## Technische stack
- Next.js (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- shadcn-map (MapLibre)
- Markdown content met frontmatter
- JSON voor kaartcoordinaten

## Navigatie
- Home
- Nieuws
- Clubs
- Vrijwilligers
- Sponsor worden
- Contact

## Informatie-architectuur

### Markdown content
- `content/pages/home.md`
- `content/pages/vrijwilligers.md`
- `content/pages/sponsor-worden.md`
- `content/pages/contact.md`
- `content/nieuws/*.md`
- `content/clubs/*.md`

### JSON kaartdata
- `src/data/clubs-map.json`

## Datamodel

### Clubs Markdown frontmatter
Aanbevolen velden:
- `id`
- `name`
- `city`
- `address`
- `website`
- `logo`
- `excerpt`

### Kaart JSON velden
Per entry:
- `id`
- `lat`
- `lng`
- `oprichtingsjaar`
- `aantal_leden`
- `klasse`

Koppeling tussen content en map gaat via `id`.

Voorbeeld:
```json
{
  "id": "wesstar",
  "lat": 51.93,
  "lng": 6.08,
  "oprichtingsjaar": 1967,
  "aantal_leden": 185,
  "klasse": "Overgangsklasse"
}
```

## Faseplan

## Fase 1: Project setup
- Next.js project initialiseren met TypeScript en TailwindCSS.
- shadcn/ui configureren.
- Basislayout toevoegen (header/footer).
- Navigatie volgens afgesproken structuur implementeren.

## Fase 2: Contentlaag (Markdown)
- Contentmappen en basisbestanden aanmaken.
- Markdown loader bouwen (`gray-matter` + markdown parser).
- Utility functies maken:
  - `getPageContent(slug)`
  - `getAllNewsPosts()`
  - `getAllClubs()`

## Fase 3: Pagina’s
- Home pagina renderen uit `home.md`.
- Nieuws overzicht + detailpagina uit `content/nieuws`.
- Vrijwilligers, Sponsor worden en Contact uit markdown paginafiles.
- Clubs overzicht vanuit `content/clubs`.

## Fase 4: MapLibre kaart (shadcn-map)
- `ClubMap` component maken met shadcn-map.
- `clubs-map.json` inladen en markers tonen.
- Per marker popup met clubnaam + link naar clubdetail.
- Startweergave centreren op Liemers.

## Fase 5: Koppeling clubs + map
- Clubdata uit markdown combineren met coordinaten uit JSON op `id`.
- Clubs pagina met lijst + kaart naast/onder elkaar (responsive).
- Klik op club in lijst focust marker op kaart (optioneel als iteratie 2).

## Fase 6: UX, toegankelijkheid en kwaliteit
- Mobielvriendelijke layout en leesbare typografie.
- Toegankelijkheid: semantische headings, focus states, alt-teksten.
- Fallbacks bij ontbrekende content of coordinaten.
- Lint/build checks en basis smoke test.

## Oplevering
- Werkende website met alle afgesproken navigatie-items.
- Beheerbare content via Markdown bestanden.
- Interactieve clubkaart via shadcn-map/MapLibre met JSON databron.
- Duidelijke structuur voor toekomstige uitbreiding (meer clubs/nieuws/pagina’s).

## Vervolgstappen na eerste release
- Zoek/filter in Nieuws en Clubs.
- Meertaligheid (NL/EN).
- CMS-koppeling op termijn (optioneel) met behoud van markdown workflow.
- Formulierkoppelingen voor Vrijwilligers en Sponsor worden.

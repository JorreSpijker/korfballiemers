# Website structuur WK Korfbal 2027 Bid (Liemers)

## Navigatie
- Home
- Nieuws
- Clubs
- Vrijwilligers
- Sponsor worden
- Contact

## Contentstructuur (Markdown)
- `content/pages/home.md`
- `content/pages/vrijwilligers.md`
- `content/pages/sponsor-worden.md`
- `content/pages/contact.md`
- `content/nieuws/*.md`
- `content/clubs/*.md`

## Kaartdata (JSON)
- `src/data/clubs-map.json`
- Velden per entry:
  - `id`
  - `lat`
  - `lng`
  - `oprichtingsjaar`
  - `aantal_leden`
  - `klasse`

## Aanbevolen routes (Next.js)
- `/`
- `/nieuws`
- `/clubs`
- `/vrijwilligers`
- `/sponsor-worden`
- `/contact`

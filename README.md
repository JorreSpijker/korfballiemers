# WK Korfbal 2027 Bid – Liemers

Website voor het bid van de regio Liemers om het Wereldkampioenschap Korfbal 2027 te organiseren.

## Technische stack

- **Next.js** (App Router)
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui**
- **Mapcn** (MapLibre)

## Ontwikkeling

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

Content staat in Markdown met frontmatter:

- `content/pages/` – statische pagina’s (home, vrijwilligers, sponsor-worden, contact)
- `content/nieuws/` – nieuwsberichten
- `content/clubs/` – clubpagina’s

Kaartdata staat in `src/data/clubs-map.json`. Koppeling met clubs gaat via `id`.

## Routes

- `/` – Home
- `/nieuws` – Nieuws overzicht
- `/nieuws/[slug]` – Nieuwsdetail
- `/clubs` – Clubs overzicht + kaart
- `/clubs/[slug]` – Clubdetail
- `/vrijwilligers` – Vrijwilligers
- `/sponsor-worden` – Sponsor worden
- `/contact` – Contact

## Build

```bash
npm run build
npm start
```

## Lint

```bash
npm run lint
```

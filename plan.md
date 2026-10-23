# Plan: animaties en transities

Doel: moderner en speelser, maar beheerst (zie PRODUCT.md). Geen libraries; alleen CSS en een paar classes.

## Uitgangspunten
- Alle beweging staat binnen `@media (prefers-reduced-motion: no-preference)`. Zonder die voorkeur is er geen animatie en is alle content gewoon zichtbaar.
- Scroll-reveals via CSS scroll-driven animations (`animation-timeline: view()`) binnen `@supports`. Browsers zonder support tonen alles direct: content is nooit afhankelijk van JS of van een animatie.
- Easing: ease-out-quint/expo. Geen bounce. Feedback 150–250ms, entrances 500–800ms.
- Alleen lijsten krijgen een stagger (nieuws, sponsors). Geen identieke fade-up op elke sectie.

## Lagen
1. **Signature (hero, bij het laden)**: kopregels schuiven per regel omhoog uit een masker, intro en CTA's volgen. Foto onthult met een clip-path-wipe en een zoom van 1.06 naar 1. Groen-blauwe streep groeit van links. Topstreep in de layout groeit mee.
2. **Header**: krijgt bij scrollen een rand en schaduw (scroll-timeline, geen JS). De navigatie-pills hadden al een kleurtransitie en zijn niet aangepast.
3. **Scroll-reveals**: nieuwskaarten en sponsortegels staggeren in beeld. De tweekleurige accentbalk in de WK-sectie groeit als hij in beeld komt.
4. **Micro-interacties**: knoppen met indrukeffect (scale 0.97); de pijl in "Lees bericht →" en "Sponsor worden →" schuift bij hover. Nieuwskaart: foto zoomt licht in, kaart tilt met schaduw. Sponsortegels tillen op en het logo krijgt kleur.
5. **Nieuwsdetail**: kop staggert binnen, de afbeelding schuift omhoog in beeld.

## Bestanden
- `src/app/globals.css`: easing-tokens, keyframes, utility-classes (`.anim-*`, `.reveal`).
- `src/app/layout.tsx`, `src/components/hero.tsx`, `header.tsx`, `news-feed.tsx`, `sponsor-logo-bar.tsx`, `src/app/page.tsx`, `src/app/nieuws/[slug]/page.tsx`: classes toevoegen.

## Verificatie
- `tsc` en `eslint` schoon.
- In de browser: animaties bij laden en scroll, en met reduced motion (devtools-emulatie) alles statisch en zichtbaar.
- Firefox (geen scroll-timeline): alles direct zichtbaar.

## Buiten scope / later
- Paginatransities (React `<ViewTransition>`, experimental in Next 16).
- De gradient-tekst op "Liemers" in de hero botst met de impeccable-richtlijnen. Niet aangepast, wel genoteerd.

---

# Plan: contactformulier

Eigen sectie onderaan de homepage (`#contact`, na sponsors). Ontvanger: liemerscitykorfbal@gmail.com. Hosting: Vercel.

## Aanpak
- **Server Action** `src/app/actions/contact.ts`: valideert naam, e-mail en bericht, controleert het reCAPTCHA-token bij Google (`siteverify`) en verstuurt de mail via de Resend REST API (`fetch`, geen extra dependency). `replyTo` = afzender.
- **reCAPTCHA v2** (vinkje "Ik ben geen robot"), expliciet gerenderd. De server controleert `g-recaptcha-response` via `siteverify`; na elke inzending volgt een reset. (Eerst v3, later op verzoek omgezet naar v2.)
- **Client-component** `src/components/contact-section.tsx` met `useActionState`: verzendstatus, foutmelding per veld (`aria-invalid`/`aria-describedby`), bevestiging in `role="status"`. Ingevulde waarden blijven staan bij een fout.
- In `src/app/page.tsx` vervangt deze sectie het uitgecommentarieerde oude formulier.
- **Onderwerp-select** (Algemene vraag, Sponsor worden, Vrijwilliger worden), gedeeld via `src/lib/contact-subjects.ts`. Links met `data-onderwerp` (de knoppen "Sponsor worden") gaan naar `#contact` en zetten het onderwerp vooraf. De server valideert het onderwerp; het staat in de onderwerpregel en de tekst van de mail.

## Environment variables (Vercel + lokaal, zelf instellen)
- `RESEND_API_KEY`
- `RECAPTCHA_SECRET_KEY`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

## Let op
- Zonder geverifieerd domein in Resend kan alleen vanaf `onboarding@resend.dev` gemaild worden, en alleen naar het e-mailadres van het Resend-account. Maak het Resend-account dus aan met liemerscitykorfbal@gmail.com, of verifieer een domein en pas `FROM` aan.
- reCAPTCHA v2-sleutels (selectievakje) aanmaken op https://www.google.com/recaptcha/admin. Domeinen: het productiedomein, `localhost` en het Vercel-previewdomein.

## Verificatie
- `tsc` en `eslint` schoon; `next build` slaagt.
- Lokaal met keys: lege velden geven fouten per veld, een geldige inzending komt aan in de inbox, en een fout token geeft een nette melding.

---

# Plan: extra transities

1. **Glijdende menu-indicator** (desktop): één absolute pill in de hoofdnavigatie schuift (`transform` + `width`, 300ms ease-out-quint) naar de actieve link. Positie gemeten via `ref`; een `ResizeObserver` meet opnieuw na font-load of resize. Mobiel menu blijft zoals het is.
2. **Sectiekoppen**: h2's van WK, Clubs, Nieuws, Sponsors en Contact onthullen met een clip-path-wipe van links, gekoppeld aan scroll (`animation-timeline: view()`). Zonder support of met reduced motion: direct zichtbaar.
3. **Kaart**: clubpins vallen gespreid in na het laden van de kaart, schalen bij hover, en de geselecteerde club krijgt een blauwe ring. De zijbalk met clubinfo komt bij elke wissel opnieuw binnen.
4. **Footer**: het logovlak tilt bij hover; de pijl bij "Terug naar boven" schuift omhoog.

Verificatie: `tsc`, `eslint`, `next build`.

---

# Plan: kaart variant 2 (ter vergelijking, onder de huidige)

Nieuw component `src/components/club-map-showcase.tsx`, nieuwe sectie in `page.tsx` direct onder "Clubs in de Liemers". Het origineel blijft ongewijzigd.

- **Donkere sectie** met `Pattern`, kop en korte intro. Kaart en clublijst samen in één afgerond paneel.
- **Donkere kaart** (Carto dark-matter). Regio in energie-groen met lichtgroene rand. Scroll-zoom uit (de pagina scrollt niet meer per ongeluk de kaart in), zoomknoppen blijven.
- **Clublijst links** (op mobiel onder de kaart): per club logo's, naam, oprichtingsjaar en leden. Klik opent een accordeon met teams, klasse veld/zaal, beschrijving en website(s). Ingeklapte inhoud is `inert`.
- **Kaart en lijst gekoppeld**: hover op een rij laat de pin oplichten en andersom. Selecteren laat de kaart naar de club vliegen (`flyTo`; MapLibre springt direct bij reduced motion). De knop "Hele regio" zoomt terug.
- **Pins**: logo-cirkels met een naamlabel bij hover of selectie, een groene ring en pulserende halo bij de geselecteerde club. Ze vallen gespreid binnen.

Verificatie: `tsc`, `eslint`, `next build`.

---

# Plan: sponsors uit JSON + responsive-ronde

## Sponsors
- `src/data/sponsors.json`: lege array `[]`. Velden per sponsor: `name`, `logo`.
- `sponsor-logo-bar.tsx` leest de JSON. Bij 0 sponsors: kop en intro met alleen de knop "Sponsor worden". Bij sponsors: het bestaande raster.
- De placeholder-SVG's in `public/sponsors/` worden dan niet meer gebruikt (niet verwijderd, wel gemeld).

## Responsive-ronde
- Headless Chrome-screenshots op 375, 768, 1024 en 1440px van de homepage en een nieuwsbericht.
- Problemen per breedte opsporen (overflow, krappe padding, te grote koppen, tap-targets) en gericht oplossen.
- Na de fixes opnieuw screenshots maken ter controle.

---

# Plan: SEO

Live: https://liemerscitykorfbal.nl (branch `main`). Test: https://korfballiemers.vercel.app (branch `development`).

## Techniek
1. `src/lib/site.ts`: `SITE_URL`, naam en een vlag voor previews (`VERCEL_ENV === "preview"`).
2. `layout.tsx`: `metadataBase`, `title.template`, standaard-description, Open Graph en Twitter, `noindex` op previews.
3. `app/robots.ts` (previews: alles disallow; live: allow, `/api/` uitgesloten, sitemap-link) en `app/sitemap.ts` met alle pagina's en nieuwsberichten.
4. `app/opengraph-image.tsx`: gegenereerde deelafbeelding in huisstijl (1200×630). Nieuwsberichten gebruiken hun eigen afbeelding.
5. Canonical URL per pagina.
6. JSON-LD (`src/components/json-ld.tsx`): `Organization` en `SportsEvent` (15–17 oktober 2027, Sportcentrum Triominos, Duiven) op home en de WK-pagina; `NewsArticle` op nieuwsberichten.
7. `NewsFeed` wordt een servercomponent: nieuws staat in de HTML.
8. De kaart (MapLibre) laadt pas als hij bijna in beeld is; de clublijst blijft server-gerenderd.

## Inhoud
9. Title en description van home bijgewerkt (hostregio in plaats van bid). De hero-h1 krijgt "WK Korfbal 2027 in de Liemers" als eerste regel.
10. Nieuwe pagina's, met tekst als markdown in `content/`:
   - `/wk-korfbal-2027`: het WK in de Liemers, data, Triominos en links naar de speelsteden.
   - `/wk-korfbal-2027/{doesburg,duiven,westervoort,zevenaar}`: per gemeente de club(s), de rol in het WK en een oproep tot actie.
   - `/nieuws`: overzicht van alle berichten.
   - `/vrijwilliger-worden` en `/sponsor-worden`: korte uitleg en een link naar het formulier met het juiste onderwerp.
11. Het contactformulier leest `?onderwerp=` uit de URL, zodat links vanaf andere pagina's het onderwerp vooraf kunnen zetten.
12. Interne links: in de footer een kolom "Ontdek", een link vanuit de WK-sectie en "Bekijk alles" bij het nieuws.

## Alleen met feiten
Alle tekst is gebaseerd op bestaande content (nieuws, clubdata). Wat niet bekend is (programma, wedstrijden, kaartverkoop) wordt niet verzonnen.

## Zelf regelen
Search Console en Bing, de sitemap indienen, backlinks (KNKV, gemeenten, clubs, Triominos, lokale media), en controleren dat `main` als Production deployt.

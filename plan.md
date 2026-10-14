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

Eigen sectie onderaan de homepage (`#contact`, na sponsors). Ontvanger: dcaderiusvanveen@gmail.com. Hosting: Vercel.

## Aanpak
- **Server Action** `src/app/actions/contact.ts`: valideert naam, e-mail en bericht, controleert het reCAPTCHA-token bij Google (`siteverify`) en verstuurt de mail via de Resend REST API (`fetch`, geen extra dependency). `replyTo` = afzender.
- **reCAPTCHA v3** (onzichtbaar, score-based): het token wordt bij het verzenden opgehaald met `grecaptcha.execute(..., { action: "contact" })`. De server accepteert alleen `success`, action `contact` en score ≥ 0.5. De badge is verborgen; de verplichte Google-tekst staat onder het formulier.
- **Client-component** `src/components/contact-section.tsx` met `useActionState`: verzendstatus, foutmelding per veld (`aria-invalid`/`aria-describedby`), bevestiging in `role="status"`. Ingevulde waarden blijven staan bij een fout.
- In `src/app/page.tsx` vervangt deze sectie het uitgecommentarieerde oude formulier.

## Environment variables (Vercel + lokaal, zelf instellen)
- `RESEND_API_KEY`
- `RECAPTCHA_SECRET_KEY`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

## Let op
- Zonder geverifieerd domein in Resend kan alleen vanaf `onboarding@resend.dev` gemaild worden, en alleen naar het e-mailadres van het Resend-account. Maak het Resend-account dus aan met dcaderiusvanveen@gmail.com, of verifieer een domein en pas `FROM` aan.
- reCAPTCHA v3-sleutels aanmaken op https://www.google.com/recaptcha/admin. Domeinen: het productiedomein, `localhost` en het Vercel-previewdomein.

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

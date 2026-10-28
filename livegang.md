# Livegang

Live: https://liemerscitykorfbal.nl (branch `main`, Vercel Production)
Test: https://korfballiemers.vercel.app (branch `development`, Vercel Preview)

## 1. Vóór de merge (op de testomgeving)

- [x] `korfballiemers.vercel.app/robots.txt` toont `Disallow: /` (testomgeving wordt niet geïndexeerd)
- [ ] Teksten van de speelsteden nalezen: `content/speelsteden/*.md`
- [ ] Teksten van `content/pages/wk-korfbal-2027.md`, `vrijwilliger-worden.md` en `sponsor-worden.md` nalezen
- [ ] Bevestigen dat Sportcentrum Triominos (Eltensestraat 4, Duiven) de WK-speellocatie is. Zo niet: `WK_VENUE` in `src/lib/site.ts` aanpassen
- [ ] Contactformulier testen op de testomgeving (reCAPTCHA aanvinken, mail komt aan bij liemerscitykorfbal@gmail.com)
- [ ] Toestemming van de clubs voor de foto's in `public/photos/` (portretrecht, zeker bij jeugdspelers)
- [ ] Privacyverklaring op de site: het contactformulier verwerkt naam/e-mail en gebruikt Google reCAPTCHA. Link in de footer en bij het formulier

## 2. Vercel (Production)

- [ ] Settings → Environment Variables: deze drie staan aan voor **Production**:
  - `RESEND_API_KEY`
  - `RECAPTCHA_SECRET_KEY`
  - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
  - `GOOGLE_SHEET_WEBHOOK_URL` (vriendenformulier, zie 3b)
- [ ] `main` deployt als **Production** (Settings → Git → Production Branch = `main`)
- [ ] Settings → Domains: `liemerscitykorfbal.nl` en `www.liemerscitykorfbal.nl` toegevoegd, `www` redirect naar het hoofddomein

## 2b. Domein (DNS bij de registrar)

- [ ] A-record `@` → het IP dat Vercel toont (Settings → Domains)
- [ ] CNAME `www` → het adres dat Vercel toont
- [ ] Bestaande MX-records niet weggooien als er mail op het domein draait
- [ ] Vercel toont het domein als **Valid Configuration** en het SSL-certificaat is actief (https werkt zonder waarschuwing)

## 3. Externe diensten

- [ ] reCAPTCHA-admin (https://www.google.com/recaptcha/admin): domein `liemerscitykorfbal.nl` toegevoegd aan de v2-sleutel
- [ ] Resend-account aangemaakt met liemerscitykorfbal@gmail.com (zonder geverifieerd domein mailt Resend alleen naar het account-adres)

## 3b. Vrienden van LiemersCity Korfbal

- [ ] QR-codes van de Rabobank-betaalverzoeken staan in `public/vrienden-qr-20.png` en `public/vrienden-qr-50.png`
- [ ] Bedragen en betaallinks staan in `VRIENDEN_OPTIONS` in `src/lib/vrienden.ts`
- [ ] Google Sheet aanmaken met liemerscitykorfbal@gmail.com, rij 1: `Datum | Naam | E-mail | Telefoon | Bedrag | Betaald`
- [ ] In de Sheet: Extensies → Apps Script, deze code plakken en opslaan:

  ```js
  function doPost(e) {
    const data = JSON.parse(e.postData.contents);
    SpreadsheetApp.getActiveSheet().appendRow([
      new Date(data.datum), data.naam, data.email, data.telefoon, Number(data.bedrag),
    ]);
    return ContentService.createTextOutput("ok");
  }
  ```

- [ ] Implementeren → Nieuwe implementatie → Type: Web-app, Uitvoeren als: ik, Toegang: Iedereen. De web-app-URL is `GOOGLE_SHEET_WEBHOOK_URL` (in Vercel en `.env.local`)
- [ ] Betalingen met de hand afvinken in de kolom `Betaald` (de site weet niet of er betaald is)

## 4. Merge en deploy

- [ ] `development` mergen naar `main` en pushen
- [ ] Production-deploy in Vercel is geslaagd

## 5. Na de livegang

- [ ] `https://liemerscitykorfbal.nl/robots.txt` toont `Allow: /` en `Sitemap: https://liemerscitykorfbal.nl/sitemap.xml`
- [ ] `https://liemerscitykorfbal.nl/sitemap.xml` toont alle pagina's
- [ ] Contactformulier op live getest. Bij problemen: Vercel → Logs, zoek op `reCAPTCHA fout` of `Resend fout`
- [ ] Deelafbeelding gecontroleerd, bijvoorbeeld een link in WhatsApp plakken of https://www.opengraph.xyz gebruiken
- [ ] Structured data gecontroleerd met https://search.google.com/test/rich-results (home, `/wk-korfbal-2027` en een nieuwsbericht)

## 6. Vindbaarheid (doorlopend)

- [ ] Google Search Console: domein `liemerscitykorfbal.nl` toevoegen en verifiëren, sitemap indienen
- [ ] Bing Webmaster Tools: site toevoegen (kan via import uit Search Console), sitemap indienen
- [ ] Backlinks vragen bij:
  - KNKV (pagina WK Korfbal 2027)
  - Gemeenten Doesburg, Duiven, Westervoort en Zevenaar
  - Clubsites: Duko, Wesstar, KV Rivalen, KV de Zwaluwen
  - Sportcentrum Triominos
  - Lokale media (De Gelderlander, Liemers Nieuws)
- [ ] Regelmatig nieuws plaatsen met plaatsnamen erin

## Opruimen (optioneel)

Niet meer in gebruik, niet verwijderd:
- `src/app/api/nieuws/route.ts` (nieuws wordt server-side gerenderd)
- `src/components/club-map.tsx` (vervangen door `club-map-showcase.tsx`)
- `public/club-logos/logo-triominos.svg` (vervangen door `triominos-locatie.svg`)
- `public/sponsors/sponsor-1…6.svg` (sponsors komen uit `src/data/sponsors.json`)
- Dummy-content in `content/pages/`: `contact.md`, `over.md`, `prose.md`, `sponsoren.md`, `vrijwilligers.md`, `wk2027.md`

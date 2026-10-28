import { getPageContent, getAllClubs } from "@/lib/content";
import { Hero } from "@/components/hero";
import { ClubMapShowcase } from "@/components/club-map-showcase";
import { NewsFeed } from "@/components/news-feed";
import { SponsorLogoBar } from "@/components/sponsor-logo-bar";
import { PhotoBook } from "@/components/photo-book";
import { ContentSection } from "@/components/content-section";
import { ContactSection } from "@/components/contact-section";
import { Button } from "@/components/ui/button";
import clubsMapData from "@/data/clubs-map.json";
import type { ClubMapEntry } from "@/types/clubs-map";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, wkEventSchema } from "@/lib/structured-data";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: { absolute: "LiemersCity Korfbal | Hostregio WK Korfbal 2027 in de Liemers" },
  description:
    "De Liemers (Doesburg, Duiven, Westervoort en Zevenaar) is hostregio van het WK Korfbal 2027. Van 15 t/m 17 oktober 2027 speelt de wereldtop hier.",
  alternates: { canonical: "/" },
};

function Prose({ html }: { html: string }) {
  return (
    <div
      className="prose prose-neutral max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default async function HomePage() {
  const page = await getPageContent("home");
  const [over, vrijwilligers, sponsoren, contact] = await Promise.all(
    ["over", "vrijwilligers", "sponsoren", "contact"].map(getPageContent)
  );
  const clubs = await getAllClubs();
  const mapClubs = clubsMapData as ClubMapEntry[];
  const clubNames = Object.fromEntries(
    clubs.map((c) => [c.frontmatter.id ?? c.slug, c.frontmatter.name ?? c.slug])
  );

  if (!page) {
    return (
      <div className="container px-4 py-12">
        <p>Pagina niet gevonden.</p>
      </div>
    );
  }

  // Eerste alinea in de hero, de rest in de WK-sectie
  const introEnd = page.content.indexOf("</p>") + "</p>".length;
  const introHtml = page.content.slice(0, introEnd);
  const wkHtml = page.content.slice(introEnd);

  return (
    <>
      <JsonLd data={[organizationSchema, wkEventSchema]} />

      {/* Hero Section */}
      <Hero
        introHtml={introHtml}
        id="intro"
      />

      {/* WK 2027 */}
      <section id="wk2027" className="surface-light bg-white">
        <div className="container flex flex-wrap gap-8 py-16 sm:gap-14 sm:py-22">
          <div className="min-w-0 flex-[1_1_340px]">
            <h2 className="reveal-heading font-heading m-0 text-4xl font-bold leading-[1.08] sm:text-[40px]">
              Een impuls voor korfbal in onze regio
            </h2>
            <div className="reveal-grow mt-6 flex h-1 w-24" aria-hidden>
              <span className="flex-1 bg-energie-groen" />
              <span className="flex-1 bg-actie-blauw" />
            </div>
          </div>
          <div className="flex min-w-0 flex-[1.4_1_480px] flex-col gap-6">
            <div
              className="flex flex-col gap-[18px] text-lg [&_p]:m-0"
              dangerouslySetInnerHTML={{ __html: wkHtml }}
            />
            <Link
              href="/wk-korfbal-2027"
              className="group inline-flex items-center gap-2 self-start font-bold text-actie-blauw hover:text-actie-blauw"
            >
              Alles over het WK Korfbal 2027 in de Liemers
              <span aria-hidden className="inline-block transition-transform duration-200 ease-(--ease-out-quint) group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Kaart sectie */}
      <section id="over" className="surface-light relative overflow-hidden py-16 bg-[#EEF2EF] sm:py-24">
        <div className="container">
          <p className="mb-2.5 text-[13px] font-bold uppercase tracking-[0.14em] text-energie-groen-donker">
            Wie zijn wij
          </p>
          <h2 className="reveal-heading font-heading mb-8 text-4xl font-bold leading-[1.05] sm:text-[44px]">Clubs in de Liemers</h2>
          <div className="relative w-full overflow-hidden">
            <ClubMapShowcase clubs={mapClubs} clubNames={clubNames} />
            <Image
              src="/icon.svg"
              alt=""
              width={210}
              height={210}
              aria-hidden
              className="pointer-events-none absolute -right-14 top-3 z-10 opacity-[0.7]"
            />
          </div>
        </div>
      </section>

      <NewsFeed
        id="nieuws"
        limit={6}
        title="Laatste nieuws"
        slider
      />

      <SponsorLogoBar id="sponsors" />

      <PhotoBook id="fotos" />

      {/* Vrienden */}
      <section id="vrienden" className="surface-light bg-white">
        <div className="container flex flex-wrap gap-8 py-16 sm:gap-14 sm:py-22">
          <div className="min-w-0 flex-[1_1_340px]">
            <h2 className="reveal-heading font-heading m-0 text-4xl font-bold leading-[1.08] sm:text-[40px]">
              Vrienden van LiemersCity Korfbal
            </h2>
            <div className="reveal-grow mt-6 flex h-1 w-24" aria-hidden>
              <span className="flex-1 bg-energie-groen" />
              <span className="flex-1 bg-actie-blauw" />
            </div>
          </div>
          <div className="flex min-w-0 flex-[1.4_1_480px] flex-col gap-6">
            <p className="m-0 text-lg">
              Steun het korfbal in de Liemers en help mee aan een onvergetelijk WK Korfbal 2027.
              Als Vriend steun je ons met een eenmalige bijdrage van € 15, € 20 of € 50.
            </p>
            <Link
              href="/vrienden-worden"
              className="group inline-flex items-center gap-2 self-start font-bold text-actie-blauw hover:text-actie-blauw"
            >
              Word Vriend van LiemersCity Korfbal
              <span aria-hidden className="inline-block transition-transform duration-200 ease-(--ease-out-quint) group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      <ContactSection id="contact" />
    </>
  );
}

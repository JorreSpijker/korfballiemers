import { getPageContent, getAllClubs } from "@/lib/content";
import { Hero } from "@/components/hero";
import { ClubMap } from "@/components/club-map";
import { NewsFeed } from "@/components/news-feed";
import { SponsorLogoBar } from "@/components/sponsor-logo-bar";
import { ContentSection } from "@/components/content-section";
import { Button } from "@/components/ui/button";
import clubsMapData from "@/data/clubs-map.json";
import type { ClubMapEntry } from "@/types/clubs-map";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home | WK Korfbal 2027 Bid Liemers",
  description:
    "De regio Liemers dient een bid in om het Wereldkampioenschap Korfbal 2027 te organiseren.",
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

  return (
    <>
      {/* Hero Section */}
      <Hero
        introHtml={page.content}
        id="intro"
      />

      {/* Kaart sectie */}
      <section id="over" className="py-16 bg-slate-50">
        <div className="container">
          <h2 className="text-2xl font-bold text-secondary mb-8">Clubs in de Liemers</h2>
          <div className="h-125 w-full">
            <ClubMap clubs={mapClubs} clubNames={clubNames} />
          </div>
        </div>
      </section>

      <NewsFeed
        id="nieuws"
        limit={6}
        title="Laatste nieuws"
        showAllLink={false}
      />

      <SponsorLogoBar id="sponsors" />

      {/* <ContentSection
        id="contact"
        title="Contactformulier"
        intro="Heb je een vraag of wil je meedoen? Stuur ons een bericht."
        className="bg-slate-50"
      >
        {contact && <Prose html={contact.content} />}
        <form className="space-y-4" action="#" method="post">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              Naam
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              E-mailadres
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="message" className="text-sm font-medium text-slate-700">
              Bericht
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button type="submit">Verstuur bericht</Button>
        </form>
      </ContentSection> */}
    </>
  );
}

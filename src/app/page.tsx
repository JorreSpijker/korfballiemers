import { getPageContent, getAllClubs } from "@/lib/content";
import { Hero } from "@/components/hero";
import { NewsFeed } from "@/components/news-feed";
import { ContentSection } from "@/components/content-section";
import { SponsorLogoBar } from "@/components/sponsor-logo-bar";
import clubsMapData from "@/data/clubs-map.json";
import type { ClubMapEntry } from "@/types/clubs-map";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | WK Korfbal 2027 Bid Liemers",
  description:
    "De regio Liemers dient een bid in om het Wereldkampioenschap Korfbal 2027 te organiseren.",
};

export default async function HomePage() {
  const page = await getPageContent("home");
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
      <Hero clubs={mapClubs} clubNames={clubNames} />

      {/* Intro Content Section */}

      <ContentSection
        title={page.frontmatter.title}
      >
        <div
          className="prose prose-neutral max-w-none text-slate-700"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </ContentSection>

      <section className="container px-4 pb-16">
        <NewsFeed limit={6} title="Nieuws uit de bid-regio" />
      </section>

      <SponsorLogoBar />
    </>
  );
}

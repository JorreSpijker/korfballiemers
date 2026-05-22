import Link from "next/link";
import { getAllClubs } from "@/lib/content";
import { ClubMap } from "@/components/club-map";
import clubsMapData from "@/data/clubs-map.json";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ClubMapEntry } from "@/types/clubs-map";
import type { Metadata } from "next";
import { Pattern } from "@/components/pattern";

export const metadata: Metadata = {
  title: "Clubs | WK Korfbal 2027 Bid Liemers",
  description:
    "Bekijk alle korfbalclubs in de Liemers op de interactieve kaart.",
};

export default async function ClubsPage() {
  const clubs = await getAllClubs();
  const mapClubs = clubsMapData as ClubMapEntry[];
  const clubNames = Object.fromEntries(
    clubs.map((c) => [c.frontmatter.id ?? c.slug, c.frontmatter.name ?? c.slug])
  );

  return (
    <section>
      <Pattern />
      <article className="container px-4 py-12 mt-24">
          <header className="mb-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Clubs
            </h1>
            <p className="mt-2 text-muted-foreground">
              Ontdek alle korfbalclubs in de Liemers
            </p>
          </header>

          <div className="space-y-8">
            <section
              className="h-[400px] w-full"
              aria-label="Interactieve kaart met clublocaties"
            >
              <ClubMap clubs={mapClubs} clubNames={clubNames} />
            </section>

            <section aria-labelledby="clubs-lijst">
              <h2 id="clubs-lijst" className="sr-only">
                Lijst van clubs
              </h2>
              {clubs.length === 0 ? (
                <p className="text-muted-foreground">Nog geen clubs toegevoegd.</p>
              ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {clubs.map((club) => (
                    <li key={club.slug}>
                      <Card>
                        <CardHeader>
                          <Link
                            href={`/clubs/${club.slug}`}
                            className="text-lg font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {club.frontmatter.name ?? club.slug}
                          </Link>
                          {club.frontmatter.city && (
                            <p className="text-sm text-muted-foreground">
                              {club.frontmatter.city}
                            </p>
                          )}
                          {club.frontmatter.excerpt && (
                            <p className="text-sm">{club.frontmatter.excerpt}</p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <Link
                            href={`/clubs/${club.slug}`}
                            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                          >
                            Bekijk club →
                          </Link>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
      </article>
    </section>
  );
}

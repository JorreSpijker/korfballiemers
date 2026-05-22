import Link from "next/link";
import { getClubBySlug, getAllClubs } from "@/lib/content";
import clubsMapData from "@/data/clubs-map.json";
import { notFound } from "next/navigation";
import type { ClubMapEntry } from "@/types/clubs-map";
import type { Metadata } from "next";
import { Pattern } from "@/components/pattern";

export async function generateStaticParams() {
  const clubs = await getAllClubs();
  return clubs.map((club) => ({ slug: club.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) return {};
  return {
    title: `${club.frontmatter.name ?? club.slug} | WK Korfbal 2027 Bid`,
    description: club.frontmatter.excerpt,
  };
}

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) notFound();

  const mapData = clubsMapData as ClubMapEntry[];
  const mapEntry = mapData.find((m) => m.id === (club.frontmatter.id ?? slug));

  return (
    <section>
      <Pattern />
      <article className="container px-4 py-12 mt-24">
        <div className="mx-auto max-w-3xl space-y-8">
          <nav aria-label="Breadcrumb">
            <Link
              href="/clubs"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground"
            >
              ← Terug naar clubs
            </Link>
          </nav>
          <header>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              {club.frontmatter.name ?? club.slug}
            </h1>
            {club.frontmatter.city && (
              <p className="mt-1 text-muted-foreground">
                {club.frontmatter.city}
              </p>
            )}
            {mapEntry && (
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                {(mapEntry.klasse_veld || mapEntry.klasse_zaal) && (
                  <p>
                    {mapEntry.klasse_veld && <span>Veld: {mapEntry.klasse_veld}</span>}
                    {mapEntry.klasse_veld && mapEntry.klasse_zaal && <span> · </span>}
                    {mapEntry.klasse_zaal && <span>Zaal: {mapEntry.klasse_zaal}</span>}
                  </p>
                )}
                <p>
                  {mapEntry.aantal_leden !== undefined && (
                    <span>
                      {mapEntry.aantal_leden} leden
                      {mapEntry.leden_datum && ` (peildatum: ${mapEntry.leden_datum})`}
                    </span>
                  )}
                  {mapEntry.aantal_leden !== undefined && mapEntry.oprichtingsjaar && (
                    <span> · </span>
                  )}
                  {mapEntry.oprichtingsjaar && (
                    <span>Opgericht {mapEntry.oprichtingsjaar}</span>
                  )}
                </p>
                {mapEntry.website && (
                  <p>
                    <a
                      href={mapEntry.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {mapEntry.website}
                    </a>
                  </p>
                )}
              </div>
            )}
          </header>
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: club.content }}
          />
        </div>
      </article>
  </section>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSpeelsteden, getSpeelstadBySlug } from "@/lib/content";
import { ContactCta, PageShell, Prose } from "@/components/page-shell";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";
import { PhotoGrid, clubPhotos } from "@/components/photo-book";
import clubsMapData from "@/data/clubs-map.json";
import type { ClubMapEntry } from "@/types/clubs-map";

const clubs = clubsMapData as ClubMapEntry[];

// Welke foto's (bestandsprefix) bij welke speelstad horen
const fotoPrefixen: Record<string, string> = {
  doesburg: "riv",
  zevenaar: "zwa",
  duiven: "duk",
  westervoort: "wes",
};

function toArray(value?: string | string[] | null): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export async function generateStaticParams() {
  const steden = await getAllSpeelsteden();
  return steden.map((stad) => ({ stad: stad.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stad: string }>;
}): Promise<Metadata> {
  const { stad } = await params;
  const page = await getSpeelstadBySlug(stad);
  if (!page) return {};
  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    alternates: { canonical: `/wk-korfbal-2027/${stad}` },
  };
}

export default async function SpeelstadPage({ params }: { params: Promise<{ stad: string }> }) {
  const { stad } = await params;
  const [page, steden] = await Promise.all([getSpeelstadBySlug(stad), getAllSpeelsteden()]);
  if (!page) notFound();

  const stadClubs = (page.frontmatter.clubs ?? [])
    .map((id) => clubs.find((club) => club.id === id))
    .filter((club): club is ClubMapEntry => Boolean(club));
  const andereSteden = steden.filter((s) => s.slug !== stad);
  const fotos = fotoPrefixen[stad] ? clubPhotos(fotoPrefixen[stad]) : [];

  return (
    <PageShell
      title={page.frontmatter.title ?? `WK Korfbal 2027 in ${page.frontmatter.name}`}
      intro={page.frontmatter.description}
      back={{ href: "/wk-korfbal-2027", label: "WK Korfbal 2027 in de Liemers" }}
    >
      <JsonLd
        data={breadcrumbSchema([
          { name: "WK Korfbal 2027", path: "/wk-korfbal-2027" },
          { name: page.frontmatter.name ?? stad, path: `/wk-korfbal-2027/${stad}` },
        ])}
      />
      <Prose html={page.content} />

      {stadClubs.length > 0 && (
        <section aria-labelledby="clubs-titel" className="space-y-5">
          <h2 id="clubs-titel" className="font-heading text-3xl font-bold">
            Clubs en locaties in {page.frontmatter.name}
          </h2>
          <ul className="m-0 grid list-none gap-4 p-0">
            {stadClubs.map((club) => (
              <li key={club.id} className="flex flex-wrap items-center gap-5 rounded-2xl border border-[#0F1A17]/10 p-5">
                <span className="flex -space-x-3">
                  {toArray(club.logo).map((logo) => (
                    <span key={logo} className="relative h-14 w-14 overflow-hidden rounded-full bg-white ring-2 ring-[#EEF2EF]">
                      <Image src={logo} alt={`${club.name ?? club.id} logo`} fill sizes="56px" className="object-contain p-1" />
                    </span>
                  ))}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading m-0 text-xl font-bold">{club.name}</h3>
                  {club.oprichtingsjaar && (
                    <p className="m-0 text-sm text-liemers-groen/70">Opgericht {club.oprichtingsjaar}</p>
                  )}
                </div>
                {toArray(club.website).map((website) => (
                  <a
                    key={website}
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center rounded-full border border-[#0F1A17]/15 px-4 text-sm font-semibold text-liemers-groen transition-colors hover:border-actie-blauw hover:text-actie-blauw"
                  >
                    {new URL(website).hostname.replace(/^www\./, "")} ↗
                  </a>
                ))}
              </li>
            ))}
          </ul>
        </section>
      )}

      {fotos.length > 0 && (
        <section aria-labelledby="fotos-titel" className="space-y-8">
          <h2 id="fotos-titel" className="font-heading text-3xl font-bold">
            Korfbal in {page.frontmatter.name}
          </h2>
          <PhotoGrid files={fotos} className="sm:grid-cols-3" />
        </section>
      )}

      <ContactCta
        onderwerp="vrijwilliger"
        title={`Doe mee vanuit ${page.frontmatter.name}`}
        text="Als vrijwilliger ben je er van dichtbij bij als de wereldtop van het korfbal in de Liemers speelt."
        label="Vrijwilliger worden"
      />

      <nav aria-label="Andere speelsteden" className="space-y-3">
        <h2 className="font-heading text-xl font-bold">Andere speelsteden</h2>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {andereSteden.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/wk-korfbal-2027/${s.slug}`}
                className="inline-flex min-h-11 items-center rounded-full border border-[#0F1A17]/15 px-4 font-semibold text-liemers-groen transition-colors hover:border-actie-blauw hover:text-actie-blauw"
              >
                {s.frontmatter.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </PageShell>
  );
}

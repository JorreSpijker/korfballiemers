import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSpeelsteden, getPageContent } from "@/lib/content";
import { ContactCta, PageShell, Prose } from "@/components/page-shell";
import { JsonLd } from "@/components/json-ld";
import { wkEventSchema } from "@/lib/structured-data";
import { WK_VENUE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent("wk-korfbal-2027");
  return {
    title: page?.frontmatter.title,
    description: page?.frontmatter.description,
    alternates: { canonical: "/wk-korfbal-2027" },
  };
}

export default async function WkPage() {
  const [page, steden] = await Promise.all([getPageContent("wk-korfbal-2027"), getAllSpeelsteden()]);
  if (!page) notFound();

  return (
    <PageShell
      title={page.frontmatter.title ?? "WK Korfbal 2027 in de Liemers"}
      intro="Van 15 t/m 17 oktober 2027 is De Liemers het hart van de internationale korfbalwereld."
      back={{ href: "/", label: "Terug naar home" }}
    >
      <JsonLd data={wkEventSchema} />

      <dl className="grid gap-3 sm:grid-cols-3">
        {[
          ["Wanneer", "15 t/m 17 oktober 2027"],
          ["Hostregio", "Doesburg, Duiven, Westervoort en Zevenaar"],
          ["Sporthal", `${WK_VENUE.name}, ${WK_VENUE.locality}`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-[#EEF2EF] px-5 py-4">
            <dt className="text-sm text-liemers-groen/70">{label}</dt>
            <dd className="m-0 font-heading text-lg font-semibold text-liemers-groen">{value}</dd>
          </div>
        ))}
      </dl>

      <Prose html={page.content} />

      <section aria-labelledby="speelsteden-titel" className="space-y-5">
        <h2 id="speelsteden-titel" className="font-heading text-3xl font-bold">
          De speelsteden
        </h2>
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
          {steden.map((stad) => (
            <li key={stad.slug}>
              <Link
                href={`/wk-korfbal-2027/${stad.slug}`}
                className="group flex items-center justify-between rounded-xl border border-[#0F1A17]/10 px-5 py-4 font-heading text-lg font-bold text-liemers-groen transition-[border-color,background-color] duration-200 hover:border-actie-blauw hover:bg-actie-blauw/5 hover:text-liemers-groen"
              >
                WK Korfbal 2027 in {stad.frontmatter.name}
                <span aria-hidden className="text-actie-blauw transition-transform duration-200 ease-(--ease-out-quint) group-hover:translate-x-1">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ContactCta
        onderwerp="vrijwilliger"
        title="Help mee aan het WK"
        text="Een wereldkampioenschap organiseer je niet alleen. Meld je aan als vrijwilliger."
        label="Vrijwilliger worden"
      />
    </PageShell>
  );
}

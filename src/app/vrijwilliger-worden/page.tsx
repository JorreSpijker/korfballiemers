import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/content";
import { ContactCta, PageShell, Prose } from "@/components/page-shell";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent("vrijwilliger-worden");
  return {
    title: page?.frontmatter.title,
    description: page?.frontmatter.description,
    alternates: { canonical: "/vrijwilliger-worden" },
  };
}

export default async function VrijwilligerPage() {
  const page = await getPageContent("vrijwilliger-worden");
  if (!page) notFound();

  return (
    <PageShell title={page.frontmatter.title ?? ""} back={{ href: "/", label: "Terug naar home" }}>
      <JsonLd data={breadcrumbSchema([{ name: "Vrijwilliger worden", path: "/vrijwilliger-worden" }])} />
      <Prose html={page.content} />
      <ContactCta
        onderwerp="vrijwilliger"
        title="Meld je aan"
        text="Laat je gegevens achter, dan nemen we contact met je op over de mogelijkheden."
        label="Aanmelden als vrijwilliger"
      />
    </PageShell>
  );
}

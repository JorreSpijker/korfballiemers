import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/content";
import { ContactCta, PageShell, Prose } from "@/components/page-shell";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent("sponsor-worden");
  return {
    title: page?.frontmatter.title,
    description: page?.frontmatter.description,
    alternates: { canonical: "/sponsor-worden" },
  };
}

export default async function SponsorPage() {
  const page = await getPageContent("sponsor-worden");
  if (!page) notFound();

  return (
    <PageShell title={page.frontmatter.title ?? ""} back={{ href: "/", label: "Terug naar home" }}>
      <Prose html={page.content} />
      <ContactCta
        onderwerp="sponsor"
        title="Interesse in sponsoring?"
        text="Neem contact op, dan bespreken we graag de mogelijkheden."
        label="Sponsor worden"
      />
    </PageShell>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/content";
import { PageShell, Prose } from "@/components/page-shell";
import { VriendenForm } from "@/components/vrienden-form";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent("vrienden");
  return {
    title: page?.frontmatter.title,
    description: page?.frontmatter.description,
    alternates: { canonical: "/vrienden" },
  };
}

export default async function VriendenPage() {
  const page = await getPageContent("vrienden");
  if (!page) notFound();

  return (
    <PageShell title={page.frontmatter.title ?? ""} back={{ href: "/", label: "Terug naar home" }}>
      <JsonLd data={breadcrumbSchema([{ name: "Vriend worden", path: "/vrienden" }])} />
      <Prose html={page.content} />
      <VriendenForm />
    </PageShell>
  );
}

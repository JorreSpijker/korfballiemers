import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/content";
import { PageShell, Prose } from "@/components/page-shell";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent("privacy");
  return {
    title: page?.frontmatter.title,
    description: page?.frontmatter.description,
    alternates: { canonical: "/privacy" },
  };
}

export default async function PrivacyPage() {
  const page = await getPageContent("privacy");
  if (!page) notFound();

  return (
    <PageShell title={page.frontmatter.title ?? ""} back={{ href: "/", label: "Terug naar home" }}>
      <Prose html={page.content} />
    </PageShell>
  );
}

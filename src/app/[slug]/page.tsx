import { getPageContent } from "@/lib/content";
import { readdirSync } from "fs";
import { join } from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const EXCLUDED_SLUGS = new Set(["home"]);

export async function generateStaticParams() {
  const files = readdirSync(join(process.cwd(), "content/pages")).filter((f) =>
    f.endsWith(".md")
  );
  return files
    .map((f) => ({ slug: f.replace(/\.md$/, "") }))
    .filter(({ slug }) => !EXCLUDED_SLUGS.has(slug));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageContent(slug);
  if (!page) return {};
  return {
    title: `${page.frontmatter.title} | WK Korfbal 2027 Bid Liemers`,
    description: page.frontmatter.excerpt,
  };
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (EXCLUDED_SLUGS.has(slug)) notFound();

  const page = await getPageContent(slug);
  if (!page) notFound();

  return (
    <article className="container px-4 py-12 mt-24">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {page.frontmatter.title}
          </h1>
          {page.frontmatter.excerpt && (
            <p className="mt-2 text-lg text-muted-foreground">
              {page.frontmatter.excerpt}
            </p>
          )}
        </header>
        <div
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </article>
  );
}

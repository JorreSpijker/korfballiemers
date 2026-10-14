import Link from "next/link";
import { getNewsPostBySlug, getAllNewsPosts } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Pattern } from "@/components/pattern";
import Image from "next/image";
import { JsonLd } from "@/components/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Zoekmachines tonen ~160 tekens; afkappen op een woordgrens
function toDescription(text = ""): string {
  if (text.length <= 160) return text;
  return `${text.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}

function toIsoDate(date?: string): string | undefined {
  return date ? new Date(date).toISOString().slice(0, 10) : undefined;
}

export async function generateStaticParams() {
  const posts = await getAllNewsPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);
  if (!post) return {};
  const description = toDescription(post.frontmatter.excerpt);
  // Nieuwstitels zijn al lang en bevatten het zoekwoord; geen achtervoegsel
  return {
    title: { absolute: post.frontmatter.title ?? SITE_NAME },
    description,
    alternates: { canonical: `/nieuws/${slug}` },
    openGraph: {
      type: "article",
      title: post.frontmatter.title,
      description,
      publishedTime: toIsoDate(post.frontmatter.date),
      images: post.frontmatter.image ? [post.frontmatter.image] : undefined,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: post.frontmatter.title,
          description: post.frontmatter.excerpt,
          datePublished: toIsoDate(post.frontmatter.date),
          image: post.frontmatter.image ? [`${SITE_URL}${post.frontmatter.image}`] : undefined,
          mainEntityOfPage: `${SITE_URL}/nieuws/${slug}`,
          publisher: { "@type": "Organization", name: SITE_NAME, logo: `${SITE_URL}/logo.svg` },
        }}
      />
      <section className={`relative ${post.frontmatter.image ? "pb-40" : "pb-16"}`}>
        <Pattern />
        <div className="container relative pt-16">
          <div className="mx-auto max-w-3xl space-y-8">
            <nav aria-label="Breadcrumb" className="anim-rise">
              <Link
                href="/#nieuws"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-white"
              >
                ← Terug naar nieuws
              </Link>
            </nav>
            <header className="anim-rise [--d:100ms]">
              <time
                dateTime={post.frontmatter.date ?? ""}
                className="text-[13px] font-semibold text-energie-groen-licht"
              >
                {post.frontmatter.date
                  ? new Date(post.frontmatter.date).toLocaleDateString("nl-NL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </time>
              <h1 className="font-heading mt-1 text-3xl font-bold leading-[1.1] sm:text-[44px]">
                {post.frontmatter.title}
              </h1>
            </header>
          </div>
        </div>
      </section>
      <section className="surface-light bg-white pb-20 pt-1">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {post.frontmatter.image && (
              <Image
                src={post.frontmatter.image}
                alt={post.frontmatter.title ?? ""}
                className="anim-rise relative -mt-28 mb-12 w-full rounded-lg shadow-xl [--d:220ms]"
                width={800}
                height={400}
              />
            )}
            <div
              className={`prose prose-lg max-w-none leading-[1.7] prose-headings:font-heading prose-headings:text-liemers-groen prose-p:text-liemers-groen prose-li:text-liemers-groen prose-strong:text-liemers-groen prose-a:text-actie-blauw [&_blockquote_p]:before:content-none [&_blockquote_p]:after:content-none ${post.frontmatter.image ? "" : "pt-12"}`}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </section>
    </article>
  );
}

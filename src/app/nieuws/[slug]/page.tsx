import Link from "next/link";
import { getNewsPostBySlug, getAllNewsPosts } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Pattern } from "@/components/pattern";
import Image from "next/image";

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
  return {
    title: `${post.frontmatter.title} | WK Korfbal 2027 Bid`,
    description: post.frontmatter.excerpt,
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
    <section>
      <Pattern />
      <article className="container px-4 py-12 mt-24">
        <div className="mx-auto max-w-3xl space-y-8">
          <nav aria-label="Breadcrumb">
            <Link
              href="/nieuws"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground"
            >
              ← Terug naar nieuws
            </Link>
          </nav>
          <header>
            <Image src={post.frontmatter.image} alt={post.frontmatter.title} className="rounded-lg mb-2" width={800} height={400} />
            <time
              dateTime={post.frontmatter.date ?? ""}
              className="text-sm text-muted-foreground"
            >
              {post.frontmatter.date
                ? new Date(post.frontmatter.date).toLocaleDateString("nl-NL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </time>
            <h1 className="font-heading mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              {post.frontmatter.title}
            </h1>
          </header>
          {/* <Image src={post.image} alt={post.frontmatter.title} className="rounded-lg" /> */}
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </section>
  );
}

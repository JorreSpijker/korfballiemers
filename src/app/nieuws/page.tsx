import Link from "next/link";
import { getAllNewsPosts } from "@/lib/content";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nieuws | WK Korfbal 2027 Bid Liemers",
  description: "Het laatste nieuws over het WK Korfbal 2027 Bid in de Liemers.",
};

export default async function NewsPage() {
  const posts = await getAllNewsPosts();

  return (
    <article className="container px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Nieuws
        </h1>
        <p className="mt-2 text-muted-foreground">
          Het laatste nieuws over het WK Korfbal 2027 Bid
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">Nog geen nieuwsberichten.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Card>
                <CardHeader>
                  <time
                    dateTime={post.frontmatter.date ?? ""}
                    className="text-sm text-muted-foreground"
                  >
                    {post.frontmatter.date
                      ? new Date(post.frontmatter.date).toLocaleDateString(
                          "nl-NL",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : ""}
                  </time>
                  <Link
                    href={`/nieuws/${post.slug}`}
                    className="text-xl font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {post.frontmatter.title}
                  </Link>
                  {post.frontmatter.excerpt && (
                    <p className="text-muted-foreground">
                      {post.frontmatter.excerpt}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/nieuws/${post.slug}`}
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Lees meer →
                  </Link>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

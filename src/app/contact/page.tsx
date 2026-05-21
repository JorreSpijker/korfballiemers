import { getPageContent } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | WK Korfbal 2027 Bid Liemers",
  description:
    "Neem contact op met het WK Korfbal 2027 Bid team.",
};

export default async function ContactPage() {
  const page = await getPageContent("contact");
  if (!page) {
    return (
      <div className="container px-4 py-12">
        <p>Pagina niet gevonden.</p>
      </div>
    );
  }

  return (
    <article className="container px-4 py-12">
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

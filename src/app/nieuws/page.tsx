import type { Metadata } from "next";
import { NewsFeed } from "@/components/news-feed";

export const metadata: Metadata = {
  title: "Nieuws | WK Korfbal 2027 Bid Liemers",
  description: "Het laatste nieuws over het WK Korfbal 2027 Bid in de Liemers.",
};

export default function NewsPage() {
  return (
    <article className="container px-4 py-12">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Nieuws
        </h1>
        <p className="mt-2 text-muted-foreground">
          Het laatste nieuws over het WK Korfbal 2027 Bid
        </p>
      </header>
      <NewsFeed limit={24} title="Alle nieuwsberichten" showAllLink={false} />
    </article>
  );
}

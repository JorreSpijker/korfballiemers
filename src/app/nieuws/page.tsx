import type { Metadata } from "next";
import { NewsFeed } from "@/components/news-feed";
import { Pattern } from "@/components/pattern";

export const metadata: Metadata = {
  title: "Nieuws",
  description:
    "Het laatste nieuws over het WK Korfbal 2027 in de Liemers en de korfbalclubs in Doesburg, Duiven, Westervoort en Zevenaar.",
  alternates: { canonical: "/nieuws" },
};

export default function NieuwsPage() {
  return (
    <>
      <section className="relative">
        <Pattern />
        <div className="container relative pt-16 pb-10">
          <h1 className="anim-rise font-heading m-0 text-4xl font-bold leading-[1.05] sm:text-[52px]">
            Nieuws over het WK Korfbal 2027
          </h1>
        </div>
      </section>
      <NewsFeed limit={24} showAllLink={false} />
    </>
  );
}

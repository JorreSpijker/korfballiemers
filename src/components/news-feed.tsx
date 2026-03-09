"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
};

type NewsFeedProps = {
  limit?: number;
  title?: string;
  showAllLink?: boolean;
};

function formatDate(date: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function NewsFeed({
  limit = 6,
  title = "Laatste nieuws",
  showAllLink = true,
}: NewsFeedProps) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadNews() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/nieuws?limit=${limit}`);
        if (!response.ok) {
          throw new Error("Kon nieuws niet ophalen");
        }

        const data = (await response.json()) as { news?: NewsItem[] };
        if (active) {
          setItems(data.news ?? []);
        }
      } catch {
        if (active) {
          setError("Nieuws ophalen is mislukt. Probeer later opnieuw.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadNews();

    return () => {
      active = false;
    };
  }, [limit]);

  const hasItems = useMemo(() => items.length > 0, [items]);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-secondary px-6 py-10 text-secondary-foreground sm:px-10">
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 translate-x-12 -translate-y-12 rounded-full bg-primary/20 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-36 w-36 -translate-x-10 translate-y-12 rounded-full bg-primary/25 blur-2xl" />

      <div className="relative">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-white/15 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              TeamNL-stijl
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h2>
          </div>
          {showAllLink && (
            <Link
              href="/nieuws"
              className="text-sm font-semibold text-primary transition hover:text-primary/80"
            >
              Bekijk alles
            </Link>
          )}
        </div>

        {loading && <p className="text-white/70">Nieuws wordt geladen...</p>}

        {error && <p className="text-sm text-red-200">{error}</p>}

        {!loading && !error && !hasItems && (
          <p className="text-white/70">Nog geen nieuwsberichten beschikbaar.</p>
        )}

        {!loading && !error && hasItems && (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.slug}>
                <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-primary/60 hover:bg-white/10">
                  <time className="text-xs font-medium uppercase tracking-wide text-white/60" dateTime={item.date}>
                    {formatDate(item.date)}
                  </time>
                  <h3 className="mt-3 text-lg font-semibold leading-tight">
                    <Link href={`/nieuws/${item.slug}`} className="hover:text-primary">
                      {item.title}
                    </Link>
                  </h3>
                  {item.excerpt && (
                    <p className="mt-3 text-sm text-white/75">{item.excerpt}</p>
                  )}
                  <div className="mt-auto pt-5">
                    <Link
                      href={`/nieuws/${item.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-primary transition hover:text-primary/80"
                    >
                      Lees bericht
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

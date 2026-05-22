"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string | null;
};

type NewsFeedProps = {
  limit?: number;
  title?: string;
  showAllLink?: boolean;
  fullWidth?: boolean;
  id?: string;
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
  fullWidth = false,
  id,
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

  const containerClass = fullWidth ? "w-full" : "container mx-auto";

  const content = (
    <div className={containerClass}>
      <div className="mb-8 flex items-end justify-between gap-4 pb-4">
        <div>
          <h2 className="font-heading mt-2 text-2xl font-bold tracking-tight sm:text-3xl text-slate-900">
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

      {loading && <p className="text-sm text-slate-500">Nieuws wordt geladen...</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && !hasItems && (
        <p className="text-sm text-slate-500">Nog geen nieuwsberichten beschikbaar.</p>
      )}

      {!loading && !error && hasItems && (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.slug}>
              <article className="flex h-full flex-col overflow-hidden rounded-sm bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                {item.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3 px-5 py-6">
                  <time
                    className="text-xs font-medium uppercase tracking-wide text-slate-500"
                    dateTime={item.date}
                  >
                    {formatDate(item.date)}
                  </time>
                  <h3 className="font-heading text-lg font-semibold leading-tight text-slate-900">
                    <Link href={`/nieuws/${item.slug}`} className="hover:text-primary">
                      {item.title}
                    </Link>
                  </h3>
                  {item.excerpt && (
                    <p className="text-sm text-slate-600">{item.excerpt}</p>
                  )}
                  <div className="mt-3 pt-3">
                    <Link
                      href={`/nieuws/${item.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-primary transition hover:text-primary/80"
                    >
                      Lees bericht
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <section id={id} className="relative bg-white px-6 py-20 sm:px-10">
      {content}
    </section>
  );
}

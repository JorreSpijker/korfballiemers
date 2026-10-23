import Image from "next/image";
import Link from "next/link";
import { getAllNewsPosts } from "@/lib/content";

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

export async function NewsFeed({
  limit = 6,
  title,
  showAllLink = true,
  fullWidth = false,
  id,
}: NewsFeedProps) {
  // Server-side: het nieuws staat direct in de HTML (goed voor zoekmachines)
  const posts = await getAllNewsPosts();
  const items = posts.slice(0, limit).map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title ?? post.slug,
    excerpt: post.frontmatter.excerpt ?? "",
    // gray-matter levert YAML-datums als Date; ISO-datum voor <time dateTime>
    date: post.frontmatter.date ? new Date(post.frontmatter.date).toISOString().slice(0, 10) : "",
    image: post.frontmatter.image ?? null,
  }));

  const containerClass = fullWidth ? "w-full" : "container mx-auto";

  const content = (
    <div className={containerClass}>
      {(title || showAllLink) && (
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            {title && (
              <h2 className="reveal-heading font-heading m-0 text-4xl font-bold leading-[1.05] sm:text-[44px]">
                {title}
              </h2>
            )}
          </div>
          {showAllLink && (
            <Link
              href="/nieuws"
              className="text-sm font-semibold transition"
            >
              Bekijk alles
            </Link>
          )}
        </div>
      )}

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">Nog geen nieuwsberichten beschikbaar.</p>
      )}

      {items.length > 0 && (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <li key={item.slug} className="reveal" style={{ "--i": index % 3 } as React.CSSProperties}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[10px] border bg-card transition duration-300 ease-(--ease-out-quint) hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_48px_-24px_rgb(0_0_0/0.9)]">
                {item.image && (
                  <div className="relative h-[200px] w-full overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-(--ease-out-quint) motion-safe:group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <time
                    className="text-[13px] font-semibold text-energie-groen-licht"
                    dateTime={item.date}
                  >
                    {formatDate(item.date)}
                  </time>
                  <h3 className="font-heading m-0 text-xl font-bold leading-[1.25]">
                    <Link href={`/nieuws/${item.slug}`} className="text-white hover:text-link-hover">
                      {item.title}
                    </Link>
                  </h3>
                  {item.excerpt && (
                    <p className="m-0 text-[15px] text-muted-foreground">{item.excerpt}</p>
                  )}
                  <div className="mt-auto border-t border-white/[0.08] pt-3">
                    <Link
                      href={`/nieuws/${item.slug}`}
                      className="group/link inline-flex min-h-11 items-center gap-1.5 font-bold transition"
                    >
                      Lees bericht
                      <span aria-hidden className="inline-block transition-transform duration-200 ease-(--ease-out-quint) group-hover/link:translate-x-1">→</span>
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
    <section id={id} className="relative border-y border-white/[0.08] bg-surface py-16 sm:py-26">
      {content}
    </section>
  );
}

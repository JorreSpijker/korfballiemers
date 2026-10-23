import Link from "next/link";
import type { ReactNode } from "react";
import { Pattern } from "@/components/pattern";
import type { ContactSubject } from "@/lib/contact-subjects";

type PageShellProps = {
  title: string;
  intro?: string;
  back?: { href: string; label: string };
  children: ReactNode;
};

// Donkere kop met h1, daaronder een lichte leesbaan
export function PageShell({ title, intro, back, children }: PageShellProps) {
  return (
    <article>
      <section className="relative pb-14">
        <Pattern />
        <div className="container relative pt-16">
          <div className="mx-auto max-w-3xl space-y-6">
            {back && (
              <nav aria-label="Breadcrumb" className="anim-rise">
                <Link
                  href={back.href}
                  className="text-sm text-muted-foreground underline-offset-4 hover:text-white"
                >
                  ← {back.label}
                </Link>
              </nav>
            )}
            <header className="anim-rise space-y-4 [--d:100ms]">
              <h1 className="font-heading m-0 text-3xl font-bold leading-[1.1] text-balance sm:text-[44px]">
                {title}
              </h1>
              {intro && <p className="m-0 max-w-[640px] text-lg text-foreground/80">{intro}</p>}
            </header>
          </div>
        </div>
      </section>
      <section className="surface-light bg-white py-14 sm:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-12">{children}</div>
        </div>
      </section>
    </article>
  );
}

export function Prose({ html }: { html: string }) {
  return (
    <div
      className="prose prose-lg max-w-none leading-[1.7] prose-headings:font-heading prose-headings:text-liemers-groen prose-p:text-liemers-groen prose-li:text-liemers-groen prose-strong:text-liemers-groen prose-a:text-actie-blauw"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function ContactCta({
  onderwerp,
  title,
  text,
  label,
}: {
  onderwerp: ContactSubject;
  title: string;
  text: string;
  label: string;
}) {
  return (
    <aside className="rounded-2xl bg-[#EEF2EF] p-6 sm:p-8">
      <h2 className="font-heading m-0 text-2xl font-bold">{title}</h2>
      <p className="mt-3 mb-6 text-liemers-groen">{text}</p>
      <Link
        href={`/?onderwerp=${onderwerp}#contact`}
        className="group inline-flex min-h-12 items-center gap-2 rounded-md bg-actie-blauw px-6 font-bold text-white transition-[background-color,transform] duration-200 ease-(--ease-out-quint) hover:bg-actie-blauw/85 hover:text-white motion-safe:active:scale-[0.97]"
      >
        {label}
        <span aria-hidden className="inline-block transition-transform duration-200 ease-(--ease-out-quint) group-hover:translate-x-1">→</span>
      </Link>
    </aside>
  );
}

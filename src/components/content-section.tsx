import type { ReactNode } from "react";

type ContentSectionProps = {
  title?: string;
  intro?: string;
  children?: ReactNode;
  className?: string;
  id?: string;
};

export function ContentSection({
  title,
  intro,
  children,
  className,
  id,
}: ContentSectionProps) {
  return (
    <section id={id} className={`bg-white py-12 sm:py-16 ${className ?? ""}`.trim()}>
      <div className="container px-4">
        <div className="mx-auto max-w-3xl space-y-8">
          {(title || intro) && (
            <header>
              {title && (
                <h1 className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
                  {title}
                </h1>
              )}
              {intro && <p className="mt-2 text-lg text-slate-600">{intro}</p>}
            </header>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}

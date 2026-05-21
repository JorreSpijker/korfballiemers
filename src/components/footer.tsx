import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

const siteLinks = [
  { href: "/", label: "Home" },
  { href: "/nieuws", label: "Nieuws" },
  { href: "/clubs", label: "Clubs" },
  { href: "/contact", label: "Contact" },
] as const;

const doeMeeLinks = [
  { href: "/vrijwilligers", label: "Vrijwilligers" },
  { href: "/sponsor-worden", label: "Sponsor worden" },
] as const;

export function Footer() {
  return (
    <footer className="mt-16 bg-secondary text-secondary-foreground" role="contentinfo">
      <div className="h-1.5 w-full bg-primary" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Naar homepage">
              <Image
                src="/korfbal-logo.svg"
                alt="Korfbal in De Liemers"
                width={42}
                height={42}
              />
              <span className="text-sm font-semibold leading-tight">
                <span className="block">Korfbal in</span>
                <span className="block">De Liemers</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-white/75">
              Samen bouwen we aan een sterk bid voor het WK Korfbal 2027 in de regio Liemers.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              Navigatie
            </h3>
            <ul className="mt-4 space-y-2.5">
              {siteLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/80 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              Doe mee
            </h3>
            <ul className="mt-4 space-y-2.5">
              {doeMeeLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/80 transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                <span>Regio De Liemers, Gelderland</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                <a className="transition hover:text-primary" href="mailto:info@korfbalindeliemers.nl">
                  info@korfbalindeliemers.nl
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                <a className="transition hover:text-primary" href="tel:+31612345678">
                  +31 6 12 34 56 78
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} WK Korfbal 2027 Bid Liemers.</p>
          <p>Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
}

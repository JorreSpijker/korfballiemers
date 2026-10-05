import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";

const brandColors = ["bg-energie-groen", "bg-actie-blauw"];

const linkClass =
  "text-sm text-white/75 transition hover:text-samen-goud focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-samen-goud rounded-sm";

const headingClass =
  "font-heading text-xs font-semibold uppercase tracking-[0.18em] text-samen-goud!";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-secondary text-white/75" role="contentinfo">
      <div className="flex h-1.5" aria-hidden>
        {brandColors.map((color) => (
          <span key={color} className={`flex-1 ${color}`} />
        ))}
      </div>

      <Image
        src="/icon.svg"
        alt=""
        width={420}
        height={420}
        aria-hidden
        className="pointer-events-none absolute -right-24 -bottom-24 w-[420px] opacity-[0.07]"
      />

      <div className="container relative mx-auto px-4">
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-9">
            <Link href="/" className="inline-flex rounded-md bg-white p-3 shadow-lg" aria-label="Naar homepage">
              <Image
                src="/logo.svg"
                alt="LiemersCity Korfbal"
                width={168}
                height={99}
                className="h-16 w-auto"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed">
              Samen bouwen we aan de korfbalsport in de Liemers.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h3 className={headingClass}>Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-energie-groen">
                  <MapPin className="h-4 w-4" aria-hidden />
                </span>
                <span>Regio De Liemers, Gelderland</span>
              </li>
              {/* <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-energie-groen">
                  <Mail className="h-4 w-4" aria-hidden />
                </span>
                <a className={linkClass} href="mailto:info@korfbalindeliemers.nl">
                  info@liemerscitykorfbal.nl
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} LiemersCity Korfbal</p>
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 transition hover:text-samen-goud"
          >
            Terug naar boven
            <ArrowUp className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}

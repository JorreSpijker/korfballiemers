import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";

const brandColors = ["bg-energie-groen", "bg-actie-blauw"];

const linkClass =
  "text-sm text-foreground/75 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

const headingClass =
  "text-xs font-bold uppercase tracking-[0.18em] text-samen-goud";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-surface-deep text-foreground/75" role="contentinfo">
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
        <div className="flex flex-wrap justify-between gap-10 pt-14 pb-12">
          <div className="flex max-w-[380px] flex-col gap-[18px]">
            <Link href="/" className="inline-flex self-start rounded-lg bg-white px-4 py-3 transition-[transform,box-shadow] duration-300 ease-(--ease-out-quint) motion-safe:hover:-translate-y-1 hover:shadow-[0_16px_32px_-16px_rgb(0_0_0/0.8)]" aria-label="Naar homepage">
              <Image
                src="/logo.svg"
                alt="LiemersCity Korfbal"
                width={168}
                height={99}
                className="h-12 w-auto"
              />
            </Link>
            <p className="m-0 text-[15px] text-foreground/72">
              Samen bouwen we aan de korfbalsport in de Liemers.
            </p>
          </div>

          <div>
            <h3 className={headingClass}>Contact</h3>
            <ul className="mt-4 space-y-3 text-[15px] text-foreground/78">
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-energie-groen-licht">
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

        <div className="flex flex-col gap-3 border-t py-6 text-[13px] text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} LiemersCity Korfbal</p>
          <a
            href="#top"
            className="group inline-flex items-center gap-1.5 text-foreground/75 transition hover:text-white"
          >
            Terug naar boven
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-200 ease-(--ease-out-quint) motion-safe:group-hover:-translate-y-1" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}

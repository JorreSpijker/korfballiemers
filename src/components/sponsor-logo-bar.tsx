import Image from "next/image";
import sponsorsData from "@/data/sponsors.json";

type Sponsor = {
  name: string;
  logo: string;
};

const sponsors = sponsorsData as Sponsor[];
const SPONSOR_MAILTO = "mailto:info@korfbalindeliemers.nl?subject=Sponsor%20worden";

type SponsorLogoBarProps = {
  id?: string;
};

export function SponsorLogoBar({ id }: SponsorLogoBarProps) {
  return (
    <section id={id} className="surface-light bg-white">
      <div className="container py-16 sm:py-24">
        <h2 className="reveal-heading font-heading mb-5 text-4xl font-bold leading-[1.05] sm:text-[44px]">
          {sponsors.length > 0 ? "Trots op onze sponsoren" : "Word onze eerste sponsor"}
        </h2>
        <p className="mb-8 max-w-[620px] text-lg">
          Verbind je naam aan een sportevenement van wereldformaat, midden in de Liemers. Als sponsor
          ben je zichtbaar bij spelers, supporters en inwoners uit de hele regio, en help je de
          korfbalclubs hier bouwen aan een sterke toekomst. Groot of klein: elke bijdrage telt.
        </p>

        {sponsors.length === 0 ? (
          <a
            href={SPONSOR_MAILTO}
            className="group inline-flex min-h-12 items-center gap-2 rounded-md bg-actie-blauw px-6 font-bold text-white transition-[background-color,transform] duration-200 ease-(--ease-out-quint) hover:bg-actie-blauw/85 hover:text-white motion-safe:active:scale-[0.97]"
          >
            Sponsor worden
            <span aria-hidden className="inline-block transition-transform duration-200 ease-(--ease-out-quint) group-hover:translate-x-1">→</span>
          </a>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4">
            {sponsors.map((sponsor, index) => (
              <div
                key={sponsor.name}
                className="reveal group flex h-24 items-center justify-center rounded-lg border border-[#0F1A17]/[0.08] bg-[#F4F6F5] p-4 transition duration-300 ease-(--ease-out-quint) hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_32px_-20px_rgb(15_26_23/0.45)]"
                style={{ "--i": index } as React.CSSProperties}
              >
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={170}
                  height={70}
                  className="h-auto max-h-14 w-auto object-contain grayscale transition duration-300 group-hover:grayscale-0"
                />
              </div>
            ))}
            <a
              href={SPONSOR_MAILTO}
              className="reveal group flex h-24 items-center justify-center gap-2 rounded-lg bg-actie-blauw font-bold text-white transition-[background-color,transform] duration-200 ease-(--ease-out-quint) hover:bg-actie-blauw/85 hover:text-white motion-safe:active:scale-[0.97]"
              style={{ "--i": sponsors.length } as React.CSSProperties}
            >
              Sponsor worden
              <span aria-hidden className="inline-block transition-transform duration-200 ease-(--ease-out-quint) group-hover:translate-x-1">→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

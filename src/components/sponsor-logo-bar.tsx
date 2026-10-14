import Image from "next/image";

const sponsors = [
  { name: "Sponsor 1", logo: "/sponsors/sponsor-1.svg" },
  { name: "Sponsor 2", logo: "/sponsors/sponsor-2.svg" },
  { name: "Sponsor 3", logo: "/sponsors/sponsor-3.svg" },
  { name: "Sponsor 4", logo: "/sponsors/sponsor-4.svg" },
  { name: "Sponsor 5", logo: "/sponsors/sponsor-5.svg" },
  { name: "Sponsor 6", logo: "/sponsors/sponsor-6.svg" },
];

type SponsorLogoBarProps = {
  id?: string;
};

export function SponsorLogoBar({ id }: SponsorLogoBarProps) {
  return (
    <section id={id} className="surface-light bg-white">
      <div className="container py-24">
        <h2 className="reveal-heading font-heading mb-8 text-4xl font-bold leading-[1.05] sm:text-[44px]">
          Trots op onze sponsoren
        </h2>

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
            href="mailto:info@korfbalindeliemers.nl?subject=Sponsor%20worden"
            className="reveal group flex h-24 items-center justify-center gap-2 rounded-lg bg-actie-blauw font-bold text-white transition-[background-color,transform] duration-200 ease-(--ease-out-quint) hover:bg-actie-blauw/85 hover:text-white motion-safe:active:scale-[0.97]"
            style={{ "--i": sponsors.length } as React.CSSProperties}
          >
            Sponsor worden
            <span aria-hidden className="inline-block transition-transform duration-200 ease-(--ease-out-quint) group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

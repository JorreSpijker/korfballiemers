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
        <h2 className="font-heading mb-8 text-4xl font-bold leading-[1.05] sm:text-[44px]">
          Trots op onze sponsoren
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className="flex h-24 items-center justify-center rounded-lg border border-[#0F1A17]/[0.08] bg-[#F4F6F5] p-4"
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={170}
                height={70}
                className="h-auto max-h-14 w-auto object-contain grayscale transition duration-300 hover:grayscale-0"
              />
            </div>
          ))}
          <a
            href="mailto:info@korfbalindeliemers.nl?subject=Sponsor%20worden"
            className="flex h-24 items-center justify-center gap-2 rounded-lg bg-actie-blauw font-bold text-white transition-colors hover:bg-actie-blauw/85 hover:text-white"
          >
            Sponsor worden →
          </a>
        </div>
      </div>
    </section>
  );
}

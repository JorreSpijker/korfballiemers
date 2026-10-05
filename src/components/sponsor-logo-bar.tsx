import Image from "next/image";
import { Button } from "@/components/ui/button";

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
  const loopedSponsors = [...sponsors, ...sponsors];

  return (
    <section id={id} className="bg-slate-50">
      <div className="container mx-auto px-4 py-20">
        <h2 className="font-heading mb-4 flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Trots op onze sponsoren
          <span className="inline-flex">
            <Image
              src="/liemers_heart.svg"
              alt="Liemers hart"
              width={24}
              height={24}
              className="h-6 w-auto"
            />
          </span>
        </h2>

        <div className="relative overflow-hidden py-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-slate-50 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-slate-50 to-transparent" />

          <div className="sponsor-track flex w-max items-center gap-6">
            {loopedSponsors.map((sponsor, index) => (
              <div
                key={`${sponsor.name}-${index}`}
                className="flex h-24 w-52 shrink-0 items-center justify-center rounded-sm bg-white p-4 shadow-sm transition hover:shadow-lg"
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
          </div>
        </div>

        <Button asChild className="mt-4">
          <a href="mailto:info@korfbalindeliemers.nl?subject=Sponsor%20worden">Sponsor worden</a>
        </Button>
      </div>
    </section>
  );
}

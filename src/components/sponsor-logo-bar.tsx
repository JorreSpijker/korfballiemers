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
  const loopedSponsors = [...sponsors, ...sponsors];

  return (
    <section id={id} className="border-y border-border bg-white">
      <div className="container mx-auto px-4 py-8">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Trots op onze sponsoren
        </p>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent" />

          <div className="sponsor-track flex w-max items-center gap-6">
            {loopedSponsors.map((sponsor, index) => (
              <div
                key={`${sponsor.name}-${index}`}
                className="flex h-24 w-52 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-4"
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
      </div>
    </section>
  );
}

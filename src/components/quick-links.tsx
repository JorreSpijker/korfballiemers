import Link from "next/link";
import { ArrowRight, Users, HandHeart, Building2, Newspaper } from "lucide-react";

const quickLinks = [
  {
    href: "/clubs",
    label: "Bekijk clubs",
    description: "Ontdek alle korfbalclubs in de Liemers",
    icon: Building2,
  },
  {
    href: "/nieuws",
    label: "Laatste nieuws",
    description: "Blijf op de hoogte van het bid",
    icon: Newspaper,
  },
  {
    href: "/vrijwilligers",
    label: "Word vrijwilliger",
    description: "Help mee het WK mogelijk te maken",
    icon: Users,
  },
  {
    href: "/sponsor-worden",
    label: "Sponsor worden",
    description: "Steun het WK Korfbal 2027 Bid",
    icon: HandHeart,
  },
] as const;

type QuickLinksProps = {
  id?: string;
};

export function QuickLinks({ id }: QuickLinksProps) {
  return (
      <section
        id={id}
        aria-labelledby="quick-links-title"
        className="space-y-4"
      >
        <h2 id="quick-links-title" className="font-heading text-xl font-semibold leading-none">
          Snelle links
        </h2>
        <nav aria-label="Snelle links">
          <ul className="divide-y divide-border">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group flex items-start gap-3 py-4 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="rounded-md bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {link.label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
          </ul>
        </nav>
      </section>
  );
}

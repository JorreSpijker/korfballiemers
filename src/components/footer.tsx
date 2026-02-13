import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/nieuws", label: "Nieuws" },
  { href: "/clubs", label: "Clubs" },
  { href: "/vrijwilligers", label: "Vrijwilligers" },
  { href: "/sponsor-worden", label: "Sponsor worden" },
  { href: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer
      className="border-t border-border bg-muted/30"
      role="contentinfo"
    >
      <div className="container px-4 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-foreground">WK Korfbal 2027 Bid</p>
            <p className="text-sm text-muted-foreground">Regio Liemers</p>
          </div>
          <nav aria-label="Footer navigatie">
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} WK Korfbal 2027 Bid Liemers. Alle rechten voorbehouden.
        </p>
      </div>
    </footer>
  );
}

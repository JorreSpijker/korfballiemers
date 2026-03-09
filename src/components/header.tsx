"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/nieuws", label: "Nieuws" },
  { href: "/clubs", label: "Clubs" },
  { href: "/vrijwilligers", label: "Vrijwilligers" },
  { href: "/sponsor-worden", label: "Sponsor worden" },
  { href: "/contact", label: "Contact" },
] as const;

function NavLinks({
  pathname,
  isMobile = false,
  onLinkClick,
}: {
  pathname: string;
  isMobile?: boolean;
  onLinkClick?: () => void;
}) {
  const linkClass = isMobile
    ? "block px-4 py-3 text-lg font-medium transition-colors pb-3"
    : "px-3 py-2 text-sm font-medium transition-colors pb-2";

  return (
    <>
      {navItems.map(({ href, label }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onLinkClick}
            className={cn(
              linkClass,
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            )}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="container mx-auto sticky top-6 z-50">
    <header
      className="w-fit rounded-2xl shadow-2xl border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      <div className="flex h-16 items-center px-4">
          <div className="logo-container border-t-none z-navigation rounded-b-2xl ml-4 border border-solid border-neutral-20 bg-white px-4 py-2 shadow-blue lg:absolute lg:-top-6 lg:left-2 lg:border xl:left-4">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 font-semibold text-lg transition-colors"
              aria-label="Naar homepage"
            >
              <Image
                src="/korfbal-logo.svg"
                alt="Korfbal in De Liemers logo"
                width={42}
                height={42}
                priority
              />
              <span className="flex flex-col items-center text-sm leading-tight text-secondary">
                <span>Korfbal in</span>
                <span>De Liemers</span>
              </span>
            </Link>
          </div>

        {/* Desktop nav */}
        <nav
          className="ml-[200px] hidden items-center gap-1 sm:gap-2 md:flex mx-auto"
          aria-label="Hoofdnavigatie"
        >
          <NavLinks pathname={pathname} />
        </nav>

        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden ml-auto">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <SheetHeader>
              <SheetTitle className="sr-only">Navigatie</SheetTitle>
            </SheetHeader>
            <nav
              className="flex flex-col gap-1 mt-6"
              aria-label="Mobiele navigatie"
            >
              <NavLinks
                pathname={pathname}
                isMobile
                onLinkClick={() => setMobileOpen(false)}
              />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
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

const WK_DATE = new Date("2027-10-15");

function Countdown() {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const target = Math.ceil((WK_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const duration = 1500;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 ml-4 inline-flex h-fit gap-1 items-center">
      <strong className="text-sm tabular-nums">{displayed}</strong> dagen tot het WK
    </span>
  );
}

const navItems = [
  { href: "/nieuws", label: "Nieuws" },
  { href: "/wk2027", label: "WK 2027" },
  { href: "/over", label: "Wie zijn wij" },
  { href: "/sponsor-worden", label: "Sponsor worden" },
  { href: "/vrijwilligers", label: "Vrijwilligers" },
  { href: "/contact", label: "Contact" },
] as const;

function NavLinks({
  pathname,
  activeSection,
  isMobile = false,
  onLinkClick,
}: {
  pathname: string;
  activeSection?: string;
  isMobile?: boolean;
  onLinkClick?: () => void;
}) {
  const linkClass = isMobile
    ? "block px-4 py-3 text-lg font-medium transition-colors pb-3 font-heading"
    : "px-3 py-2 text-base font-medium transition-colors pb-2";

  const scrollToSection = (href: string) => {
    if (typeof window === "undefined" || !href.startsWith("#")) {
      return;
    }

    const targetId = href.slice(1);
    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth" });
    window.history.pushState(null, "", href);
  };

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      event.preventDefault();
      scrollToSection(href);
    }

    onLinkClick?.();
  };

  return (
    <>
      {navItems.map(({ href, label }) => {
        const isActive = href.startsWith("#")
          ? activeSection === href
          : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={(event) => handleNavClick(event, href)}
            className={cn(
              linkClass,
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:bg-slate-500 hover:text-white rounded-sm"
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
  const [activeSection, setActiveSection] = useState<string>(navItems[0].href);

  useEffect(() => {
    const sectionIds = navItems
      .filter((item) => item.href.startsWith("#"))
      .map((item) => item.href.slice(1));

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) {
      return;
    }

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "0px 0px -60% 0px",
      threshold: 0,
    });

    sections.forEach((section) => observer.observe(section));

    const syncHash = () => {
      const hash = window.location.hash;
      if (hash && sectionIds.includes(hash.slice(1))) {
        setActiveSection(hash);
      }
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncHash);
    };
  }, []);

  return (
    <div className="container mx-auto sticky top-6 z-50">
    <header
      className="w-full rounded-sm shadow-2xl border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      role="banner"
    >
      <div className="flex h-16 items-center px-4">
          <div className="logo-container border-t-none z-navigation rounded-b-xl ml-4 border border-solid border-neutral-20 bg-white px-2 py-2 shadow-blue lg:absolute lg:-top-7 lg:left-2 lg:border xl:left-4 h-30">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 font-semibold text-lg transition-colors flex justify-center h-full"
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
                <span>LiemersCity</span>
                <span>Korfbal</span>
              </span>
            </Link>
          </div>

        {/* Desktop nav */}

        <div className="w-full flex justify-between items-center">
          <nav
            className="ml-[140px] hidden items-center gap-1 sm:gap-2 md:flex mx-auto"
            aria-label="Hoofdnavigatie"
          >
            <NavLinks pathname={pathname} activeSection={activeSection} />
          </nav>
          <Countdown />
        </div>

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
                activeSection={activeSection}
              />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
    </div>
  );
}

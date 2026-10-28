"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MouseEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
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
    <p className="m-0 hidden sm:flex items-center gap-2.5 text-sm text-foreground/75">
      <span className="h-2 w-2 rounded-full bg-energie-groen shadow-[0_0_0_4px_rgb(34_178_76/0.2)]" aria-hidden />
      <strong className="font-heading text-lg text-white tabular-nums">{displayed}</strong> dagen tot het WK
    </p>
  );
}

const navItems = [
  { href: "#wk2027", label: "WK 2027" },
  { href: "#over", label: "Wie zijn wij" },
  { href: "#nieuws", label: "Nieuws" },
  { href: "#sponsors", label: "Sponsor worden" },
  { href: "#fotos", label: "Foto's" },
  { href: "#vrienden", label: "Vrienden worden" },
  { href: "#contact", label: "Contact" },
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
    ? "block px-4 py-3 text-lg font-medium transition-colors rounded-md"
    : "relative px-[18px] py-2.5 text-[15px] transition-colors duration-300 rounded-full";

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
    if (href.startsWith("#") && pathname === "/") {
      event.preventDefault();
      scrollToSection(href);
    }

    onLinkClick?.();
  };

  return (
    <>
      {navItems.map(({ href, label }) => {
        const isActive = pathname === "/" && activeSection === href;
        return (
          <Link
            key={href}
            href={pathname === "/" ? href : `/${href}`}
            onClick={(event) => handleNavClick(event, href)}
            data-active={isActive || undefined}
            className={cn(
              linkClass,
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? cn("font-semibold text-white hover:text-white", isMobile && "bg-accent")
                : "font-medium text-foreground hover:bg-white/5 hover:text-white"
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
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  // Meet de actieve link opnieuw bij wissel, resize en font-load
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const measure = () => {
      const active = nav.querySelector<HTMLElement>("[data-active]");
      setIndicator(active ? { left: active.offsetLeft, width: active.offsetWidth } : null);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [activeSection, pathname]);

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
    <header
      className="header-elevate sticky top-0 z-50 border-b border-transparent bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75"
      role="banner"
    >
      <div className="container flex flex-wrap items-center justify-between gap-4 py-5">
        {/* Plaatshouder houdt de headerhoogte gelijk; het logolabel hangt eruit naar beneden */}
        <div className="relative -mt-5 h-12 w-[144px] self-start lg:w-[164px]">
          <Link
            href="/"
            className="anim-drop absolute inset-x-0 top-0 flex flex-col overflow-hidden rounded-b-2xl [--d:150ms] bg-white shadow-[0_18px_36px_-14px_rgb(0_0_0/0.75)] ring-1 ring-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Naar homepage"
          >
            <span className="flex justify-center px-4 pt-5 pb-5 lg:px-5 lg:pt-6 lg:pb-6">
              <Image
                src="/logo.svg"
                alt="LiemersCity Korfbal logo"
                width={168}
                height={99}
                className="h-16 w-auto lg:h-[72px]"
                priority
              />
            </span>
            <span className="flex h-1" aria-hidden>
              <span className="flex-1 bg-energie-groen" />
              <span className="flex-1 bg-actie-blauw" />
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav
          ref={navRef}
          className="relative hidden items-center gap-1 rounded-full border bg-white/[0.03] p-1 lg:flex"
          aria-label="Hoofdnavigatie"
        >
          <span
            aria-hidden
            className="absolute inset-y-1 left-0 rounded-full bg-accent transition-[transform,width,opacity] duration-300 ease-(--ease-out-quint)"
            style={{
              transform: `translateX(${indicator?.left ?? 0}px)`,
              width: indicator?.width ?? 0,
              opacity: indicator ? 1 : 0,
            }}
          />
          <NavLinks pathname={pathname} activeSection={activeSection} />
        </nav>

        <div className="flex items-center gap-4">
          <Countdown />

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="size-11"
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
                className="flex flex-col gap-1 mt-6 px-2"
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
      </div>
    </header>
  );
}

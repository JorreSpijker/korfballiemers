"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { CONSENT_KEY } from "@/lib/site";

const OPEN_EVENT = "cookie-banner:open";
const CHANGE_EVENT = "cookie-consent:change";

type Consent = "granted" | "denied";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

function readConsent(): Consent | null {
  try {
    return localStorage.getItem(CONSENT_KEY) as Consent | null;
  } catch {
    return null;
  }
}

// Bij weigeren eerder geplaatste GA-cookies opruimen
function clearGaCookies() {
  const domain = location.hostname.replace(/^www\./, "");
  for (const cookie of document.cookie.split("; ")) {
    const name = cookie.split("=")[0];
    if (!name.startsWith("_ga")) continue;
    document.cookie = `${name}=; Max-Age=0; path=/`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
  }
}

const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-bold transition-[background-color,transform] duration-200 ease-(--ease-out-quint) motion-safe:active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function CookieBanner() {
  // Op de server "pending", zodat de banner pas na hydratie verschijnt
  const consent = useSyncExternalStore(subscribe, readConsent, () => "pending");
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const show = () => setReopened(true);
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);

  function choose(consent: Consent) {
    try {
      localStorage.setItem(CONSENT_KEY, consent);
    } catch {}
    window.gtag?.("consent", "update", { analytics_storage: consent });
    if (consent === "denied") clearGaCookies();
    window.dispatchEvent(new Event(CHANGE_EVENT));
    setReopened(false);
  }

  if (consent !== null && !reopened) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-instellingen"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-white/10 bg-surface-deep p-5 text-foreground/80 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.8)] sm:p-6"
    >
      <p className="m-0 text-[15px]">
        We gebruiken Google Analytics om te zien hoe de site gebruikt wordt. Dat doen we alleen als je
        daar toestemming voor geeft. Lees meer in onze{" "}
        <Link href="/privacy" className="text-white underline underline-offset-4">
          privacyverklaring
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => choose("granted")} className={`${buttonClass} bg-actie-blauw text-white hover:bg-actie-blauw/85`}>
          Accepteren
        </button>
        <button type="button" onClick={() => choose("denied")} className={`${buttonClass} bg-white/10 text-white hover:bg-white/15`}>
          Weigeren
        </button>
      </div>
    </div>
  );
}

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))} className={className}>
      Cookie-instellingen
    </button>
  );
}

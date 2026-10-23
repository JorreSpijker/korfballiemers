import Script from "next/script";
import { CONSENT_KEY } from "@/lib/site";

// Consent Mode v2: standaard alles geweigerd, tenzij eerder akkoord gegeven
export function GoogleAnalytics({ id }: { id: string }) {
  return (
    <>
      <Script id="ga-consent" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var stored; try { stored = localStorage.getItem("${CONSENT_KEY}"); } catch (e) {}
gtag("consent", "default", {
  analytics_storage: stored === "granted" ? "granted" : "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied"
});
gtag("js", new Date());
gtag("config", "${id}");`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="lazyOnload" />
    </>
  );
}

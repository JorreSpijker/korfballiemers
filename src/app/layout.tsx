import type { Metadata } from "next";
import { Oxanium, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { IS_PREVIEW, SITE_NAME, SITE_URL } from "@/lib/site";

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "WK Korfbal 2027 in de Liemers | LiemersCity Korfbal",
    template: "%s | LiemersCity Korfbal",
  },
  description:
    "De Liemers is hostregio van het WK Korfbal 2027. Van 15 t/m 17 oktober 2027 speelt de wereldtop van het korfbal in onze regio.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: SITE_NAME,
  },
  twitter: { card: "summary_large_image" },
  robots: IS_PREVIEW ? { index: false, follow: false } : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${oxanium.variable} ${manrope.variable}`}>
      <body
        id="top"
        className="antialiased min-h-screen flex flex-col bg-background text-[17px] leading-[1.6]"
      >
        <div className="anim-grow flex h-1" aria-hidden>
          <span className="flex-1 bg-energie-groen" />
          <span className="flex-1 bg-actie-blauw" />
        </div>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Oxanium, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

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
  title: "WK Korfbal 2027 Bid | Liemers",
  description:
    "De regio Liemers dient een bid in om het Wereldkampioenschap Korfbal 2027 te organiseren.",
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

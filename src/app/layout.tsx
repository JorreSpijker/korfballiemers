import type { Metadata } from "next";
import { Work_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
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
    <html lang="nl" className={`${workSans.variable} ${inter.variable}`}>
      <body
        className="antialiased min-h-screen flex flex-col bg-white"
      >
        <Header />
        <main className="flex-1 -mt-[66px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

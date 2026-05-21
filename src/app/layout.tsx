import type { Metadata } from "next";
import { Work_Sans, Bitter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const bitter = Bitter({
  variable: "--font-bitter",
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
    <html lang="nl" className={`${workSans.variable} ${bitter.variable}`}>
      <body
        className="antialiased min-h-screen flex flex-col bg-blue-50"
      >
        <Header />
        <main className="flex-1 -mt-[66px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

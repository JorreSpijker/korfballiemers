import { SITE_NAME, SITE_URL, WK_VENUE } from "@/lib/site";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  sport: "Korfbal",
  areaServed: ["Doesburg", "Duiven", "Westervoort", "Zevenaar"],
};

export const wkEventSchema = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "WK Korfbal 2027 in de Liemers",
  description:
    "De eerste fase van het Wereldkampioenschap Korfbal 2027 in hostregio De Liemers (Doesburg, Duiven, Westervoort en Zevenaar).",
  sport: "Korfbal",
  startDate: "2027-10-15",
  endDate: "2027-10-17",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  url: `${SITE_URL}/wk-korfbal-2027`,
  image: [`${SITE_URL}/hero.JPG`],
  location: {
    "@type": "Place",
    name: WK_VENUE.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: WK_VENUE.streetAddress,
      postalCode: WK_VENUE.postalCode,
      addressLocality: WK_VENUE.locality,
      addressCountry: "NL",
    },
  },
};

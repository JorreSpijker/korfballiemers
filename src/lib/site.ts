export const SITE_URL = "https://liemerscitykorfbal.nl";
export const SITE_NAME = "LiemersCity Korfbal";

// Vercel-previews (o.a. de testomgeving op development) niet laten indexeren
export const IS_PREVIEW = process.env.VERCEL_ENV === "preview";

export const WK_VENUE = {
  name: "Sportcentrum Triominos",
  streetAddress: "Eltensestraat 4",
  postalCode: "6922 JB",
  locality: "Duiven",
};

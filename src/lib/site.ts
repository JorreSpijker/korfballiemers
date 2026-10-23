export const SITE_URL = "https://liemerscitykorfbal.nl";
export const SITE_NAME = "LiemersCity Korfbal";

// Vercel-previews (o.a. de testomgeving op development) niet laten indexeren
export const IS_PREVIEW = process.env.VERCEL_ENV === "preview";

// Google Analytics alleen buiten previews, en alleen als het ID gezet is
export const GA_ID = IS_PREVIEW ? undefined : process.env.NEXT_PUBLIC_GA_ID;
export const CONSENT_KEY = "cookie-consent";

export const WK_VENUE = {
  name: "Sportcentrum Triominos",
  streetAddress: "Eltensestraat 4",
  postalCode: "6922 JB",
  locality: "Duiven",
};

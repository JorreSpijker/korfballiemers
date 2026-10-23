import type { MetadataRoute } from "next";
import { IS_PREVIEW, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Testomgeving (Vercel-preview) niet indexeren
  if (IS_PREVIEW) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

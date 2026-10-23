import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CSS in de HTML zetten in plaats van een render-blocking request
  experimental: {
    inlineCss: true,
  },
  images: {
    // Next 16 staat standaard alleen 75 toe; 60 voor de hero (LCP)
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

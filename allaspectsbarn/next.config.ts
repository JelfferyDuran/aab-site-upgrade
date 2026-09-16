import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Legacy short URLs that were linked site-wide; never let them 404 again.
  async redirects() {
    return [
      { source: "/barn-brew", destination: "/barn-brew-coffee-bar", permanent: true },
      { source: "/pavilion", destination: "/pavilion-party-rental", permanent: true },
      { source: "/events", destination: "/pavilion-party-rental", permanent: true },
      { source: "/weddings", destination: "/pavilion-party-rental", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.editor.website",
      },
      {
        protocol: "https",
        hostname: "**.editmysite.com",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;

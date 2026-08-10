import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Report generation runs server-side only. Bundling these would push ~3MB of
  // PDF and spreadsheet machinery into the client for a feature that never
  // touches the browser, and neither library survives the bundler intact.
  serverExternalPackages: ["@react-pdf/renderer", "exceljs"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

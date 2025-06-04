import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["img.clerk.com"], // ← Ajout du domaine autorisé
  },
};

export default nextConfig;

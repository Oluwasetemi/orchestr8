import type { NextConfig } from "next";
import coreEnv from "./lib/env";

const nextConfig: NextConfig = {
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: coreEnv.NODE_ENV === "development" ? true : undefined,
  },
  turbopack: {
    root: coreEnv.NODE_ENV === "development" ? '/Users/oluwasetemi/i/orchestr8' : undefined
  },
  reactCompiler: true,
  serverExternalPackages: [],
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/drnqdd87d/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 90],
  },
};

export default nextConfig;

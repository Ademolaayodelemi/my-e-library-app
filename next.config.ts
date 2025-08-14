import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
    ],
  },
  typescript: {
  // Allow production builds to complete even if TypeScript type errors exist.
  // This is generally NOT recommended for production but can be useful
  // during development or when migrating a large codebase.
  ignoreBuildErrors: true,
},
eslint: {
  // Skip ESLint checks during builds.
  // Useful for faster builds in CI or when lint issues are not critical.
  // However, this bypasses code quality checks, so use with caution.
  ignoreDuringBuilds: true,
},

};

export default nextConfig;

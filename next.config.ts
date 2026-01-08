import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // Ensure dynamic routes work properly
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;

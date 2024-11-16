import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "jntdnpjhkhuymazhgelp.supabase.co"
      }
    ]
  }
};

export default nextConfig;

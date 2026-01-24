import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "amsvlqivarurifjhboef.supabase.co",
        pathname: "/storage/v1/object/public/Images/**",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Blocks the site from being framed by another origin (clickjacking).
          { key: "X-Frame-Options", value: "DENY" },
          // Stops browsers from MIME-sniffing a response away from its declared type.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Only send the origin (not the full URL) as a referrer to other sites.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // No use case here for camera/mic/geolocation/etc. — opt out of all of it.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;

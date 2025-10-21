/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wfsohhlfmkbwcmbaijgu.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**", // ✅ allow all folders (logos, products, etc.)
      },
    ],
  },
};

module.exports = nextConfig;

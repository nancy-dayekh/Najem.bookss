// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jewkhodpkyqdwknnrxld.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/products-images/**',
      },
    ],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, //todo Set to false in prod
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cookierunbraverse.com',
      },
      {
        protocol: 'https',
        hostname: `${process.env.SUPABASE_STORAGE_PROJECT_ID}.supabase.co`,
      },
    ],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,//todo revert this to true during testing. Set to false in prod
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cookierunbraverse.com',
        // port: '',
        // pathname: '/account123/**',
      },
    ],
  },
};

module.exports = nextConfig;

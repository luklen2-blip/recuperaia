/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ['*.trycloudflare.com', 'localhost', '127.0.0.1'],
};

export default nextConfig;

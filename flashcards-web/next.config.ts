/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // ✅ Ensures App Router is enabled explicitly
  },
};

export default nextConfig;

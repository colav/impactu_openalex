/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  },
  images: {
    domains: ["upload.wikimedia.org", "commons.wikimedia.org"],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const backendPublicUrl = process.env.BACKEND_URL?.replace(/\/$/, "");

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    if (!backendPublicUrl) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${backendPublicUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

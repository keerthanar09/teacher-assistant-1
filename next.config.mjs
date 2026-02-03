/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  async rewrites() {
    // Only proxy in production (Vercel), not in development
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/api/:path*',
          destination: 'https://teacher-assistant-1-wga1.onrender.com/api/:path*',
        },
      ];
    }
    // In development, return empty array (no rewrites)
    return [];
  },
};

export default nextConfig;
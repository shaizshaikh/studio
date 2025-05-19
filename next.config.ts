
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Recommended for sitemap generation if not using a dynamic server.
  // If your app is fully static, this helps Next.js know about all pages.
  // For dynamic sitemaps (like ours, fetching articles), this is less critical
  // but doesn't hurt for other static pages.
  output: 'standalone', // or 'export' if fully static
};

export default nextConfig;

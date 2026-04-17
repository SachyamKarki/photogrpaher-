import type { NextConfig } from "next";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(here, "../..");

dotenv.config({ path: path.join(repoRoot, ".env") });

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline' blob: data:;
    img-src 'self' blob: data: https://cdn.sanity.io https://images.unsplash.com;
    font-src 'self' data:;
    connect-src 'self' ws: wss: https://cdn.sanity.io;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...(process.env.NODE_ENV === 'production' ? [{
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          }] : []),
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          }
        ],
      },
    ]
  },
  poweredByHeader: false,
  turbopack: {
    root: repoRoot,
  },
  images: {
    loader: 'custom',
    loaderFile: './src/lib/sanity/imageLoader.ts',
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;

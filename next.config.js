/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output configuration for containerized deployment
  output: 'standalone',
  
  experimental: {
    // Enable cutting-edge features for 2025
    optimizePackageImports: ['lucide-react'],
    // Note: ppr, serverComponentsExternalPackages, and optimizeCss require Next.js canary
    // Using stable Next.js 15.3.4 for reliable production builds
  },
  
  // Performance optimizations for Core Web Vitals
  poweredByHeader: false,
  compress: true,
  
  // Enable strict mode for modern React patterns
  reactStrictMode: true,
  
  // Advanced image optimization for portfolio showcases
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimize image loading
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Webpack optimizations for bundle size
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    
    // Tree shake unused CSS
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          styles: {
            name: 'styles',
            test: /\.(css|scss)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      }
    }
    
    return config
  },
  
  // Headers for performance and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Performance headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Cache static assets aggressively
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
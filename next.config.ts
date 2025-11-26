import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Turbopack configuration (empty to silence warning)
  turbopack: {},

  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'recharts',
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns',
    ],
  },

  // Webpack optimizations for bundle splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Split large libraries into separate chunks
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            // Recharts (charts library) - ~150KB
            recharts: {
              test: /[\\/]node_modules[\\/](recharts|d3-.*)[\\/]/,
              name: 'recharts',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Leaflet (maps library) - ~200KB
            leaflet: {
              test: /[\\/]node_modules[\\/](react-leaflet|leaflet)[\\/]/,
              name: 'leaflet',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Radix UI components - split by component
            radixDialog: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]react-dialog[\\/]/,
              name: 'radix-dialog',
              priority: 25,
              reuseExistingChunk: true,
            },
            radixDropdown: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]react-dropdown-menu[\\/]/,
              name: 'radix-dropdown',
              priority: 25,
              reuseExistingChunk: true,
            },
            radixSelect: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]react-select[\\/]/,
              name: 'radix-select',
              priority: 25,
              reuseExistingChunk: true,
            },
            radixOther: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix-ui',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Lucide icons
            lucide: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'lucide-icons',
              priority: 25,
              reuseExistingChunk: true,
            },
            // React and core libraries
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              name: 'react',
              priority: 40,
              reuseExistingChunk: true,
            },
            // Date utilities
            dateFns: {
              test: /[\\/]node_modules[\\/]date-fns[\\/]/,
              name: 'date-fns',
              priority: 25,
              reuseExistingChunk: true,
            },
            // Other vendor libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              priority: 10,
              reuseExistingChunk: true,
              minChunks: 2,
            },
          },
        },
        // Minimize runtime chunk
        runtimeChunk: {
          name: 'runtime',
        },
      };
    }

    return config;
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
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
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

export default nextConfig;

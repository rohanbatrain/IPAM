import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { LandingHeader } from '@/components/landing/landing-header';
import { HeroSection } from '@/components/landing/hero-section';
import { DeploymentComparison } from '@/components/landing/deployment-comparison';
import { AnalyticsProvider } from '@/components/landing/analytics-provider';

// Lazy load below-the-fold components for better performance
const FeaturesGrid = dynamic(() => import('@/components/landing/features-grid').then(mod => ({ default: mod.FeaturesGrid })), {
  loading: () => <FeaturesGridSkeleton />,
  ssr: true,
});

const TechStack = dynamic(() => import('@/components/landing/tech-stack').then(mod => ({ default: mod.TechStack })), {
  loading: () => <TechStackSkeleton />,
  ssr: true,
});

const CTASection = dynamic(() => import('@/components/landing/cta-section').then(mod => ({ default: mod.CTASection })), {
  loading: () => <CTASectionSkeleton />,
  ssr: true,
});

const LandingFooter = dynamic(() => import('@/components/landing/footer').then(mod => ({ default: mod.LandingFooter })), {
  loading: () => <FooterSkeleton />,
  ssr: true,
});

// SEO Metadata
export const metadata: Metadata = {
  title: 'IPAM - Modern, Free IP Address Management for Enterprise Networks',
  description:
    'Intelligent IP address management with hierarchical organization (Global → Continent → Country → Region → Host), real-time monitoring, and enterprise audit trails. Free to use on Cloud or Self-Hosted. Supports 17 countries, 53K+ regions, 13.5M IPs. Powered by the Second Brain Database.',
  keywords: [
    'IP address management',
    'IPAM software',
    'Free IPAM',
    'Network IP tracking',
    'Second Brain Database',
    'Hierarchical IP allocation',
    'Enterprise network management',
    'IP monitoring',
    'Network automation',
    'Self-hosted IPAM',
  ],
  authors: [{ name: 'Second Brain Database' }],
  creator: 'Second Brain Database',
  publisher: 'Second Brain Database',
  applicationName: 'IPAM',
  category: 'Network Management',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ipam.secondbraindatabase.com',
    siteName: 'IPAM',
    title: 'IPAM - Intelligent IP Address Management',
    description:
      'Modern, free IP address management with hierarchical organization, real-time monitoring, and audit trails. Supports 17 countries, 53K+ regions, 13.5M IPs. Powered by Second Brain Database.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IPAM - Intelligent IP Address Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IPAM - Intelligent IP Address Management',
    description:
      'Modern, free IP address management with hierarchical organization, real-time monitoring, and audit trails. Supports 17 countries, 53K+ regions, 13.5M IPs. Powered by Second Brain Database.',
    images: ['/og-image.png'],
    creator: '@SecondBrainDB',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

// Structured Data (JSON-LD)
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'IPAM',
  applicationCategory: 'NetworkApplication',
  operatingSystem: 'Web, Linux, macOS, Windows',
  description:
    'Intelligent IP address management with hierarchical organization, real-time monitoring, and enterprise audit trails. Supports 17 countries across 6 continents, 53,248 regions, and 13.5M IP addresses. Powered by the Second Brain Database.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    ratingCount: '1',
  },
  featureList: [
    'Hierarchical IP Management (Global → Continent → Country → Region → Host)',
    'Real-Time Monitoring with 30-second polling',
    'Geographic Visualization with OpenStreetMap',
    'Advanced Search & Filtering',
    'Batch Operations (up to 100 hosts)',
    'Enterprise Audit Trail',
    'Team Collaboration with comments',
    'JWT Authentication',
    'Keyboard Shortcuts & Command Palette',
    'Mobile Optimized',
    'WCAG 2.1 AA Compliant',
    'Performance Optimized',
  ],
  screenshot: '/screenshot.png',
  softwareVersion: '1.0.0',
  author: {
    '@type': 'Organization',
    name: 'Second Brain Database',
    url: 'https://secondbraindatabase.com',
  },
  provider: {
    '@type': 'Organization',
    name: 'Second Brain Database',
    url: 'https://secondbraindatabase.com',
  },
  installUrl: 'https://ipam.secondbraindatabase.com/login',
  downloadUrl: 'https://github.com/rohanbatrain/ipam',
  softwareHelp: {
    '@type': 'WebPage',
    url: 'https://ipam.secondbraindatabase.com/docs',
  },
};

export default function Home() {
  return (
    <>
      {/* Preload critical assets */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <AnalyticsProvider>
        <LandingHeader />
        <main className="min-h-screen">
          <HeroSection />
          <div id="deployment">
            <DeploymentComparison />
          </div>
          <div id="features">
            <FeaturesGrid />
          </div>
          <div id="tech-stack">
            <TechStack />
          </div>
          <CTASection />
          <LandingFooter />
        </main>
      </AnalyticsProvider>
    </>
  );
}

// Loading skeletons for lazy-loaded components
function FeaturesGridSkeleton() {
  return (
    <section className="py-20" aria-label="Loading features">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 h-10 w-96 max-w-full animate-pulse rounded-lg bg-muted" />
            <div className="mx-auto h-6 w-64 max-w-full animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-6">
                <div className="mb-4 h-12 w-12 animate-pulse rounded-lg bg-muted" />
                <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TechStackSkeleton() {
  return (
    <section className="py-20 bg-muted/30" aria-label="Loading technical specifications">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 h-10 w-96 max-w-full animate-pulse rounded-lg bg-muted" />
            <div className="mx-auto h-6 w-64 max-w-full animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-6">
                <div className="mb-4 h-6 w-32 animate-pulse rounded bg-muted" />
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className="h-4 w-full animate-pulse rounded bg-muted" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-lg border bg-card p-6">
            <div className="mb-4 h-6 w-48 animate-pulse rounded bg-muted" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASectionSkeleton() {
  return (
    <section className="py-20" aria-label="Loading call to action">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/5 to-pink-500/5 p-8 text-center md:p-12">
            <div className="mx-auto mb-4 h-12 w-96 max-w-full animate-pulse rounded-lg bg-muted" />
            <div className="mx-auto mb-8 h-6 w-80 max-w-full animate-pulse rounded-lg bg-muted" />
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 w-full sm:w-48 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 w-32 animate-pulse rounded bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterSkeleton() {
  return (
    <footer className="border-t bg-muted/30 py-12" aria-label="Loading footer">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 w-24 animate-pulse rounded bg-muted" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-4 w-32 animate-pulse rounded bg-muted" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t pt-8 text-center">
          <div className="mx-auto h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </footer>
  );
}

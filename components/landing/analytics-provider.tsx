'use client';

import { useScrollTracking } from '@/lib/hooks/use-scroll-tracking';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

/**
 * Client component that wraps the landing page to provide analytics tracking
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  // Track scroll depth at 25%, 50%, 75%, and 100%
  // Track visibility of key sections
  // Track time spent on page
  useScrollTracking({
    depthMilestones: [25, 50, 75, 100],
    sectionIds: [
      'hero-section',
      'deployment-comparison',
      'features-section',
      'tech-stack-section',
      'cta-section',
    ],
    trackTime: true,
  });

  return <>{children}</>;
}

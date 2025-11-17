'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Loading fallback component
const ChartSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-[300px] w-full" />
  </div>
);

// Lazy load chart components with loading states
export const AnalyticsUtilizationTrend = dynamic(
  () => import('./analytics-utilization-trend').then((mod) => ({ default: mod.UtilizationTrendChart })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false, // Disable SSR for charts (client-side only)
  }
);

export const AnalyticsStatusDistribution = dynamic(
  () => import('./analytics-status-distribution').then((mod) => ({ default: mod.StatusDistributionChart })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

export const AnalyticsContinentCapacity = dynamic(
  () => import('./analytics-continent-capacity').then((mod) => ({ default: mod.ContinentCapacityChart })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

export const AnalyticsTopCountries = dynamic(
  () => import('./analytics-top-countries').then((mod) => ({ default: mod.TopCountriesChart })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

export const CapacityPlanning = dynamic(
  () => import('./capacity-planning').then((mod) => ({ default: mod.CapacityPlanning })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

export const UtilizationChart = dynamic(
  () => import('./utilization-chart').then((mod) => ({ default: mod.UtilizationChart })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

export const AllocationTimeline = dynamic(
  () => import('./allocation-timeline').then((mod) => ({ default: mod.AllocationTimeline })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

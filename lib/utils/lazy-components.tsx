/**
 * Centralized lazy loading configuration for heavy components
 * 
 * This module provides a single source of truth for all dynamically imported
 * components, improving bundle size and initial load performance.
 * 
 * Usage:
 * ```tsx
 * import { LazyMapView } from '@/lib/utils/lazy-components';
 * 
 * export default function MapPage() {
 *   return <LazyMapView />;
 * }
 * ```
 */

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================================
// CHART COMPONENTS (~150KB total when bundled with Recharts)
// ============================================================================

export const LazyUtilizationChart = dynamic(
  () => import('@/components/ipam/utilization-chart').then((mod) => ({ default: mod.UtilizationChart })),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false,
  }
);

export const LazyAnalyticsUtilizationTrend = dynamic(
  () => import('@/components/ipam/analytics-utilization-trend').then((mod) => ({ default: mod.UtilizationTrendChart })),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false,
  }
);

export const LazyAnalyticsStatusDistribution = dynamic(
  () => import('@/components/ipam/analytics-status-distribution').then((mod) => ({ default: mod.StatusDistributionChart })),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false,
  }
);

export const LazyAnalyticsContinentCapacity = dynamic(
  () => import('@/components/ipam/analytics-continent-capacity').then((mod) => ({ default: mod.ContinentCapacityChart })),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false,
  }
);

export const LazyAnalyticsTopCountries = dynamic(
  () => import('@/components/ipam/analytics-top-countries').then((mod) => ({ default: mod.TopCountriesChart })),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false,
  }
);

export const LazyCapacityPlanning = dynamic(
  () => import('@/components/ipam/capacity-planning').then((mod) => ({ default: mod.CapacityPlanning })),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false,
  }
);

export const LazyAllocationTimeline = dynamic(
  () => import('@/components/ipam/allocation-timeline').then((mod) => ({ default: mod.AllocationTimeline })),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false,
  }
);

// ============================================================================
// MAP COMPONENTS (~200KB with Leaflet)
// ============================================================================

export const LazyMapView = dynamic(
  () => import('@/components/ipam/map-view').then((mod) => ({ default: mod.MapView })),
  {
    loading: () => <Skeleton className="h-[600px] w-full rounded-lg" />,
    ssr: false, // Leaflet requires window object
  }
);

export const LazyMapLegend = dynamic(
  () => import('@/components/ipam/map-legend').then((mod) => ({ default: mod.MapLegend })),
  {
    loading: () => <Skeleton className="h-32 w-full" />,
    ssr: false,
  }
);

// ============================================================================
// DIALOG COMPONENTS (loaded on-demand)
// ============================================================================

export const LazyExportDialog = dynamic(
  () => import('@/components/dialogs/export-dialog').then((mod) => ({ default: mod.ExportDialog })),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
  }
);

export const LazyImportDialog = dynamic(
  () => import('@/components/dialogs/import-dialog').then((mod) => ({ default: mod.ImportDialog })),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
  }
);

export const LazyBulkTagEditor = dynamic(
  () => import('@/components/dialogs/bulk-tag-editor').then((mod) => ({ default: mod.BulkTagEditor })),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
  }
);

export const LazyAnalyticsExportDialog = dynamic(
  () => import('@/components/ipam/analytics-export-dialog').then((mod) => ({ default: mod.AnalyticsExportDialog })),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
  }
);

// ============================================================================
// COMPLEX FORM COMPONENTS
// ============================================================================

export const LazyBatchHostForm = dynamic(
  () => import('@/components/forms/batch-host-form').then((mod) => ({ default: mod.BatchHostForm })),
  {
    loading: () => <Skeleton className="h-[500px] w-full" />,
  }
);

export const LazyImportForm = dynamic(
  () => import('@/components/forms/import-form').then((mod) => ({ default: mod.ImportForm })),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
  }
);

// ============================================================================
// VISUALIZATION COMPONENTS
// ============================================================================

export const LazyIPHierarchyTree = dynamic(
  () => import('@/components/ipam/ip-hierarchy-tree').then((mod) => ({ default: mod.IPHierarchyTree })),
  {
    loading: () => <Skeleton className="h-[500px] w-full" />,
    ssr: false,
  }
);

export const LazyAuditLogViewer = dynamic(
  () => import('@/components/ipam/audit-log-viewer').then((mod) => ({ default: mod.AuditLogViewer })),
  {
    loading: () => <Skeleton className="h-[600px] w-full" />,
  }
);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Preload a component for better UX
 * Call this on hover or route prefetch
 */
export const preloadComponent = (componentName: keyof typeof componentPreloaders) => {
  const preloader = componentPreloaders[componentName];
  if (preloader) {
    preloader();
  }
};

const componentPreloaders = {
  map: () => import('@/components/ipam/map-view'),
  charts: () => Promise.all([
    import('@/components/ipam/utilization-chart'),
    import('@/components/ipam/analytics-utilization-trend'),
  ]),
  analytics: () => Promise.all([
    import('@/components/ipam/analytics-status-distribution'),
    import('@/components/ipam/analytics-continent-capacity'),
    import('@/components/ipam/analytics-top-countries'),
  ]),
  export: () => import('@/components/dialogs/export-dialog'),
  import: () => import('@/components/dialogs/import-dialog'),
};

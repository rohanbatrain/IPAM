'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Loading fallback for map
const MapSkeleton = () => (
  <Card>
    <CardHeader>
      <CardTitle>Geographic Distribution</CardTitle>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[600px] w-full rounded-lg" />
      <div className="mt-4 flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </CardContent>
  </Card>
);

// Lazy load map component (Leaflet is heavy ~200KB)
export const MapView = dynamic(
  () => import('./map-view').then((mod) => ({ default: mod.MapView })),
  {
    loading: () => <MapSkeleton />,
    ssr: false, // Maps must be client-side only
  }
);

export const MapLegend = dynamic(
  () => import('./map-legend').then((mod) => ({ default: mod.MapLegend })),
  {
    loading: () => <Skeleton className="h-32 w-full" />,
    ssr: false,
  }
);

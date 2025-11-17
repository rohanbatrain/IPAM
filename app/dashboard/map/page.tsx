'use client';

import { useState, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useCountries } from '@/lib/hooks/use-countries';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, MapPin, TrendingUp } from 'lucide-react';

// Dynamic import to avoid SSR issues with Leaflet
const MapView = dynamic(
  () => import('@/components/ipam/map-view').then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full rounded-lg" />,
  }
);

// Country coordinates (approximate centers)
const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  'United States': [37.0902, -95.7129],
  'Canada': [56.1304, -106.3468],
  'Mexico': [23.6345, -102.5528],
  'Brazil': [-14.2350, -51.9253],
  'Argentina': [-38.4161, -63.6167],
  'United Kingdom': [55.3781, -3.4360],
  'France': [46.2276, 2.2137],
  'Germany': [51.1657, 10.4515],
  'Spain': [40.4637, -3.7492],
  'Italy': [41.8719, 12.5674],
  'Russia': [61.5240, 105.3188],
  'China': [35.8617, 104.1954],
  'Japan': [36.2048, 138.2529],
  'India': [20.5937, 78.9629],
  'Australia': [-25.2744, 133.7751],
  'South Africa': [-30.5595, 22.9375],
  'Egypt': [26.8206, 30.8025],
  'Nigeria': [9.0820, 8.6753],
  'Kenya': [-0.0236, 37.9062],
  'Saudi Arabia': [23.8859, 45.0792],
  'UAE': [23.4241, 53.8478],
  'Singapore': [1.3521, 103.8198],
  'South Korea': [35.9078, 127.7669],
  'Thailand': [15.8700, 100.9925],
  'Indonesia': [-0.7893, 113.9213],
  'Philippines': [12.8797, 121.7740],
  'Vietnam': [14.0583, 108.2772],
  'Malaysia': [4.2105, 101.9758],
  'Turkey': [38.9637, 35.2433],
  'Poland': [51.9194, 19.1451],
  'Netherlands': [52.1326, 5.2913],
  'Belgium': [50.5039, 4.4699],
  'Sweden': [60.1282, 18.6435],
  'Norway': [60.4720, 8.4689],
  'Denmark': [56.2639, 9.5018],
  'Finland': [61.9241, 25.7482],
  'Switzerland': [46.8182, 8.2275],
  'Austria': [47.5162, 14.5501],
  'Greece': [39.0742, 21.8243],
  'Portugal': [39.3999, -8.2245],
  'Ireland': [53.4129, -8.2439],
  'New Zealand': [-40.9006, 174.8860],
  'Chile': [-35.6751, -71.5430],
  'Colombia': [4.5709, -74.2973],
  'Peru': [-9.1900, -75.0152],
  'Venezuela': [6.4238, -66.5897],
  'Ukraine': [48.3794, 31.1656],
  'Czech Republic': [49.8175, 15.4730],
  'Romania': [45.9432, 24.9668],
  'Hungary': [47.1625, 19.5033],
};

type LayerType = 'utilization' | 'allocation' | 'growth';

export default function MapPage() {
  const { data, isLoading, error } = useCountries();
  const [activeLayer, setActiveLayer] = useState<LayerType>('utilization');

  const mapData = useMemo(() => {
    if (!data) return [];

    return data
      .filter((country) => COUNTRY_COORDINATES[country.country])
      .map((country) => ({
        country: country.country,
        continent: country.continent,
        coordinates: COUNTRY_COORDINATES[country.country],
        allocatedRegions: country.allocated_regions,
        totalCapacity: country.total_capacity,
        utilization: country.utilization_percentage,
        allocatedHosts: 0, // Would come from aggregated data
      }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load map data</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Geographic Map</h1>
        <p className="text-muted-foreground mt-2">
          Visualize IP allocations across the globe
        </p>
      </div>

      {/* Layer Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Map Layers
          </CardTitle>
          <CardDescription>
            Select a layer to visualize different metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeLayer === 'utilization' ? 'default' : 'outline'}
              onClick={() => setActiveLayer('utilization')}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Utilization
            </Button>
            <Button
              variant={activeLayer === 'allocation' ? 'default' : 'outline'}
              onClick={() => setActiveLayer('allocation')}
              className="flex items-center gap-2"
            >
              <Layers className="h-4 w-4" />
              Allocation Count
            </Button>
            <Button
              variant={activeLayer === 'growth' ? 'default' : 'outline'}
              onClick={() => setActiveLayer('growth')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Growth Rate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardContent className="p-6">
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <MapView data={mapData} activeLayer={activeLayer} />
          </Suspense>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          {activeLayer === 'utilization' && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500" />
                <span className="text-sm">Low Utilization (&lt; 50%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-500" />
                <span className="text-sm">Medium Utilization (50-80%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500" />
                <span className="text-sm">High Utilization (&gt; 80%)</span>
              </div>
            </div>
          )}
          {activeLayer === 'allocation' && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500" />
                <span className="text-sm">Low Allocation (&lt; 30%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500" />
                <span className="text-sm">Medium Allocation (30-70%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-pink-500" />
                <span className="text-sm">High Allocation (&gt; 70%)</span>
              </div>
            </div>
          )}
          {activeLayer === 'growth' && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500" />
                <span className="text-sm">Growth Rate (simulated data)</span>
              </div>
            </div>
          )}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Marker size represents the number of allocated regions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Countries on Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mapData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mapData.reduce((sum, c) => sum + c.allocatedRegions, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Avg Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mapData.length > 0
                ? (mapData.reduce((sum, c) => sum + c.utilization, 0) / mapData.length).toFixed(1)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

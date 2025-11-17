'use client';

import { useState } from 'react';
import { useRegions } from '@/lib/hooks/use-regions';
import { RegionCard } from './region-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export function RegionList() {
  const { data, isLoading, error } = useRegions();
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-80" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load regions</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  const regions = data?.results || [];

  if (regions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No regions allocated yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Create your first region to get started
        </p>
      </div>
    );
  }

  // Filter regions by search term
  const filteredRegions = regions.filter(
    (region) =>
      region.region_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.cidr.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search regions by name, country, or CIDR..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          {filteredRegions.length} {filteredRegions.length === 1 ? 'region' : 'regions'}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRegions.map((region) => (
          <RegionCard
            key={region.region_id}
            region={region}
            onClick={() => router.push(`/dashboard/regions/${region.region_id}`)}
          />
        ))}
      </div>

      {filteredRegions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No regions match your search</p>
        </div>
      )}
    </div>
  );
}

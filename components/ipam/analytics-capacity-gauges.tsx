'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularCapacityGauge } from './circular-capacity-gauge';
import { CapacityGauge } from './capacity-gauge';
import { Skeleton } from '@/components/ui/skeleton';
import apiClient from '@/lib/api/client';

interface CapacityData {
  total_countries: number;
  allocated_countries: number;
  total_regions_capacity: number;
  allocated_regions: number;
  total_hosts_capacity: number;
  allocated_hosts: number;
}

async function getCapacityData(): Promise<CapacityData> {
  const response = await apiClient.get('/ipam/analytics/capacity');
  return response.data;
}

export function AnalyticsCapacityGauges() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', 'capacity'],
    queryFn: getCapacityData,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-32 rounded-full mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Failed to load capacity data
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Circular Gauges */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Countries Capacity */}
        <Card>
          <CardHeader>
            <CardTitle>Countries</CardTitle>
            <CardDescription>Geographic coverage</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CircularCapacityGauge
              allocated={data.allocated_countries}
              total={data.total_countries}
              label="Countries"
              size={140}
            />
          </CardContent>
        </Card>

        {/* Regions Capacity */}
        <Card>
          <CardHeader>
            <CardTitle>Regions</CardTitle>
            <CardDescription>/24 blocks allocated</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CircularCapacityGauge
              allocated={data.allocated_regions}
              total={data.total_regions_capacity}
              label="Regions"
              size={140}
            />
          </CardContent>
        </Card>

        {/* Hosts Capacity */}
        <Card>
          <CardHeader>
            <CardTitle>Hosts</CardTitle>
            <CardDescription>IP addresses allocated</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CircularCapacityGauge
              allocated={data.allocated_hosts}
              total={data.total_hosts_capacity}
              label="Hosts"
              size={140}
            />
          </CardContent>
        </Card>
      </div>

      {/* Linear Gauges */}
      <Card>
        <CardHeader>
          <CardTitle>Capacity Overview</CardTitle>
          <CardDescription>Detailed allocation breakdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CapacityGauge
            allocated={data.allocated_countries}
            total={data.total_countries}
            label="Countries"
            size="lg"
          />
          <CapacityGauge
            allocated={data.allocated_regions}
            total={data.total_regions_capacity}
            label="Regions (/24 blocks)"
            size="lg"
          />
          <CapacityGauge
            allocated={data.allocated_hosts}
            total={data.total_hosts_capacity}
            label="Hosts (IP addresses)"
            size="lg"
          />
        </CardContent>
      </Card>
    </div>
  );
}

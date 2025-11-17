'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCountry } from '@/lib/hooks/use-countries';
import { useRegions } from '@/lib/hooks/use-regions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatPercentage, formatNumber, getUtilizationBadgeVariant, formatDate, getStatusBadgeVariant, getProgressBarWidth } from '@/lib/utils/format';
import { formatIPRange } from '@/lib/utils/ip-utils';
import { ArrowLeft } from 'lucide-react';

export default function CountryDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const country = params.country as string;

  const { data: countryData, isLoading: countryLoading, error: countryError } = useCountry(country);
  const { data: regionsData, isLoading: regionsLoading } = useRegions({ country });

  if (countryLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (countryError || !countryData) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load country details</p>
          <p className="text-sm text-muted-foreground mt-2">
            {countryError instanceof Error ? countryError.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  const regions = regionsData?.results || [];
  const totalCapacity = countryData.total_capacity || 0;
  const allocatedRegions = countryData.allocated_regions ?? 0;
  const availableRegions = totalCapacity - allocatedRegions;
  const utilizationPercentage = countryData.utilization_percentage ?? 0;

  // Group regions by X value for utilization breakdown
  const regionsByX = regions.reduce(
    (acc, region) => {
      const x = region.x_octet;
      if (x !== undefined && x !== null) {
        if (!acc[x]) {
          acc[x] = [];
        }
        acc[x].push(region);
      }
      return acc;
    },
    {} as Record<number, typeof regions>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">{countryData.country}</h2>
          </div>
          <p className="text-muted-foreground ml-12">{countryData.continent}</p>
        </div>
        <Badge variant={getUtilizationBadgeVariant(utilizationPercentage)} className="text-lg px-4 py-2">
          {formatPercentage(utilizationPercentage)}
        </Badge>
      </div>

      {/* Country Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Country Information</CardTitle>
          <CardDescription>IP address allocation details and metadata</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">IP Range (X Octet)</p>
              <code className="text-lg font-mono">{formatIPRange(countryData.x_start, countryData.x_end)}</code>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Capacity</p>
              <p className="text-2xl font-bold">{formatNumber(totalCapacity)}</p>
              <p className="text-xs text-muted-foreground">regions</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Allocated Regions</p>
              <p className="text-2xl font-bold">
                {allocatedRegions} / {totalCapacity}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Available Regions</p>
              <p className="text-2xl font-bold">{availableRegions}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capacity Gauge */}
      <Card>
        <CardHeader>
          <CardTitle>Capacity Utilization</CardTitle>
          <CardDescription>IP address allocation status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{formatPercentage(utilizationPercentage)}</span>
              <Badge variant={
                utilizationPercentage < 50 ? 'default' :
                utilizationPercentage < 80 ? 'secondary' : 'destructive'
              }>
                {utilizationPercentage < 50 ? 'Healthy' :
                 utilizationPercentage < 80 ? 'Moderate' : 'High'}
              </Badge>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  utilizationPercentage < 50
                    ? 'bg-green-500'
                    : utilizationPercentage < 80
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ 
                  width: `${getProgressBarWidth(utilizationPercentage)}%`,
                  minWidth: utilizationPercentage > 0 ? '2px' : '0'
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{availableRegions}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{allocatedRegions}</p>
                <p className="text-xs text-muted-foreground">Allocated</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCapacity}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Utilization Breakdown by X Value */}
      {Object.keys(regionsByX).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Utilization Breakdown by X Value</CardTitle>
            <CardDescription>Region allocation grouped by first octet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(regionsByX)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([xValue, xRegions]) => {
                  const totalRegions = xRegions.length;
                  const avgUtilization =
                    xRegions.reduce((sum, r) => sum + (r.utilization_percentage ?? 0), 0) / totalRegions;

                  return (
                    <div key={xValue} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            10.{xValue}.x.x
                          </code>
                          <span className="text-sm text-muted-foreground">
                            {totalRegions} {totalRegions === 1 ? 'region' : 'regions'}
                          </span>
                        </div>
                        <Badge variant={getUtilizationBadgeVariant(avgUtilization)}>
                          {formatPercentage(avgUtilization)} avg
                        </Badge>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            avgUtilization < 50
                              ? 'bg-green-500'
                              : avgUtilization < 80
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{ 
                            width: `${getProgressBarWidth(avgUtilization)}%`,
                            minWidth: avgUtilization > 0 ? '2px' : '0'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Allocated Regions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Allocated Regions</h3>
            <p className="text-sm text-muted-foreground">
              {regions.length} {regions.length === 1 ? 'region' : 'regions'} in this country
            </p>
          </div>
          <Button onClick={() => router.push(`/dashboard/regions/create?country=${country}`)}>
            Create Region
          </Button>
        </div>

        {regions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No regions allocated in this country yet</p>
              <Button
                className="mt-4"
                onClick={() => router.push(`/dashboard/regions/create?country=${country}`)}
              >
                Create First Region
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CIDR Block</TableHead>
                  <TableHead>Region Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regions.map((region) => (
                  <TableRow
                    key={region.region_id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/dashboard/regions/${region.region_id}`)}
                  >
                    <TableCell>
                      <code className="text-sm font-mono">{region.cidr}</code>
                    </TableCell>
                    <TableCell className="font-medium">{region.region_name}</TableCell>
                    <TableCell>{region.owner_name || region.owner || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{formatPercentage(region.utilization_percentage ?? 0)}</span>
                        <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              (region.utilization_percentage ?? 0) < 50
                                ? 'bg-green-500'
                                : (region.utilization_percentage ?? 0) < 80
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${getProgressBarWidth(region.utilization_percentage ?? 0)}%`,
                              minWidth: (region.utilization_percentage ?? 0) > 0 ? '2px' : '0'
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(region.status)}>{region.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(region.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

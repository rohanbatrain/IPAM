'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CountryUtilization } from '@/lib/api/dashboard';

interface UtilizationChartProps {
  data: CountryUtilization[];
  title?: string;
  description?: string;
}

export function UtilizationChart({
  data,
  title = 'Top Countries by Allocation',
  description = 'Countries with the highest number of allocated regions',
}: UtilizationChartProps) {
  const getUtilizationColor = (util: number) => {
    if (util < 50) return 'bg-green-500';
    if (util < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getUtilizationBadge = (util: number) => {
    if (util < 50) return { variant: 'default' as const, label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    if (util < 80) return { variant: 'secondary' as const, label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    return { variant: 'destructive' as const, label: 'High', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
  };

  const maxRegions = Math.max(...data.map((d) => d.allocated_regions), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No data available
            </div>
          ) : (
            data.map((country) => {
              const widthPercentage = (country.allocated_regions / maxRegions) * 100;
              const badge = getUtilizationBadge(country.utilization_percentage);

              return (
                <div key={country.country} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{country.country}</span>
                      <span className="text-muted-foreground text-xs">
                        ({country.continent})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {country.allocated_regions} regions
                      </span>
                      <Badge
                        variant={badge.variant}
                        className="text-xs"
                        title={`${(country.utilization_percentage ?? 0).toFixed(1)}% utilized`}
                      >
                        {(country.utilization_percentage ?? 0).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full ${getUtilizationColor(
                        country.utilization_percentage
                      )} transition-all duration-300`}
                      style={{ width: `${widthPercentage}%` }}
                      title={`${country.allocated_regions} regions (${(country.utilization_percentage ?? 0).toFixed(1)}% utilized)`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

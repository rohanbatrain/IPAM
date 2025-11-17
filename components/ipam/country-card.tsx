'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPercentage, formatNumber, getUtilizationBadgeVariant, getProgressBarWidth } from '@/lib/utils/format';
import { formatIPRange } from '@/lib/utils/ip-utils';
import type { Country } from '@/lib/types/ipam';

interface CountryCardProps {
  country: Country;
  onClick?: () => void;
}

export function CountryCard({ country, onClick }: CountryCardProps) {
  const utilizationPercentage = country.utilization_percentage ?? 0;
  
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{country.country}</CardTitle>
            <CardDescription>{country.continent}</CardDescription>
          </div>
          <Badge variant={getUtilizationBadgeVariant(utilizationPercentage)}>
            {formatPercentage(utilizationPercentage)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">IP Range:</span>
          <code className="text-xs">{formatIPRange(country.x_start, country.x_end)}</code>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Capacity:</span>
          <span className="font-medium">{formatNumber(country.total_capacity)} IPs</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Regions:</span>
          <span className="font-medium">{country.allocated_regions}</span>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Utilization</span>
            <span>{formatPercentage(utilizationPercentage)}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
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
        </div>
      </CardContent>
    </Card>
  );
}

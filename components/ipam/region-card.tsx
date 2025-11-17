'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPercentage, formatDate, getStatusBadgeVariant, getProgressBarWidth } from '@/lib/utils/format';
import { formatOwner } from '@/lib/utils/owner-utils';
import type { Region } from '@/lib/types/ipam';

interface RegionCardProps {
  region: Region;
  onClick?: () => void;
}

export function RegionCard({ region, onClick }: RegionCardProps) {
  const utilizationPercentage = region.utilization_percentage ?? 0;
  
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{region.region_name}</CardTitle>
            <CardDescription>{region.country}</CardDescription>
          </div>
          <Badge variant={getStatusBadgeVariant(region.status)}>{region.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">CIDR:</span>
          <code className="text-xs font-mono">{region.cidr}</code>
        </div>

        {(region.owner || region.owner_name) && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Owner:</span>
            <span className="font-medium">{formatOwner(region.owner || region.owner_name)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Hosts:</span>
          <span className="font-medium">
            {region.allocated_hosts ?? 0} / 254
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Created:</span>
          <span className="text-xs">{formatDate(region.created_at)}</span>
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

        {region.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{region.description}</p>
        )}
      </CardContent>
    </Card>
  );
}

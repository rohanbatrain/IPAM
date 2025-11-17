'use client';

import { AlertTriangle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCapacityWarnings } from '@/lib/hooks/use-capacity-warnings';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CapacityWarningBadgeProps {
  utilization: number;
  showIcon?: boolean;
  showPercentage?: boolean;
}

export function CapacityWarningBadge({
  utilization,
  showIcon = true,
  showPercentage = true,
}: CapacityWarningBadgeProps) {
  const {
    getCapacityBadgeVariant,
    getCapacityWarningMessage,
    shouldShowCapacityWarning,
  } = useCapacityWarnings();

  if (!shouldShowCapacityWarning(utilization)) {
    return null;
  }

  const variant = getCapacityBadgeVariant(utilization);
  const message = getCapacityWarningMessage(utilization);
  const isCritical = utilization >= 90;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={variant} className="gap-1">
            {showIcon && (
              isCritical ? (
                <AlertCircle className="h-3 w-3" />
              ) : (
                <AlertTriangle className="h-3 w-3" />
              )
            )}
            {showPercentage && `${utilization}%`}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

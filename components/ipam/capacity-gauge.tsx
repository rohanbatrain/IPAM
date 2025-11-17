'use client';

import { cn } from '@/lib/utils/cn';

interface CapacityGaugeProps {
  allocated: number;
  total: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  showNumbers?: boolean;
  className?: string;
}

export function CapacityGauge({
  allocated,
  total,
  label,
  size = 'md',
  showPercentage = true,
  showNumbers = true,
  className,
}: CapacityGaugeProps) {
  const available = total - allocated;
  const utilizationPercentage = total > 0 ? (allocated / total) * 100 : 0;

  // Determine color based on utilization level
  const getUtilizationColor = () => {
    if (utilizationPercentage >= 80) return 'text-red-600 dark:text-red-400';
    if (utilizationPercentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getBarColor = () => {
    if (utilizationPercentage >= 80) return 'bg-red-500';
    if (utilizationPercentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const sizeClasses = {
    sm: {
      container: 'h-2',
      text: 'text-xs',
      spacing: 'space-y-1',
    },
    md: {
      container: 'h-4',
      text: 'text-sm',
      spacing: 'space-y-2',
    },
    lg: {
      container: 'h-6',
      text: 'text-base',
      spacing: 'space-y-3',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={cn('w-full', currentSize.spacing, className)}>
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className={cn('font-medium', currentSize.text)}>{label}</span>
          )}
          {showPercentage && (
            <span className={cn('font-semibold', currentSize.text, getUtilizationColor())}>
              {utilizationPercentage.toFixed(1)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className={cn('w-full bg-muted rounded-full overflow-hidden', currentSize.container)}>
        <div
          className={cn('h-full transition-all duration-500 ease-out', getBarColor())}
          style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
        />
      </div>

      {/* Numbers */}
      {showNumbers && (
        <div className={cn('flex items-center justify-between text-muted-foreground', currentSize.text)}>
          <span>
            Allocated: <span className="font-medium text-foreground">{allocated.toLocaleString()}</span>
          </span>
          <span>
            Available: <span className="font-medium text-foreground">{available.toLocaleString()}</span>
          </span>
        </div>
      )}
    </div>
  );
}

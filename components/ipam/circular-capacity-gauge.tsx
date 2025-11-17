'use client';

import { cn } from '@/lib/utils/cn';

interface CircularCapacityGaugeProps {
  allocated: number;
  total: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  className?: string;
}

export function CircularCapacityGauge({
  allocated,
  total,
  label,
  size = 120,
  strokeWidth = 12,
  showPercentage = true,
  className,
}: CircularCapacityGaugeProps) {
  const utilizationPercentage = total > 0 ? (allocated / total) * 100 : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (utilizationPercentage / 100) * circumference;

  // Determine color based on utilization level
  const getStrokeColor = () => {
    if (utilizationPercentage >= 80) return '#ef4444'; // red-500
    if (utilizationPercentage >= 50) return '#eab308'; // yellow-500
    return '#22c55e'; // green-500
  };

  const getTextColor = () => {
    if (utilizationPercentage >= 80) return 'text-red-600 dark:text-red-400';
    if (utilizationPercentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Circular Progress */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercentage && (
            <span className={cn('text-2xl font-bold', getTextColor())}>
              {utilizationPercentage.toFixed(0)}%
            </span>
          )}
          {label && (
            <span className="text-xs text-muted-foreground mt-1">{label}</span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="text-center space-y-1">
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Allocated: </span>
            <span className="font-medium">{allocated.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total: </span>
            <span className="font-medium">{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

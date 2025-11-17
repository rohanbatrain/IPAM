import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StatsWidgetProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  utilization?: number; // 0-100 percentage for color coding
  className?: string;
}

export function StatsWidget({
  title,
  value,
  description,
  icon: Icon,
  trend,
  utilization,
  className,
}: StatsWidgetProps) {
  // Color code based on utilization level
  const getUtilizationColor = (util: number) => {
    if (util < 50) return 'text-green-600 dark:text-green-400';
    if (util < 80) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getUtilizationBadge = (util: number) => {
    if (util < 50) return { variant: 'default' as const, label: 'Low' };
    if (util < 80) return { variant: 'secondary' as const, label: 'Medium' };
    return { variant: 'destructive' as const, label: 'High' };
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div
            className={cn(
              'text-2xl font-bold',
              utilization !== undefined && getUtilizationColor(utilization)
            )}
          >
            {value}
          </div>
          {utilization !== undefined && (
            <Badge variant={getUtilizationBadge(utilization).variant} className="ml-2">
              {getUtilizationBadge(utilization).label}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2 text-xs">
            <span
              className={cn(
                'font-medium',
                trend.value > 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.value > 0 ? '+' : ''}
              {trend.value}%
            </span>
            <span className="text-muted-foreground ml-1">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

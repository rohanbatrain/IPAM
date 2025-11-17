'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, TrendingUp, Calendar, Lightbulb } from 'lucide-react';
import { format, addDays, parseISO } from 'date-fns';
import apiClient from '@/lib/api/client';

interface CapacityForecast {
  resource_type: 'country' | 'region' | 'host';
  resource_name: string;
  current_utilization: number;
  daily_growth_rate: number;
  estimated_exhaustion_days: number | null;
  estimated_exhaustion_date: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

async function getCapacityForecasts(): Promise<CapacityForecast[]> {
  const response = await apiClient.get('/ipam/analytics/capacity-forecasts');
  return response.data;
}

export function CapacityPlanning() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', 'capacity-forecasts'],
    queryFn: getCapacityForecasts,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Failed to load capacity forecasts
          </p>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-green-500 text-white';
    }
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === 'critical' || severity === 'high') {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return <TrendingUp className="h-4 w-4" />;
  };

  // Filter to show only resources with potential issues
  const criticalForecasts = data.filter(
    (f) => f.severity === 'critical' || f.severity === 'high'
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Capacity Planning</CardTitle>
            <CardDescription>
              Forecasts and recommendations based on allocation trends
            </CardDescription>
          </div>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {criticalForecasts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">All resources have healthy capacity</p>
            <p className="text-sm mt-1">No immediate action required</p>
          </div>
        ) : (
          criticalForecasts.map((forecast, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getSeverityColor(forecast.severity)}>
                      <span className="flex items-center gap-1">
                        {getSeverityIcon(forecast.severity)}
                        {forecast.severity.toUpperCase()}
                      </span>
                    </Badge>
                    <span className="text-sm text-muted-foreground capitalize">
                      {forecast.resource_type}
                    </span>
                  </div>
                  <h4 className="font-semibold">{forecast.resource_name}</h4>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {forecast.current_utilization.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Utilized</div>
                </div>
              </div>

              {/* Forecast Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Growth Rate</div>
                  <div className="font-medium">
                    {forecast.daily_growth_rate > 0
                      ? `+${forecast.daily_growth_rate.toFixed(2)}%/day`
                      : `${forecast.daily_growth_rate.toFixed(2)}%/day`}
                  </div>
                </div>
                {forecast.estimated_exhaustion_date && (
                  <div>
                    <div className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Est. Exhaustion
                    </div>
                    <div className="font-medium">
                      {format(parseISO(forecast.estimated_exhaustion_date), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      (~{forecast.estimated_exhaustion_days} days)
                    </div>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              {forecast.recommendations.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    Recommendations
                  </div>
                  <ul className="space-y-1 text-sm">
                    {forecast.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span className="text-muted-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}

        {/* Summary Stats */}
        {data.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {data.filter((f) => f.severity === 'critical').length}
                </div>
                <div className="text-muted-foreground">Critical</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {data.filter((f) => f.severity === 'high').length}
                </div>
                <div className="text-muted-foreground">High Priority</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {data.filter((f) => f.severity === 'low').length}
                </div>
                <div className="text-muted-foreground">Healthy</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

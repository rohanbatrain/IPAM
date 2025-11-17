'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { useUtilizationTrends } from '@/lib/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';

interface UtilizationTrendChartProps {
  timeRange: string;
}

export function UtilizationTrendChart({ timeRange }: UtilizationTrendChartProps) {
  const { data, isLoading, error } = useUtilizationTrends(timeRange);

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <p>Failed to load utilization trends</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <p>No data available for the selected time range</p>
      </div>
    );
  }

  // Format data for the chart
  const chartData = data.map((item) => ({
    date: format(parseISO(item.date), 'MMM dd'),
    'Total Allocations': item.total_allocations,
    'Active Hosts': item.active_hosts,
    'Released Hosts': item.released_hosts,
    'Utilization %': item.utilization_percentage,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Line
          type="monotone"
          dataKey="Total Allocations"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="Active Hosts"
          stroke="hsl(142 76% 36%)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="Released Hosts"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth={2}
          dot={{ r: 3 }}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

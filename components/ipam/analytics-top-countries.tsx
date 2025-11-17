'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTopCountries } from '@/lib/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';

export function TopCountriesChart() {
  const { data, isLoading, error } = useTopCountries(10);

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <p>Failed to load top countries data</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <p>No country data available</p>
      </div>
    );
  }

  // Format data for the chart - sort by allocated hosts
  const chartData = [...data]
    .sort((a, b) => b.allocated_hosts - a.allocated_hosts)
    .slice(0, 10)
    .map((item) => ({
      country: item.country,
      hosts: item.allocated_hosts,
      utilization: item.utilization_percentage,
    }));

  // Color based on utilization
  const getColor = (utilization: number) => {
    if (utilization >= 80) return 'hsl(0 72% 51%)'; // Red
    if (utilization >= 50) return 'hsl(48 96% 53%)'; // Yellow
    return 'hsl(142 76% 36%)'; // Green
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].payload.country}</p>
          <p className="text-sm text-muted-foreground">
            Hosts: {payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Utilization: {payload[0].payload.utilization.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          type="number"
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          type="category"
          dataKey="country"
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          width={70}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="hosts" radius={[0, 4, 4, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.utilization)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

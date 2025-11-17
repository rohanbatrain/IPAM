'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useContinentCapacity } from '@/lib/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';

export function ContinentCapacityChart() {
  const { data, isLoading, error } = useContinentCapacity();

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <p>Failed to load continent capacity data</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <p>No continent data available</p>
      </div>
    );
  }

  // Format data for the chart
  const chartData = data.map((item) => ({
    continent: item.continent,
    Allocated: item.allocated,
    Available: item.available,
    'Utilization %': item.utilization_percentage,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
              {entry.name === 'Utilization %' && '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="continent"
          className="text-xs"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey="Allocated" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Available" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

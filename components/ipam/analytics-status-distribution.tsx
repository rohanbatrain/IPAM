'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useStatusDistribution } from '@/lib/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = {
  Active: 'hsl(142 76% 36%)',
  Released: 'hsl(var(--muted-foreground))',
  Reserved: 'hsl(48 96% 53%)',
  Retired: 'hsl(0 72% 51%)',
};

export function StatusDistributionChart() {
  const { data, isLoading, error } = useStatusDistribution();

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <p>Failed to load status distribution</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <p>No status data available</p>
      </div>
    );
  }

  // Format data for the chart
  const chartData = data.map((item) => ({
    name: item.status,
    value: item.count,
    percentage: item.percentage,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            Count: {payload[0].value}
          </p>
          <p className="text-sm text-muted-foreground">
            {payload[0].payload.percentage.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percentage }: { name: string; percentage: number }) =>
            `${name} (${percentage.toFixed(0)}%)`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.name as keyof typeof COLORS] || 'hsl(var(--primary))'}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

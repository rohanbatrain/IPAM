'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MapLegendProps {
  activeLayer: 'utilization' | 'allocation' | 'growth';
}

export function MapLegend({ activeLayer }: MapLegendProps) {
  const legends = {
    utilization: [
      { color: 'bg-green-500', label: 'Low Utilization (< 50%)' },
      { color: 'bg-yellow-500', label: 'Medium Utilization (50-80%)' },
      { color: 'bg-red-500', label: 'High Utilization (> 80%)' },
    ],
    allocation: [
      { color: 'bg-blue-400', label: 'Low Allocation (< 30%)' },
      { color: 'bg-blue-500', label: 'Medium Allocation (30-70%)' },
      { color: 'bg-blue-600', label: 'High Allocation (> 70%)' },
    ],
    growth: [
      { color: 'bg-cyan-500', label: 'Growth Rate (simulated)' },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Legend</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {legends[activeLayer].map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full ${item.color}`} />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Marker size represents the number of allocated regions
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

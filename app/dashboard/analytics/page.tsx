'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Download, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { UtilizationTrendChart } from '@/components/ipam/analytics-utilization-trend';
import { StatusDistributionChart } from '@/components/ipam/analytics-status-distribution';
import { ContinentCapacityChart } from '@/components/ipam/analytics-continent-capacity';
import { TopCountriesChart } from '@/components/ipam/analytics-top-countries';
import { AnalyticsCapacityGauges } from '@/components/ipam/analytics-capacity-gauges';
import { CapacityPlanning } from '@/components/ipam/capacity-planning';
import { AnalyticsExportDialog } from '@/components/ipam/analytics-export-dialog';

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const timeRangeLabels: Record<TimeRange, string> = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
    '1y': 'Last Year',
    'all': 'All Time',
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Visualize IP allocation trends and capacity utilization
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(timeRangeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Export Button */}
          <Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Utilization Overview Card */}
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Utilization Trends</CardTitle>
                <CardDescription>
                  IP allocation over time ({timeRangeLabels[timeRange]})
                </CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <UtilizationTrendChart timeRange={timeRange} />
          </CardContent>
        </Card>

        {/* Status Distribution Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>Allocation by status</CardDescription>
              </div>
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <StatusDistributionChart />
          </CardContent>
        </Card>

        {/* Capacity by Continent Card */}
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Capacity by Continent</CardTitle>
            <CardDescription>Regional allocation comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ContinentCapacityChart />
          </CardContent>
        </Card>

        {/* Top Countries Card */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>By allocation count</CardDescription>
          </CardHeader>
          <CardContent>
            <TopCountriesChart />
          </CardContent>
        </Card>
      </div>

      {/* Capacity Gauges Section */}
      <AnalyticsCapacityGauges />

      {/* Capacity Planning Section */}
      <CapacityPlanning />

      {/* Export Dialog */}
      <AnalyticsExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        timeRange={timeRangeLabels[timeRange]}
      />
    </div>
  );
}

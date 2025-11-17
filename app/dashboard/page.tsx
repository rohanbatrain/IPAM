'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsWidget } from '@/components/ipam/stats-widget';
import { UtilizationChart } from '@/components/ipam/utilization-chart';
import { RecentActivity } from '@/components/ipam/recent-activity';
import { useDashboardStats, useTopCountries, useRecentActivity } from '@/lib/hooks/use-dashboard';
import { useSmartPolling } from '@/lib/hooks/use-smart-polling';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe, Network, Server, Activity } from 'lucide-react';

export default function DashboardPage() {
  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: topCountries, isLoading: countriesLoading } = useTopCountries(10);
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity(10);

  // Enable smart polling for all dashboard data
  useSmartPolling({ queryKey: ['dashboard', 'stats'], interval: 30000 });
  useSmartPolling({ queryKey: ['dashboard', 'top-countries', '10'], interval: 30000 });
  useSmartPolling({ queryKey: ['dashboard', 'recent-activity', '10'], interval: 30000 });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to the IP Address Management System
        </p>
      </div>

      {/* Stats Widgets */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <StatsWidget
              title="Total Countries"
              value={stats?.total_countries ?? 0}
              description="Available for allocation"
              icon={Globe}
            />
            <StatsWidget
              title="Total Regions"
              value={stats?.total_regions ?? 0}
              description="Allocated regions"
              icon={Network}
            />
            <StatsWidget
              title="Total Hosts"
              value={stats?.total_hosts ?? 0}
              description="Allocated IP addresses"
              icon={Server}
            />
            <StatsWidget
              title="Utilization"
              value={`${stats?.overall_utilization?.toFixed(1) ?? 0}%`}
              description="Overall capacity used"
              icon={Activity}
              utilization={stats?.overall_utilization ?? 0}
            />
          </>
        )}
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Utilization Chart */}
        {countriesLoading ? (
          <Skeleton className="h-96" />
        ) : (
          <UtilizationChart data={topCountries ?? []} />
        )}

        {/* Recent Activity */}
        {activityLoading ? (
          <Skeleton className="h-96" />
        ) : (
          <RecentActivity activities={recentActivity ?? []} />
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and operations</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/dashboard/regions/create"
            className="block p-3 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="font-medium">Create Region</div>
            <div className="text-sm text-muted-foreground">Allocate a new /24 region</div>
          </a>
          <a
            href="/dashboard/hosts/create"
            className="block p-3 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="font-medium">Allocate Host</div>
            <div className="text-sm text-muted-foreground">Assign a new IP address</div>
          </a>
          <a
            href="/dashboard/search"
            className="block p-3 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="font-medium">Search</div>
            <div className="text-sm text-muted-foreground">Find IP allocations</div>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

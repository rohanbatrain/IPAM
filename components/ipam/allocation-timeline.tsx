'use client';

import { useState } from 'react';
import { useAuditLog } from '@/lib/hooks/use-audit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO, subDays } from 'date-fns';
import { Clock, ZoomIn, ZoomOut, Filter, Calendar } from 'lucide-react';
import type { AuditEntry } from '@/lib/api/audit';

type TimelineZoom = '1d' | '7d' | '30d' | '90d';

export function AllocationTimeline() {
  const [zoom, setZoom] = useState<TimelineZoom>('7d');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const zoomDays: Record<TimelineZoom, number> = {
    '1d': 1,
    '7d': 7,
    '30d': 30,
    '90d': 90,
  };

  const startDate = subDays(new Date(), zoomDays[zoom]).toISOString();

  const filters = {
    start_date: startDate,
    page_size: 100,
    ...(actionFilter !== 'all' && { action_type: actionFilter }),
  };

  const { data, isLoading, error } = useAuditLog(filters);

  const getActionColor = (action: string): string => {
    const colors: Record<string, string> = {
      create: 'bg-green-500',
      update: 'bg-blue-500',
      release: 'bg-orange-500',
      retire: 'bg-red-500',
    };
    return colors[action] || 'bg-gray-500';
  };

  const getActionIcon = (action: string): string => {
    const icons: Record<string, string> = {
      create: '✓',
      update: '↻',
      release: '↓',
      retire: '✕',
    };
    return icons[action] || '•';
  };

  // Group events by date
  const groupedEvents = data?.results.reduce((acc, entry) => {
    const date = format(parseISO(entry.timestamp), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, AuditEntry[]>) || {};

  const sortedDates = Object.keys(groupedEvents).sort().reverse();

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Failed to load timeline data
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Allocation Timeline
            </CardTitle>
            <CardDescription>
              Chronological view of all allocation events
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {/* Action Filter */}
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="release">Release</SelectItem>
                <SelectItem value="retire">Retire</SelectItem>
              </SelectContent>
            </Select>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={zoom === '1d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setZoom('1d')}
                className="h-8"
              >
                1D
              </Button>
              <Button
                variant={zoom === '7d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setZoom('7d')}
                className="h-8"
              >
                7D
              </Button>
              <Button
                variant={zoom === '30d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setZoom('30d')}
                className="h-8"
              >
                30D
              </Button>
              <Button
                variant={zoom === '90d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setZoom('90d')}
                className="h-8"
              >
                90D
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : sortedDates.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

            {/* Timeline Events */}
            <div className="space-y-8">
              {sortedDates.map((date) => (
                <div key={date} className="relative">
                  {/* Date Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">
                        {format(parseISO(date), 'MMMM dd, yyyy')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {groupedEvents[date].length} event{groupedEvents[date].length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* Events for this date */}
                  <div className="ml-24 space-y-3">
                    {groupedEvents[date].map((entry) => (
                      <div
                        key={entry.id}
                        className="relative border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                      >
                        {/* Timeline Dot */}
                        <div
                          className={`absolute -left-[76px] top-6 w-4 h-4 rounded-full ${getActionColor(
                            entry.action_type
                          )} border-4 border-background`}
                        />

                        {/* Event Content */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${getActionColor(entry.action_type)} text-white`}>
                              {getActionIcon(entry.action_type)} {entry.action_type}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {entry.resource_type}
                            </Badge>
                            <span className="text-sm font-medium">{entry.resource_name}</span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              <span className="font-medium text-foreground">{entry.user}</span>
                            </span>
                            <span>•</span>
                            <span>{format(parseISO(entry.timestamp), 'HH:mm:ss')}</span>
                          </div>

                          {entry.reason && (
                            <div className="text-sm text-muted-foreground">
                              {entry.reason}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No events in selected time range</p>
            <p className="text-sm mt-1">Try adjusting the zoom level or filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

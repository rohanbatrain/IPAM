'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Activity, Plus, Edit, Trash2, Archive } from 'lucide-react';
import type { RecentActivity as RecentActivityType } from '@/lib/api/dashboard';

interface RecentActivityProps {
  activities: RecentActivityType[];
  title?: string;
  description?: string;
}

export function RecentActivity({
  activities,
  title = 'Recent Activity',
  description = 'Latest allocation changes',
}: RecentActivityProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return Plus;
      case 'update':
        return Edit;
      case 'release':
        return Trash2;
      case 'retire':
        return Archive;
      default:
        return Activity;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'text-green-600 dark:text-green-400';
      case 'update':
        return 'text-blue-600 dark:text-blue-400';
      case 'release':
        return 'text-orange-600 dark:text-orange-400';
      case 'retire':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getActionLabel = (action: string) => {
    return action.charAt(0).toUpperCase() + action.slice(1);
  };

  const getResourceBadge = (type: string) => {
    return type === 'region' ? 'default' : 'secondary';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No recent activity to display
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActionIcon(activity.action_type);
              const actionColor = getActionColor(activity.action_type);

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className={`mt-0.5 ${actionColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">
                        {getActionLabel(activity.action_type)}
                      </span>
                      <Badge variant={getResourceBadge(activity.resource_type) as any}>
                        {activity.resource_type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {activity.resource_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>by {activity.user}</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { useNotificationStore } from '@/lib/store/notification-store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle,
  Server,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

export function NotificationCenter() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
  } = useNotificationStore();

  const visibleNotifications = notifications.filter((n) => !n.dismissed);

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setOpen(false);
    }
  };

  const getNotificationIcon = (type: string, priority: string) => {
    if (type === 'capacity') {
      return priority === 'critical' ? (
        <AlertCircle className="h-5 w-5 text-destructive" />
      ) : (
        <AlertTriangle className="h-5 w-5 text-yellow-600" />
      );
    }

    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Actions */}
          {visibleNotifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Mark all read
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={clearAll}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear all
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <ScrollArea className="h-[calc(100vh-200px)]">
            {visibleNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            ) : (
              <div className="space-y-2">
                {visibleNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'group relative rounded-lg border p-4 transition-colors cursor-pointer',
                      !notification.read && 'bg-primary/5 border-primary/20',
                      notification.read && 'hover:bg-muted/50'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                    )}

                    <div className="flex gap-3 pl-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-none">
                            {notification.title}
                          </p>
                          <Badge variant={getPriorityColor(notification.priority) as any} className="text-xs">
                            {notification.priority}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>

                        {notification.resourceName && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Server className="h-3 w-3" />
                            <span>{notification.resourceName}</span>
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notification.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}

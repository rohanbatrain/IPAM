'use client';

import { usePullToRefresh } from '@/lib/hooks/use-touch-gestures';
import { Loader2, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
}

export function PullToRefresh({ onRefresh, children, disabled = false }: PullToRefreshProps) {
  const { isPulling, pullDistance, isRefreshing, pullProgress } = usePullToRefresh({
    onRefresh,
    disabled,
  });

  const showIndicator = isPulling || isRefreshing;
  const triggerThreshold = 80;
  const isTriggered = pullDistance >= triggerThreshold;

  return (
    <div className="relative">
      {/* Pull Indicator */}
      <div
        className={cn(
          'fixed top-16 left-0 right-0 z-30 flex items-center justify-center transition-all duration-200',
          showIndicator ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{
          transform: `translateY(${Math.min(pullDistance - 20, 60)}px)`,
        }}
      >
        <div className="flex flex-col items-center gap-2 bg-background/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border">
          {isRefreshing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-xs font-medium">Refreshing...</span>
            </>
          ) : (
            <>
              <ArrowDown
                className={cn(
                  'h-5 w-5 transition-transform',
                  isTriggered ? 'rotate-180 text-primary' : 'text-muted-foreground'
                )}
              />
              <span className="text-xs font-medium">
                {isTriggered ? 'Release to refresh' : 'Pull to refresh'}
              </span>
            </>
          )}
          
          {/* Progress Bar */}
          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${pullProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface UseSmartPollingOptions {
  queryKey: string[];
  interval?: number; // in milliseconds
  enabled?: boolean;
}

/**
 * Smart polling hook that pauses when tab is inactive
 * and resumes when tab becomes active again
 */
export function useSmartPolling({
  queryKey,
  interval = 30000, // 30 seconds default
  enabled = true,
}: UseSmartPollingOptions) {
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(true);

  useEffect(() => {
    if (!enabled) return;

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is inactive, pause polling
        isActiveRef.current = false;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // Tab is active, resume polling
        isActiveRef.current = true;
        // Immediately refetch when tab becomes active
        queryClient.invalidateQueries({ queryKey });
        
        // Restart interval
        intervalRef.current = setInterval(() => {
          if (isActiveRef.current) {
            queryClient.invalidateQueries({ queryKey });
          }
        }, interval);
      }
    };

    // Set up initial polling
    intervalRef.current = setInterval(() => {
      if (isActiveRef.current) {
        queryClient.invalidateQueries({ queryKey });
      }
    }, interval);

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [queryKey, interval, enabled, queryClient]);
}

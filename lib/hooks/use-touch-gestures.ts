'use client';

import { useEffect, useRef, useState } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeOptions {
  threshold?: number; // Minimum distance for swipe (default: 50px)
  timeout?: number; // Maximum time for swipe (default: 300ms)
}

export function useSwipeGesture(
  handlers: SwipeHandlers,
  options: SwipeOptions = {}
) {
  const { threshold = 50, timeout = 300 } = options;
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      const deltaTime = Date.now() - touchStart.current.time;

      // Check if swipe was fast enough
      if (deltaTime > timeout) {
        touchStart.current = null;
        return;
      }

      // Determine swipe direction
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > absY && absX > threshold) {
        // Horizontal swipe
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
        } else {
          handlers.onSwipeLeft?.();
        }
      } else if (absY > absX && absY > threshold) {
        // Vertical swipe
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
        } else {
          handlers.onSwipeUp?.();
        }
      }

      touchStart.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlers, threshold, timeout]);
}

interface PullToRefreshOptions {
  threshold?: number; // Distance to trigger refresh (default: 80px)
  onRefresh: () => Promise<void>;
  disabled?: boolean;
}

export function usePullToRefresh(options: PullToRefreshOptions) {
  const { threshold = 80, onRefresh, disabled = false } = options;
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStart = useRef<number | null>(null);
  const scrollTop = useRef<number>(0);

  useEffect(() => {
    if (disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      scrollTop.current = window.scrollY || document.documentElement.scrollTop;
      
      // Only start pull if at top of page
      if (scrollTop.current === 0) {
        touchStart.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStart.current === null || scrollTop.current > 0) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - touchStart.current;

      // Only pull down
      if (distance > 0) {
        setIsPulling(true);
        setPullDistance(Math.min(distance, threshold * 1.5));
        
        // Prevent default scroll if pulling
        if (distance > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }

      setIsPulling(false);
      setPullDistance(0);
      touchStart.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [disabled, isPulling, pullDistance, threshold, isRefreshing, onRefresh]);

  return {
    isPulling,
    pullDistance,
    isRefreshing,
    pullProgress: Math.min((pullDistance / threshold) * 100, 100),
  };
}

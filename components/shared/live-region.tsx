'use client';

import { useEffect, useRef } from 'react';

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive' | 'off';
  clearAfter?: number; // milliseconds
  className?: string;
}

/**
 * LiveRegion component for announcing dynamic content changes to screen readers
 * 
 * @param message - The message to announce
 * @param politeness - The ARIA live politeness level (default: 'polite')
 * @param clearAfter - Optional time in ms to clear the message (default: 5000)
 * @param className - Optional CSS classes
 * 
 * @example
 * <LiveRegion message="Region created successfully" politeness="polite" />
 * <LiveRegion message="Error: Failed to save" politeness="assertive" />
 */
export function LiveRegion({
  message,
  politeness = 'polite',
  clearAfter = 5000,
  className = '',
}: LiveRegionProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (message && clearAfter > 0) {
      timeoutRef.current = setTimeout(() => {
        // Message will be cleared by parent component
      }, clearAfter);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, clearAfter]);

  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className={`sr-only ${className}`}
    >
      {message}
    </div>
  );
}

/**
 * Hook for managing live region announcements
 * 
 * @example
 * const { announce } = useLiveRegion();
 * announce('Data loaded successfully');
 */
export function useLiveRegion() {
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = message;

    document.body.appendChild(liveRegion);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 5000);
  };

  return { announce };
}

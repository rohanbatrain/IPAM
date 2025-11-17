'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/utils/web-vitals';

/**
 * Web Vitals Provider
 * 
 * Initializes Web Vitals tracking on mount.
 * Should be included in root layout.
 */
export function WebVitalsProvider() {
  useEffect(() => {
    // Initialize Web Vitals tracking
    initWebVitals();
    
    // Log performance summary on page unload (development only)
    if (process.env.NODE_ENV === 'development') {
      const handleBeforeUnload = () => {
        const { performanceLogger } = require('@/lib/utils/performance-logger');
        performanceLogger.printSummary();
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, []);
  
  return null; // This component doesn't render anything
}

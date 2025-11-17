/**
 * Web Vitals Tracking
 * 
 * Tracks Core Web Vitals and sends to analytics endpoint.
 * Integrates with Vercel Analytics and custom logging.
 */

import type { Metric } from 'web-vitals';

// Web Vitals thresholds (good/needs improvement/poor)
const THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },      // First Contentful Paint
  LCP: { good: 2500, poor: 4000 },      // Largest Contentful Paint
  CLS: { good: 0.1, poor: 0.25 },       // Cumulative Layout Shift
  TTFB: { good: 800, poor: 1800 },      // Time to First Byte
  INP: { good: 200, poor: 500 },        // Interaction to Next Paint
};

type MetricRating = 'good' | 'needs-improvement' | 'poor';

/**
 * Get rating for a metric based on thresholds
 */
function getRating(metric: Metric): MetricRating {
  const threshold = THRESHOLDS[metric.name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (metric.value <= threshold.good) return 'good';
  if (metric.value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Send metric to analytics endpoint
 */
async function sendToAnalytics(metric: Metric) {
  const rating = getRating(metric);
  
  const body = {
    name: metric.name,
    value: metric.value,
    rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };
  
  // Send to custom analytics endpoint
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    try {
      await fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true, // Ensure request completes even if page unloads
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    const color = rating === 'good' ? '🟢' : rating === 'needs-improvement' ? '🟡' : '🔴';
    console.log(`${color} ${metric.name}:`, {
      value: `${Math.round(metric.value)}ms`,
      rating,
      threshold: THRESHOLDS[metric.name as keyof typeof THRESHOLDS],
    });
  }
}

/**
 * Report Web Vitals
 * Call this function to start tracking
 */
export function reportWebVitals(metric: Metric) {
  sendToAnalytics(metric);
}

/**
 * Initialize Web Vitals tracking
 * Dynamically imports web-vitals library to avoid blocking
 */
export async function initWebVitals() {
  if (typeof window === 'undefined') return;
  
  try {
    const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');
    
    onCLS(reportWebVitals);
    onFCP(reportWebVitals);
    onLCP(reportWebVitals);
    onTTFB(reportWebVitals);
    onINP(reportWebVitals);
  } catch (error) {
    console.error('Failed to initialize Web Vitals:', error);
  }
}

/**
 * Get current Web Vitals snapshot
 * Useful for debugging or displaying in UI
 */
export async function getWebVitalsSnapshot() {
  if (typeof window === 'undefined') return null;
  
  try {
    const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');
    
    const metrics: Record<string, Metric> = {};
    
    await Promise.all([
      new Promise<void>((resolve) => onCLS((metric) => { metrics.CLS = metric; resolve(); })),
      new Promise<void>((resolve) => onFCP((metric) => { metrics.FCP = metric; resolve(); })),
      new Promise<void>((resolve) => onLCP((metric) => { metrics.LCP = metric; resolve(); })),
      new Promise<void>((resolve) => onTTFB((metric) => { metrics.TTFB = metric; resolve(); })),
      new Promise<void>((resolve) => onINP((metric) => { metrics.INP = metric; resolve(); })),
    ]);
    
    return metrics;
  } catch (error) {
    console.error('Failed to get Web Vitals snapshot:', error);
    return null;
  }
}

/**
 * Performance observer for custom metrics
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  
  /**
   * Mark the start of a performance measurement
   */
  mark(name: string) {
    this.marks.set(name, performance.now());
    performance.mark(name);
  }
  
  /**
   * Measure time since mark
   */
  measure(name: string, startMark: string): number {
    const startTime = this.marks.get(startMark);
    if (!startTime) {
      console.warn(`No mark found for: ${startMark}`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    performance.measure(name, startMark);
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️  ${name}: ${Math.round(duration)}ms`);
    }
    
    return duration;
  }
  
  /**
   * Get all performance entries
   */
  getEntries(type?: string): PerformanceEntry[] {
    if (type) {
      return performance.getEntriesByType(type);
    }
    return performance.getEntries();
  }
  
  /**
   * Clear all marks and measures
   */
  clear() {
    this.marks.clear();
    performance.clearMarks();
    performance.clearMeasures();
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook for tracking component render performance
 */
export function usePerformanceTracking(componentName: string) {
  if (typeof window === 'undefined') return;
  
  const startMark = `${componentName}-start`;
  const endMark = `${componentName}-end`;
  
  // Mark start
  performanceMonitor.mark(startMark);
  
  // Return cleanup function
  return () => {
    performanceMonitor.mark(endMark);
    performanceMonitor.measure(`${componentName}-render`, startMark);
  };
}

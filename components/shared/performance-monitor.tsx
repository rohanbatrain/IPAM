'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getWebVitalsSnapshot } from '@/lib/utils/web-vitals';
import { performanceLogger } from '@/lib/utils/performance-logger';
import type { Metric } from 'web-vitals';

interface PerformanceSummary {
  totalLogs: number;
  averages: {
    api: number;
    render: number;
    interaction: number;
    navigation: number;
  };
  slowest: Array<{
    type: string;
    name: string;
    duration: number;
    timestamp: number;
    metadata?: Record<string, unknown>;
  }>;
  counts: {
    api: number;
    render: number;
    interaction: number;
    navigation: number;
  };
}

/**
 * Performance Monitor Component
 * 
 * Displays real-time Web Vitals and performance metrics.
 * Only visible in development mode.
 * 
 * Usage: Add to any page for debugging
 * <PerformanceMonitor />
 */
export function PerformanceMonitor() {
  const [vitals, setVitals] = useState<Record<string, Metric> | null>(null);
  const [summary, setSummary] = useState<PerformanceSummary | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const loadVitals = async () => {
    const snapshot = await getWebVitalsSnapshot();
    setVitals(snapshot);
  };
  
  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;
    
    // Load Web Vitals
    loadVitals();
    
    // Update summary every 5 seconds
    const interval = setInterval(() => {
      setSummary(performanceLogger.getSummary());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getRating = (value: number, thresholds: { good: number; poor: number }): string => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-improvement';
    return 'poor';
  };
  
  const getRatingColor = (rating: string): string => {
    switch (rating) {
      case 'good': return 'bg-green-500';
      case 'needs-improvement': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Only render in development
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? '📊 Hide' : '📊 Performance'}
      </Button>
      
      {/* Performance Dashboard */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 w-96 max-h-[80vh] overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>Performance Monitor</CardTitle>
              <CardDescription>Real-time performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Web Vitals */}
              <div>
                <h3 className="font-semibold mb-2">Web Vitals</h3>
                {vitals ? (
                  <div className="space-y-2">
                    {Object.entries(vitals).map(([name, metric]) => {
                      const thresholds = {
                        FCP: { good: 1800, poor: 3000 },
                        LCP: { good: 2500, poor: 4000 },
                        CLS: { good: 0.1, poor: 0.25 },
                        TTFB: { good: 800, poor: 1800 },
                        INP: { good: 200, poor: 500 },
                      }[name as keyof typeof vitals] || { good: 0, poor: 0 };
                      
                      const rating = getRating(metric.value, thresholds);
                      
                      return (
                        <div key={name} className="flex items-center justify-between">
                          <span className="text-sm">{name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono">
                              {Math.round(metric.value)}
                              {name === 'CLS' ? '' : 'ms'}
                            </span>
                            <Badge className={getRatingColor(rating)}>
                              {rating}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Button size="sm" onClick={loadVitals}>
                    Load Vitals
                  </Button>
                )}
              </div>
              
              {/* Performance Summary */}
              {summary && (
                <div>
                  <h3 className="font-semibold mb-2">Performance Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Logs:</span>
                      <span className="font-mono">{summary.totalLogs}</span>
                    </div>
                    
                    <div className="mt-2">
                      <div className="font-medium mb-1">Average Durations:</div>
                      <div className="pl-2 space-y-1">
                        <div className="flex justify-between">
                          <span>API:</span>
                          <span className="font-mono">{Math.round(summary.averages.api)}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Render:</span>
                          <span className="font-mono">{Math.round(summary.averages.render)}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interaction:</span>
                          <span className="font-mono">{Math.round(summary.averages.interaction)}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Navigation:</span>
                          <span className="font-mono">{Math.round(summary.averages.navigation)}ms</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="font-medium mb-1">Slowest Operations:</div>
                      <div className="pl-2 space-y-1">
                        {summary.slowest.slice(0, 3).map((log, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="truncate max-w-[200px]">
                              {log.type}: {log.name}
                            </span>
                            <span className="font-mono">{Math.round(log.duration)}ms</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    performanceLogger.printSummary();
                  }}
                >
                  Print Summary
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    performanceLogger.clear();
                    setSummary(null);
                  }}
                >
                  Clear Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

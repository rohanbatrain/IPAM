/**
 * Performance Logging Utility
 * 
 * Logs performance metrics for API calls, component renders,
 * and user interactions.
 */

interface PerformanceLog {
  type: 'api' | 'render' | 'interaction' | 'navigation';
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceLogger {
  private logs: PerformanceLog[] = [];
  private maxLogs = 100; // Keep last 100 logs
  
  /**
   * Log an API call performance
   */
  logAPI(endpoint: string, duration: number, metadata?: Record<string, any>) {
    this.addLog({
      type: 'api',
      name: endpoint,
      duration,
      timestamp: Date.now(),
      metadata,
    });
    
    // Warn if API call is slow
    if (duration > 3000) {
      console.warn(`🐌 Slow API call: ${endpoint} took ${Math.round(duration)}ms`);
    }
  }
  
  /**
   * Log a component render performance
   */
  logRender(componentName: string, duration: number, metadata?: Record<string, any>) {
    this.addLog({
      type: 'render',
      name: componentName,
      duration,
      timestamp: Date.now(),
      metadata,
    });
    
    // Warn if render is slow
    if (duration > 100) {
      console.warn(`🐌 Slow render: ${componentName} took ${Math.round(duration)}ms`);
    }
  }
  
  /**
   * Log a user interaction performance
   */
  logInteraction(action: string, duration: number, metadata?: Record<string, any>) {
    this.addLog({
      type: 'interaction',
      name: action,
      duration,
      timestamp: Date.now(),
      metadata,
    });
    
    // Warn if interaction is slow
    if (duration > 200) {
      console.warn(`🐌 Slow interaction: ${action} took ${Math.round(duration)}ms`);
    }
  }
  
  /**
   * Log a navigation performance
   */
  logNavigation(route: string, duration: number, metadata?: Record<string, any>) {
    this.addLog({
      type: 'navigation',
      name: route,
      duration,
      timestamp: Date.now(),
      metadata,
    });
    
    // Warn if navigation is slow
    if (duration > 1000) {
      console.warn(`🐌 Slow navigation: ${route} took ${Math.round(duration)}ms`);
    }
  }
  
  /**
   * Add log entry
   */
  private addLog(log: PerformanceLog) {
    this.logs.push(log);
    
    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const emoji = this.getEmoji(log.type);
      console.log(`${emoji} ${log.type}: ${log.name} - ${Math.round(log.duration)}ms`);
    }
  }
  
  /**
   * Get emoji for log type
   */
  private getEmoji(type: PerformanceLog['type']): string {
    switch (type) {
      case 'api': return '🌐';
      case 'render': return '🎨';
      case 'interaction': return '👆';
      case 'navigation': return '🧭';
      default: return '⏱️';
    }
  }
  
  /**
   * Get all logs
   */
  getLogs(): PerformanceLog[] {
    return [...this.logs];
  }
  
  /**
   * Get logs by type
   */
  getLogsByType(type: PerformanceLog['type']): PerformanceLog[] {
    return this.logs.filter(log => log.type === type);
  }
  
  /**
   * Get average duration by type
   */
  getAverageDuration(type: PerformanceLog['type']): number {
    const logs = this.getLogsByType(type);
    if (logs.length === 0) return 0;
    
    const total = logs.reduce((sum, log) => sum + log.duration, 0);
    return total / logs.length;
  }
  
  /**
   * Get slowest operations
   */
  getSlowest(count: number = 10): PerformanceLog[] {
    return [...this.logs]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, count);
  }
  
  /**
   * Get performance summary
   */
  getSummary() {
    const summary = {
      totalLogs: this.logs.length,
      averages: {
        api: this.getAverageDuration('api'),
        render: this.getAverageDuration('render'),
        interaction: this.getAverageDuration('interaction'),
        navigation: this.getAverageDuration('navigation'),
      },
      slowest: this.getSlowest(5),
      counts: {
        api: this.getLogsByType('api').length,
        render: this.getLogsByType('render').length,
        interaction: this.getLogsByType('interaction').length,
        navigation: this.getLogsByType('navigation').length,
      },
    };
    
    return summary;
  }
  
  /**
   * Print summary to console
   */
  printSummary() {
    const summary = this.getSummary();
    
    console.group('📊 Performance Summary');
    console.log('Total Logs:', summary.totalLogs);
    console.log('\nAverage Durations:');
    console.log('  API:', Math.round(summary.averages.api), 'ms');
    console.log('  Render:', Math.round(summary.averages.render), 'ms');
    console.log('  Interaction:', Math.round(summary.averages.interaction), 'ms');
    console.log('  Navigation:', Math.round(summary.averages.navigation), 'ms');
    console.log('\nCounts:');
    console.log('  API:', summary.counts.api);
    console.log('  Render:', summary.counts.render);
    console.log('  Interaction:', summary.counts.interaction);
    console.log('  Navigation:', summary.counts.navigation);
    console.log('\nSlowest Operations:');
    summary.slowest.forEach((log, i) => {
      console.log(`  ${i + 1}. ${log.type}: ${log.name} - ${Math.round(log.duration)}ms`);
    });
    console.groupEnd();
  }
  
  /**
   * Clear all logs
   */
  clear() {
    this.logs = [];
  }
  
  /**
   * Export logs as JSON
   */
  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Export singleton instance
export const performanceLogger = new PerformanceLogger();

// Make available in browser console for debugging
if (typeof window !== 'undefined') {
  (window as any).performanceLogger = performanceLogger;
}

/**
 * Decorator for measuring function execution time
 */
export function measurePerformance(type: PerformanceLog['type']) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const start = performance.now();
      try {
        const result = await originalMethod.apply(this, args);
        const duration = performance.now() - start;
        
        switch (type) {
          case 'api':
            performanceLogger.logAPI(propertyKey, duration);
            break;
          case 'render':
            performanceLogger.logRender(propertyKey, duration);
            break;
          case 'interaction':
            performanceLogger.logInteraction(propertyKey, duration);
            break;
          case 'navigation':
            performanceLogger.logNavigation(propertyKey, duration);
            break;
        }
        
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        performanceLogger.logAPI(propertyKey, duration, { error: true });
        throw error;
      }
    };
    
    return descriptor;
  };
}

/**
 * Higher-order function for measuring async function performance
 */
export function withPerformanceTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  name: string,
  type: PerformanceLog['type'] = 'api'
): T {
  return (async (...args: any[]) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      
      switch (type) {
        case 'api':
          performanceLogger.logAPI(name, duration);
          break;
        case 'render':
          performanceLogger.logRender(name, duration);
          break;
        case 'interaction':
          performanceLogger.logInteraction(name, duration);
          break;
        case 'navigation':
          performanceLogger.logNavigation(name, duration);
          break;
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      performanceLogger.logAPI(name, duration, { error: true });
      throw error;
    }
  }) as T;
}

/**
 * Service Worker Registration and Management
 * 
 * Handles service worker lifecycle and provides utilities
 * for cache management.
 */

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('[SW] Service workers not supported');
    return null;
  }
  
  // Only register in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('[SW] Skipping registration in development');
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    
    console.log('[SW] Service worker registered:', registration.scope);
    
    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;
      
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available
          console.log('[SW] New version available');
          
          // Notify user about update
          if (window.confirm('New version available! Reload to update?')) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
          }
        }
      });
    });
    
    return registration;
  } catch (error) {
    console.error('[SW] Registration failed:', error);
    return null;
  }
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const success = await registration.unregister();
      console.log('[SW] Service worker unregistered:', success);
      return success;
    }
    return false;
  } catch (error) {
    console.error('[SW] Unregistration failed:', error);
    return false;
  }
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return;
  }
  
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    console.log('[SW] All caches cleared');
  } catch (error) {
    console.error('[SW] Failed to clear caches:', error);
  }
}

/**
 * Get cache size
 */
export async function getCacheSize(): Promise<number> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return 0;
  }
  
  try {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('[SW] Failed to get cache size:', error);
    return 0;
  }
}

/**
 * Get cache info
 */
export async function getCacheInfo(): Promise<{
  caches: Array<{ name: string; size: number; count: number }>;
  totalSize: number;
  totalCount: number;
}> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return { caches: [], totalSize: 0, totalCount: 0 };
  }
  
  try {
    const cacheNames = await caches.keys();
    const cacheInfo = [];
    let totalSize = 0;
    let totalCount = 0;
    
    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const requests = await cache.keys();
      let cacheSize = 0;
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          cacheSize += blob.size;
        }
      }
      
      cacheInfo.push({
        name,
        size: cacheSize,
        count: requests.length,
      });
      
      totalSize += cacheSize;
      totalCount += requests.length;
    }
    
    return {
      caches: cacheInfo,
      totalSize,
      totalCount,
    };
  } catch (error) {
    console.error('[SW] Failed to get cache info:', error);
    return { caches: [], totalSize: 0, totalCount: 0 };
  }
}

/**
 * Check if service worker is active
 */
export function isServiceWorkerActive(): boolean {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }
  
  return !!navigator.serviceWorker.controller;
}

/**
 * Wait for service worker to be ready
 */
export async function waitForServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    console.log('[SW] Service worker ready');
    return registration;
  } catch (error) {
    console.error('[SW] Failed to wait for service worker:', error);
    return null;
  }
}

/**
 * Send message to service worker
 */
export async function sendMessageToServiceWorker(message: any): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }
  
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration && registration.active) {
    registration.active.postMessage(message);
  }
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

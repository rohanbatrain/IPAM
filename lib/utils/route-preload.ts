/**
 * Route-based preloading utilities
 * 
 * Preload heavy components when user hovers over navigation links
 * or when routes are likely to be visited next.
 */

import { preloadComponent } from './lazy-components';

export const routePreloadMap: Record<string, () => void> = {
  '/analytics': () => {
    preloadComponent('charts');
    preloadComponent('analytics');
  },
  '/map': () => {
    preloadComponent('map');
  },
  '/audit': () => {
    // Preload audit viewer
    import('@/components/ipam/audit-log-viewer');
  },
  '/hosts/batch': () => {
    // Preload batch form
    import('@/components/forms/batch-host-form');
  },
  '/search': () => {
    // Preload search components
    import('@/components/search/search-form');
    import('@/components/search/search-results');
  },
};

/**
 * Preload components for a given route
 */
export const preloadRoute = (path: string) => {
  const preloader = routePreloadMap[path];
  if (preloader) {
    preloader();
  }
};

/**
 * Hook to preload on link hover
 * Usage: <Link href="/analytics" onMouseEnter={() => preloadRoute('/analytics')}>
 */
export const useRoutePreload = () => {
  return {
    onMouseEnter: (path: string) => () => preloadRoute(path),
    onTouchStart: (path: string) => () => preloadRoute(path),
  };
};

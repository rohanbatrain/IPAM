import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query Client Configuration
 * 
 * Optimized caching strategy for IPAM data:
 * - Static data (countries): Long cache time
 * - Dynamic data (regions, hosts): Medium cache time
 * - Real-time data (analytics): Short cache time
 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default: 5 minutes stale time
      staleTime: 5 * 60 * 1000,
      
      // Garbage collection: 10 minutes
      gcTime: 10 * 60 * 1000,
      
      // Refetch on window focus (good for data freshness)
      refetchOnWindowFocus: true,
      
      // Refetch on reconnect (recover from offline)
      refetchOnReconnect: true,
      
      // Retry failed requests 3 times
      retry: 3,
      
      // Exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Network mode: online-first, fallback to cache
      networkMode: 'online',
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      
      // Network mode for mutations
      networkMode: 'online',
    },
  },
});

/**
 * Cache time configurations for different data types
 */
export const CACHE_TIMES = {
  // Static data (rarely changes)
  STATIC: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000,    // 1 hour
  },
  
  // Semi-static data (changes occasionally)
  SEMI_STATIC: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000,    // 30 minutes
  },
  
  // Dynamic data (changes frequently)
  DYNAMIC: {
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 10 * 60 * 1000,    // 10 minutes
  },
  
  // Real-time data (changes constantly)
  REALTIME: {
    staleTime: 30 * 1000,      // 30 seconds
    gcTime: 2 * 60 * 1000,     // 2 minutes
  },
  
  // Infinite (never stale)
  INFINITE: {
    staleTime: Infinity,
    gcTime: Infinity,
  },
};

/**
 * Query key factories for consistent cache keys
 */
export const queryKeys = {
  // Countries (static)
  countries: {
    all: ['countries'] as const,
    list: (filters?: any) => ['countries', 'list', filters] as const,
    detail: (country: string) => ['countries', 'detail', country] as const,
  },
  
  // Regions (semi-static)
  regions: {
    all: ['regions'] as const,
    list: (filters?: any) => ['regions', 'list', filters] as const,
    detail: (id: string) => ['regions', 'detail', id] as const,
    utilization: (id: string) => ['regions', 'utilization', id] as const,
  },
  
  // Hosts (dynamic)
  hosts: {
    all: ['hosts'] as const,
    list: (filters?: any) => ['hosts', 'list', filters] as const,
    detail: (id: string) => ['hosts', 'detail', id] as const,
  },
  
  // Analytics (real-time)
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => ['analytics', 'dashboard'] as const,
    utilization: (filters?: any) => ['analytics', 'utilization', filters] as const,
    capacity: (filters?: any) => ['analytics', 'capacity', filters] as const,
  },
  
  // Search (dynamic)
  search: {
    all: ['search'] as const,
    results: (query: string, filters?: any) => ['search', 'results', query, filters] as const,
  },
  
  // Audit (semi-static)
  audit: {
    all: ['audit'] as const,
    list: (filters?: any) => ['audit', 'list', filters] as const,
    detail: (id: string) => ['audit', 'detail', id] as const,
  },
};

/**
 * Prefetch utilities
 */
export const prefetchQueries = {
  /**
   * Prefetch countries data
   */
  countries: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.countries.all,
      staleTime: CACHE_TIMES.STATIC.staleTime,
    });
  },
  
  /**
   * Prefetch regions data
   */
  regions: async (filters?: any) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.regions.list(filters),
      staleTime: CACHE_TIMES.SEMI_STATIC.staleTime,
    });
  },
  
  /**
   * Prefetch hosts data
   */
  hosts: async (filters?: any) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.hosts.list(filters),
      staleTime: CACHE_TIMES.DYNAMIC.staleTime,
    });
  },
};

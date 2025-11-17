import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds
  });
}

export function useTopCountries(limit: number = 10) {
  return useQuery({
    queryKey: ['dashboard', 'top-countries', limit],
    queryFn: () => dashboardApi.getTopCountries(limit),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

export function useRecentActivity(limit: number = 10) {
  return useQuery({
    queryKey: ['dashboard', 'recent-activity', limit],
    queryFn: () => dashboardApi.getRecentActivity(limit),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

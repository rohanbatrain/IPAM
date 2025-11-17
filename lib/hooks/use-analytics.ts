import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api/analytics';

export function useUtilizationTrends(timeRange: string) {
  return useQuery({
    queryKey: ['analytics', 'utilization-trends', timeRange],
    queryFn: () => analyticsApi.getUtilizationTrends(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useStatusDistribution() {
  return useQuery({
    queryKey: ['analytics', 'status-distribution'],
    queryFn: () => analyticsApi.getStatusDistribution(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useContinentCapacity() {
  return useQuery({
    queryKey: ['analytics', 'continent-capacity'],
    queryFn: () => analyticsApi.getContinentCapacity(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopCountries(limit: number = 10) {
  return useQuery({
    queryKey: ['analytics', 'top-countries', limit],
    queryFn: () => analyticsApi.getTopCountries(limit),
    staleTime: 5 * 60 * 1000,
  });
}

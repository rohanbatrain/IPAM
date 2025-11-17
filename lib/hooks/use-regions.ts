import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { regionsApi } from '@/lib/api/regions';
import { toast } from 'sonner';
import type { RegionCreateRequest } from '@/lib/types/ipam';

export function useRegions(filters?: {
  country?: string;
  status?: string;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: ['regions', filters],
    queryFn: () => regionsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRegion(regionId: string) {
  return useQuery({
    queryKey: ['regions', regionId],
    queryFn: () => regionsApi.get(regionId),
    enabled: !!regionId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegionCreateRequest) => regionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      toast.success('Region created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create region');
    },
  });
}

export function useUpdateRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ regionId, updates }: { regionId: string; updates: any }) =>
      regionsApi.update(regionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      toast.success('Region updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update region');
    },
  });
}

export function useRetireRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      regionId,
      reason,
      cascade,
    }: {
      regionId: string;
      reason: string;
      cascade: boolean;
    }) => regionsApi.retire(regionId, reason, cascade),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      toast.success('Region retired successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to retire region');
    },
  });
}

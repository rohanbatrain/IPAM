import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hostsApi } from '@/lib/api/hosts';
import { toast } from 'sonner';
import type { HostCreateRequest, BatchHostCreateRequest } from '@/lib/types/ipam';

export function useHosts(filters?: {
  region_id?: string;
  country?: string;
  status?: string;
  page?: number;
  page_size?: number;
}) {
  return useQuery({
    queryKey: ['hosts', filters],
    queryFn: () => hostsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHost(hostId: string) {
  return useQuery({
    queryKey: ['hosts', hostId],
    queryFn: () => hostsApi.get(hostId),
    enabled: !!hostId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateHost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HostCreateRequest) => hostsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosts'] });
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      toast.success('Host allocated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to allocate host');
    },
  });
}

export function useBatchCreateHosts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BatchHostCreateRequest) => hostsApi.batchCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosts'] });
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      toast.success('Hosts allocated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to allocate hosts');
    },
  });
}

export function useUpdateHost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hostId, updates }: { hostId: string; updates: any }) =>
      hostsApi.update(hostId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosts'] });
      toast.success('Host updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update host');
    },
  });
}

export function useReleaseHost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ hostId, reason }: { hostId: string; reason: string }) =>
      hostsApi.release(hostId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosts'] });
      queryClient.invalidateQueries({ queryKey: ['regions'] });
      toast.success('Host released successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to release host');
    },
  });
}

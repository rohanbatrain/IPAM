import apiClient from './client';
import type {
  Host,
  HostCreateRequest,
  BatchHostCreateRequest,
  PaginatedResponse,
} from '@/lib/types/ipam';

export const hostsApi = {
  list: async (params?: {
    region_id?: string;
    country?: string;
    status?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Host>> => {
    const response = await apiClient.get('/ipam/hosts', { params });
    return response.data;
  },

  get: async (hostId: string): Promise<Host> => {
    const response = await apiClient.get(`/ipam/hosts/${hostId}`);
    return response.data;
  },

  create: async (data: HostCreateRequest): Promise<Host> => {
    const response = await apiClient.post('/ipam/hosts', null, {
      params: data,
    });
    return response.data;
  },

  batchCreate: async (data: BatchHostCreateRequest): Promise<{ hosts: Host[] }> => {
    const response = await apiClient.post('/ipam/hosts/batch', null, {
      params: data,
    });
    return response.data;
  },

  update: async (hostId: string, updates: Partial<Host>): Promise<Host> => {
    const response = await apiClient.patch(`/ipam/hosts/${hostId}`, null, {
      params: updates,
    });
    return response.data;
  },

  release: async (hostId: string, reason: string): Promise<void> => {
    await apiClient.delete(`/ipam/hosts/${hostId}`, {
      params: { reason },
    });
  },
};

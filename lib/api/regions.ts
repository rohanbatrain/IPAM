import apiClient from './client';
import type { Region, RegionCreateRequest, PaginatedResponse } from '@/lib/types/ipam';

export const regionsApi = {
  list: async (params?: {
    country?: string;
    status?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Region>> => {
    const response = await apiClient.get('/ipam/regions', { params });
    return response.data;
  },

  get: async (regionId: string): Promise<Region> => {
    const response = await apiClient.get(`/ipam/regions/${regionId}`);
    return response.data;
  },

  create: async (data: RegionCreateRequest): Promise<Region> => {
    const response = await apiClient.post('/ipam/regions', null, {
      params: data,
    });
    return response.data;
  },

  update: async (regionId: string, updates: Partial<Region>): Promise<Region> => {
    const response = await apiClient.patch(`/ipam/regions/${regionId}`, null, {
      params: updates,
    });
    return response.data;
  },

  retire: async (regionId: string, reason: string, cascade: boolean): Promise<void> => {
    await apiClient.delete(`/ipam/regions/${regionId}`, {
      params: { reason, cascade },
    });
  },

  addComment: async (regionId: string, comment: string) => {
    const response = await apiClient.post(`/ipam/regions/${regionId}/comments`, null, {
      params: { comment_text: comment },
    });
    return response.data;
  },
};

import apiClient from './client';
import type { Host, Region } from '@/lib/types/ipam';

export interface SearchFilters {
  ip_address?: string;
  hostname?: string;
  country?: string;
  region?: string;
  status?: string;
  owner?: string;
  query?: string; // General search query
}

export interface SearchResult {
  type: 'host' | 'region';
  id: string;
  name: string;
  ip_address?: string;
  cidr?: string;
  status: string;
  continent?: string;
  country: string;
  region?: string;
  owner?: string; // Human-friendly owner name (preferred for display)
  created_at: string;
  // Full object for detailed display
  host?: Host;
  regionData?: Region;
}

export interface SearchResponse {
  results: SearchResult[];
  total_count: number;
  filters_applied: SearchFilters;
}

export const searchApi = {
  search: async (filters: SearchFilters): Promise<SearchResponse> => {
    const response = await apiClient.get('/ipam/search', { params: filters });
    return response.data;
  },

  // Fallback: search across hosts and regions separately if unified search not available
  searchAll: async (filters: SearchFilters): Promise<SearchResponse> => {
    try {
      // Try unified search first
      return await searchApi.search(filters);
    } catch (error) {
      // Fallback: search hosts and regions separately
      const [hostsResponse, regionsResponse] = await Promise.all([
        apiClient.get('/ipam/hosts', { params: filters }),
        apiClient.get('/ipam/regions', { params: filters }),
      ]);

      const hosts = hostsResponse.data.results || [];
      const regions = regionsResponse.data.results || [];

      const results: SearchResult[] = [
        ...hosts.map((host: Host) => ({
          type: 'host' as const,
          id: host.host_id,
          name: host.hostname,
          ip_address: host.ip_address,
          status: host.status,
          country: '', // Would need to be fetched from region
          owner: host.owner_name || host.owner,
          created_at: host.created_at,
          host,
        })),
        ...regions.map((region: Region) => ({
          type: 'region' as const,
          id: region.region_id,
          name: region.region_name,
          cidr: region.cidr,
          status: region.status,
          country: region.country,
          owner: region.owner_name || region.owner,
          created_at: region.created_at,
          regionData: region,
        })),
      ];

      return {
        results,
        total_count: results.length,
        filters_applied: filters,
      };
    }
  },
};

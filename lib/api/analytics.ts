import apiClient from './client';

export interface UtilizationTrend {
  date: string;
  total_allocations: number;
  active_hosts: number;
  released_hosts: number;
  utilization_percentage: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface ContinentCapacity {
  continent: string;
  total_capacity: number;
  allocated: number;
  available: number;
  utilization_percentage: number;
}

export interface CountryAllocation {
  country: string;
  continent: string;
  allocated_regions: number;
  allocated_hosts: number;
  utilization_percentage: number;
}

export const analyticsApi = {
  getUtilizationTrends: async (timeRange: string): Promise<UtilizationTrend[]> => {
    const response = await apiClient.get('/ipam/analytics/utilization-trends', {
      params: { time_range: timeRange },
    });
    return response.data;
  },

  getStatusDistribution: async (): Promise<StatusDistribution[]> => {
    const response = await apiClient.get('/ipam/analytics/status-distribution');
    return response.data;
  },

  getContinentCapacity: async (): Promise<ContinentCapacity[]> => {
    const response = await apiClient.get('/ipam/analytics/continent-capacity');
    return response.data;
  },

  getTopCountries: async (limit: number = 10): Promise<CountryAllocation[]> => {
    const response = await apiClient.get('/ipam/analytics/top-countries', {
      params: { limit },
    });
    return response.data;
  },
};

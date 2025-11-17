import apiClient from './client';

export interface DashboardStats {
  total_countries: number;
  total_regions: number;
  total_hosts: number;
  overall_utilization: number;
}

export interface CountryUtilization {
  country: string;
  continent: string;
  allocated_regions: number;
  utilization_percentage: number;
}

export interface RecentActivity {
  id: string;
  action_type: 'create' | 'update' | 'release' | 'retire';
  resource_type: 'region' | 'host';
  resource_name: string;
  user: string;
  timestamp: string;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/ipam/dashboard/stats');
    return response.data;
  },

  getTopCountries: async (limit: number = 10): Promise<CountryUtilization[]> => {
    const response = await apiClient.get('/ipam/dashboard/top-countries', {
      params: { limit },
    });
    return response.data;
  },

  getRecentActivity: async (limit: number = 10): Promise<RecentActivity[]> => {
    const response = await apiClient.get('/ipam/dashboard/recent-activity', {
      params: { limit },
    });
    return response.data;
  },
};

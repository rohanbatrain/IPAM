import apiClient from './client';
import type { Country } from '@/lib/types/ipam';

export const countriesApi = {
  list: async (): Promise<Country[]> => {
    const response = await apiClient.get('/ipam/countries');
    return response.data;
  },

  get: async (country: string): Promise<Country> => {
    const response = await apiClient.get(`/ipam/countries/${country}`);
    return response.data;
  },
};

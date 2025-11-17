import { useQuery } from '@tanstack/react-query';
import { countriesApi } from '@/lib/api/countries';

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: () => countriesApi.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCountry(country: string) {
  return useQuery({
    queryKey: ['countries', country],
    queryFn: () => countriesApi.get(country),
    enabled: !!country,
    staleTime: 5 * 60 * 1000,
  });
}

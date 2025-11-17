import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchApi, type SearchFilters } from '@/lib/api/search';
import { toast } from 'sonner';

export function useSearch(filters: SearchFilters, enabled: boolean = true) {
  return useQuery({
    queryKey: ['search', filters],
    queryFn: () => searchApi.searchAll(filters),
    enabled: enabled && Object.keys(filters).some((key) => filters[key as keyof SearchFilters]),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Saved filters management
export interface SavedFilter {
  id: string;
  name: string;
  filters: SearchFilters;
  created_at: string;
}

const SAVED_FILTERS_KEY = 'ipam_saved_filters';

export function useSavedFilters() {
  const queryClient = useQueryClient();

  const { data: savedFilters = [] } = useQuery<SavedFilter[]>({
    queryKey: ['savedFilters'],
    queryFn: () => {
      const stored = localStorage.getItem(SAVED_FILTERS_KEY);
      return stored ? JSON.parse(stored) : [];
    },
    staleTime: Infinity,
  });

  const saveFilter = useMutation({
    mutationFn: async ({ name, filters }: { name: string; filters: SearchFilters }) => {
      const newFilter: SavedFilter = {
        id: Date.now().toString(),
        name,
        filters,
        created_at: new Date().toISOString(),
      };

      const updated = [...savedFilters, newFilter];
      localStorage.setItem(SAVED_FILTERS_KEY, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['savedFilters'], updated);
      toast.success('Filter saved successfully');
    },
    onError: () => {
      toast.error('Failed to save filter');
    },
  });

  const deleteFilter = useMutation({
    mutationFn: async (filterId: string) => {
      const updated = savedFilters.filter((f) => f.id !== filterId);
      localStorage.setItem(SAVED_FILTERS_KEY, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['savedFilters'], updated);
      toast.success('Filter deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete filter');
    },
  });

  const updateFilter = useMutation({
    mutationFn: async ({
      filterId,
      name,
      filters,
    }: {
      filterId: string;
      name: string;
      filters: SearchFilters;
    }) => {
      const updated = savedFilters.map((f) =>
        f.id === filterId ? { ...f, name, filters } : f
      );
      localStorage.setItem(SAVED_FILTERS_KEY, JSON.stringify(updated));
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(['savedFilters'], updated);
      toast.success('Filter updated successfully');
    },
    onError: () => {
      toast.error('Failed to update filter');
    },
  });

  return {
    savedFilters,
    saveFilter,
    deleteFilter,
    updateFilter,
  };
}

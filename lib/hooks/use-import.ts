'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { importApi, ImportResult } from '@/lib/api/import';
import { toast } from 'sonner';

export function useImportRegions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Array<Record<string, string>>) => importApi.importRegions(data),
    onSuccess: (result: ImportResult) => {
      if (result.success > 0) {
        queryClient.invalidateQueries({ queryKey: ['regions'] });
        queryClient.invalidateQueries({ queryKey: ['countries'] });
        toast.success(`Successfully imported ${result.success} region(s)`);
      }
      if (result.failed > 0) {
        toast.error(`Failed to import ${result.failed} region(s)`);
      }
    },
    onError: () => {
      toast.error('Import failed. Please try again.');
    },
  });
}

export function useImportHosts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Array<Record<string, string>>) => importApi.importHosts(data),
    onSuccess: (result: ImportResult) => {
      if (result.success > 0) {
        queryClient.invalidateQueries({ queryKey: ['hosts'] });
        queryClient.invalidateQueries({ queryKey: ['regions'] });
        toast.success(`Successfully imported ${result.success} host(s)`);
      }
      if (result.failed > 0) {
        toast.error(`Failed to import ${result.failed} host(s)`);
      }
    },
    onError: () => {
      toast.error('Import failed. Please try again.');
    },
  });
}

export function useDownloadTemplate() {
  return {
    downloadRegionTemplate: () => importApi.downloadTemplate('regions'),
    downloadHostTemplate: () => importApi.downloadTemplate('hosts'),
  };
}

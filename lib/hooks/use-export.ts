'use client';

import { useMutation } from '@tanstack/react-query';
import { exportApi, ExportFormat, ExportOptions } from '@/lib/api/export';
import { toast } from 'sonner';

export function useExportRegions() {
  return useMutation({
    mutationFn: async ({
      format,
      fields,
      filters,
    }: {
      format: ExportFormat;
      fields?: string[];
      filters?: Record<string, any>;
    }) => {
      const options: ExportOptions = {
        format,
        fields,
        filters,
        includeMetadata: true,
      };
      const blob = await exportApi.exportRegions(options);
      const filename = `regions-export-${Date.now()}.${format === 'excel' ? 'xlsx' : format}`;
      exportApi.downloadExport(blob, filename);
    },
    onSuccess: () => {
      toast.success('Export completed successfully');
    },
    onError: () => {
      toast.error('Export failed. Please try again.');
    },
  });
}

export function useExportHosts() {
  return useMutation({
    mutationFn: async ({
      format,
      fields,
      filters,
    }: {
      format: ExportFormat;
      fields?: string[];
      filters?: Record<string, any>;
    }) => {
      const options: ExportOptions = {
        format,
        fields,
        filters,
        includeMetadata: true,
      };
      const blob = await exportApi.exportHosts(options);
      const filename = `hosts-export-${Date.now()}.${format === 'excel' ? 'xlsx' : format}`;
      exportApi.downloadExport(blob, filename);
    },
    onSuccess: () => {
      toast.success('Export completed successfully');
    },
    onError: () => {
      toast.error('Export failed. Please try again.');
    },
  });
}

export function useExportCountries() {
  return useMutation({
    mutationFn: async ({
      format,
      fields,
      filters,
    }: {
      format: ExportFormat;
      fields?: string[];
      filters?: Record<string, any>;
    }) => {
      const options: ExportOptions = {
        format,
        fields,
        filters,
        includeMetadata: true,
      };
      const blob = await exportApi.exportCountries(options);
      const filename = `countries-export-${Date.now()}.${format === 'excel' ? 'xlsx' : format}`;
      exportApi.downloadExport(blob, filename);
    },
    onSuccess: () => {
      toast.success('Export completed successfully');
    },
    onError: () => {
      toast.error('Export failed. Please try again.');
    },
  });
}

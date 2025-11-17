import apiClient from './client';

export interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; message: string }>;
}

export const importApi = {
  /**
   * Import regions from CSV data
   */
  importRegions: async (data: Array<Record<string, string>>): Promise<ImportResult> => {
    const results: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // Process each region sequentially
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        await apiClient.post('/ipam/regions', null, {
          params: {
            country: row.country,
            region_name: row.region_name,
            description: row.description || undefined,
            owner: row.owner || undefined,
          },
        });
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          row: i + 2, // +2 because row 1 is header and array is 0-indexed
          message: error.response?.data?.detail || 'Failed to create region',
        });
      }
    }

    return results;
  },

  /**
   * Import hosts from CSV data
   */
  importHosts: async (data: Array<Record<string, string>>): Promise<ImportResult> => {
    const results: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // Process each host sequentially
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        await apiClient.post('/ipam/hosts', null, {
          params: {
            region_id: row.region_id,
            hostname: row.hostname,
            device_type: row.device_type || undefined,
            owner: row.owner || undefined,
            purpose: row.purpose || undefined,
          },
        });
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          row: i + 2, // +2 because row 1 is header and array is 0-indexed
          message: error.response?.data?.detail || 'Failed to create host',
        });
      }
    }

    return results;
  },

  /**
   * Generate CSV template for regions
   */
  generateRegionTemplate: (): string => {
    const headers = ['country', 'region_name', 'description', 'owner'];
    const example = ['India', 'Mumbai-DC1', 'Primary datacenter in Mumbai', 'admin@example.com'];
    return [headers.join(','), example.join(',')].join('\n');
  },

  /**
   * Generate CSV template for hosts
   */
  generateHostTemplate: (): string => {
    const headers = ['region_id', 'hostname', 'device_type', 'owner', 'purpose'];
    const example = ['reg_123abc', 'web-server-01', 'Server', 'admin@example.com', 'Web hosting'];
    return [headers.join(','), example.join(',')].join('\n');
  },

  /**
   * Download CSV template
   */
  downloadTemplate: (type: 'regions' | 'hosts') => {
    const csv = type === 'regions' 
      ? importApi.generateRegionTemplate() 
      : importApi.generateHostTemplate();
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-import-template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

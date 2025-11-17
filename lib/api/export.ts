import apiClient from './client';

export type ExportFormat = 'csv' | 'json' | 'excel' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  fields?: string[];
  filters?: Record<string, any>;
  includeMetadata?: boolean;
}

export const exportApi = {
  /**
   * Export regions data
   */
  exportRegions: async (options: ExportOptions): Promise<Blob> => {
    const { format, fields, filters, includeMetadata = true } = options;

    // Fetch regions data with filters
    const response = await apiClient.get('/ipam/regions', {
      params: filters,
    });

    const regions = response.data.results || response.data;

    // Generate export based on format
    switch (format) {
      case 'csv':
        return generateCSV(regions, fields, 'regions');
      case 'json':
        return generateJSON(regions, fields, filters, includeMetadata);
      case 'excel':
        return generateExcel(regions, fields, 'regions');
      case 'pdf':
        return generatePDF(regions, fields, 'regions', filters);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  },

  /**
   * Export hosts data
   */
  exportHosts: async (options: ExportOptions): Promise<Blob> => {
    const { format, fields, filters, includeMetadata = true } = options;

    // Fetch hosts data with filters
    const response = await apiClient.get('/ipam/hosts', {
      params: filters,
    });

    const hosts = response.data.results || response.data;

    // Generate export based on format
    switch (format) {
      case 'csv':
        return generateCSV(hosts, fields, 'hosts');
      case 'json':
        return generateJSON(hosts, fields, filters, includeMetadata);
      case 'excel':
        return generateExcel(hosts, fields, 'hosts');
      case 'pdf':
        return generatePDF(hosts, fields, 'hosts', filters);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  },

  /**
   * Export countries data
   */
  exportCountries: async (options: ExportOptions): Promise<Blob> => {
    const { format, fields, filters, includeMetadata = true } = options;

    // Fetch countries data
    const response = await apiClient.get('/ipam/countries', {
      params: filters,
    });

    const countries = response.data;

    // Generate export based on format
    switch (format) {
      case 'csv':
        return generateCSV(countries, fields, 'countries');
      case 'json':
        return generateJSON(countries, fields, filters, includeMetadata);
      case 'excel':
        return generateExcel(countries, fields, 'countries');
      case 'pdf':
        return generatePDF(countries, fields, 'countries', filters);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  },

  /**
   * Download exported file
   */
  downloadExport: (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },
};

/**
 * Generate CSV export
 */
function generateCSV(data: any[], fields?: string[], type?: string): Blob {
  if (data.length === 0) {
    return new Blob(['No data to export'], { type: 'text/csv' });
  }

  // Determine fields to export
  const allFields = Object.keys(data[0]);
  const exportFields = fields && fields.length > 0 ? fields : allFields;

  // Generate CSV header
  const header = exportFields.join(',');

  // Generate CSV rows
  const rows = data.map((item) =>
    exportFields.map((field) => {
      const value = item[field];
      // Handle values with commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    }).join(',')
  );

  const csv = [header, ...rows].join('\n');
  return new Blob([csv], { type: 'text/csv' });
}

/**
 * Generate JSON export
 */
function generateJSON(
  data: any[],
  fields?: string[],
  filters?: Record<string, any>,
  includeMetadata?: boolean
): Blob {
  let exportData: any = data;

  // Filter fields if specified
  if (fields && fields.length > 0) {
    exportData = data.map((item) => {
      const filtered: any = {};
      fields.forEach((field) => {
        if (field in item) {
          filtered[field] = item[field];
        }
      });
      return filtered;
    });
  }

  // Add metadata if requested
  const output = includeMetadata
    ? {
        metadata: {
          exportDate: new Date().toISOString(),
          recordCount: data.length,
          filters: filters || {},
        },
        data: exportData,
      }
    : exportData;

  const json = JSON.stringify(output, null, 2);
  return new Blob([json], { type: 'application/json' });
}

/**
 * Generate Excel export (CSV format with .xlsx extension)
 * For true Excel format, would need a library like xlsx or exceljs
 */
function generateExcel(data: any[], fields?: string[], type?: string): Blob {
  // For now, generate CSV format
  // In production, use a library like 'xlsx' for true Excel format
  return generateCSV(data, fields, type);
}

/**
 * Generate PDF export
 * For true PDF generation, would need a library like jsPDF or pdfmake
 */
function generatePDF(
  data: any[],
  fields?: string[],
  type?: string,
  filters?: Record<string, any>
): Blob {
  // Simple text-based PDF alternative
  // In production, use a library like 'jspdf' or 'pdfmake'
  
  const allFields = data.length > 0 ? Object.keys(data[0]) : [];
  const exportFields = fields && fields.length > 0 ? fields : allFields;

  let content = `IPAM ${type?.toUpperCase()} Export\n`;
  content += `Generated: ${new Date().toLocaleString()}\n`;
  content += `Records: ${data.length}\n\n`;

  if (filters && Object.keys(filters).length > 0) {
    content += 'Filters Applied:\n';
    Object.entries(filters).forEach(([key, value]) => {
      content += `  ${key}: ${value}\n`;
    });
    content += '\n';
  }

  content += '='.repeat(80) + '\n\n';

  data.forEach((item, index) => {
    content += `Record ${index + 1}:\n`;
    exportFields.forEach((field) => {
      content += `  ${field}: ${item[field] ?? 'N/A'}\n`;
    });
    content += '\n';
  });

  return new Blob([content], { type: 'text/plain' });
}

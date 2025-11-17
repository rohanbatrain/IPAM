import apiClient from './client';

export interface AuditEntry {
  id: string;
  action_type: 'create' | 'update' | 'release' | 'retire';
  resource_type: 'region' | 'host' | 'country';
  resource_id: string;
  resource_name: string;
  user: string;
  user_id: string;
  timestamp: string;
  changes?: {
    field: string;
    old_value: any;
    new_value: any;
  }[];
  reason?: string;
  metadata?: Record<string, any>;
}

export interface AuditFilters {
  start_date?: string;
  end_date?: string;
  user?: string;
  action_type?: string;
  resource_type?: string;
  resource_id?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedAuditResponse {
  results: AuditEntry[];
  pagination: {
    page: number;
    page_size: number;
    total_count: number;
    total_pages: number;
  };
}

export const auditApi = {
  list: async (filters?: AuditFilters): Promise<PaginatedAuditResponse> => {
    const response = await apiClient.get('/ipam/audit', {
      params: filters,
    });
    return response.data;
  },

  get: async (auditId: string): Promise<AuditEntry> => {
    const response = await apiClient.get(`/ipam/audit/${auditId}`);
    return response.data;
  },

  export: async (filters?: AuditFilters): Promise<Blob> => {
    const response = await apiClient.get('/ipam/audit/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },
};

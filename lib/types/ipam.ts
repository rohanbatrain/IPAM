// Core IPAM types matching backend API

export interface Country {
  continent: string;
  country: string;
  x_start: number;
  x_end: number;
  total_capacity: number;
  allocated_regions: number;
  utilization_percentage: number; // Always present, 0-100 range
  total_blocks?: number;
  is_reserved?: boolean;
  remaining_capacity?: number;
}

export interface Region {
  region_id: string;
  country: string;
  continent?: string;
  x_octet: number;
  y_octet: number;
  cidr: string;
  region_name: string;
  description?: string;
  // Backwards-compatible: `owner` kept for older clients. New clients
  // should use `owner_name` for the human-friendly owner string and
  // `owner_id` for the internal identifier.
  owner?: string;
  owner_name?: string;
  owner_id?: string;
  status: 'Active' | 'Reserved' | 'Retired';
  allocated_hosts?: number;
  utilization_percentage?: number;
  tags?: Record<string, string>;
  comments?: any[];
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface Host {
  host_id: string;
  region_id: string;
  x_octet: number;
  y_octet: number;
  z_octet: number;
  ip_address: string;
  hostname: string;
  device_type?: string;
  os_type?: string;
  application?: string;
  cost_center?: string;
  // Backwards-compatible owner field plus explicit owner_name and owner_id
  owner?: string;
  owner_name?: string;
  owner_id?: string;
  purpose?: string;
  status: 'Active' | 'Released';
  tags?: Record<string, string>;
  notes?: string;
  comments?: any[];
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  pagination: {
    page: number;
    page_size: number;
    total_count: number;
    total_pages: number;
  };
}

export interface RegionCreateRequest {
  country: string;
  region_name: string;
  description?: string;
  owner?: string;
  tags?: Record<string, string>;
}

export interface HostCreateRequest {
  region_id: string;
  hostname: string;
  device_type?: string;
  owner?: string;
  purpose?: string;
}

export interface BatchHostCreateRequest {
  region_id: string;
  count: number;
  hostname_prefix: string;
  device_type?: string;
  owner?: string;
  purpose?: string;
}

export interface AuditEntry {
  audit_id: string;
  action: 'create' | 'update' | 'delete' | 'retire' | 'release';
  resource_type: 'region' | 'host';
  resource_id: string;
  resource_name: string;
  user_id: string;
  username: string;
  changes?: Record<string, any>;
  reason?: string;
  timestamp: string;
}

export interface SearchFilters {
  ip_address?: string;
  hostname?: string;
  country?: string;
  region?: string;
  status?: string;
  owner?: string; // Accepts either owner name or owner id for backward compatibility
}

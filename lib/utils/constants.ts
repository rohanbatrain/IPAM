// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  IPAM: {
    COUNTRIES: '/ipam/countries',
    REGIONS: '/ipam/regions',
    HOSTS: '/ipam/hosts',
    SEARCH: '/ipam/search',
    AUDIT: '/ipam/audit',
  },
} as const;

// Polling intervals (milliseconds)
export const POLLING_INTERVALS = {
  DASHBOARD: 30000, // 30 seconds
  LISTS: 30000,
  DETAILS: 30000,
  CRITICAL: 10000, // 10 seconds for critical resources
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  PAGE_SIZE_OPTIONS: [25, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Status values
export const STATUS = {
  REGION: {
    ACTIVE: 'Active',
    RESERVED: 'Reserved',
    RETIRED: 'Retired',
  },
  HOST: {
    ACTIVE: 'Active',
    RELEASED: 'Released',
  },
} as const;

// Utilization thresholds
export const UTILIZATION_THRESHOLDS = {
  LOW: 50,
  MEDIUM: 80,
  HIGH: 90,
} as const;

// IP address constraints
export const IP_CONSTRAINTS = {
  MIN_OCTET: 0,
  MAX_OCTET: 255,
  MIN_HOST_OCTET: 1,
  MAX_HOST_OCTET: 254,
  REGION_CAPACITY: 254,
} as const;

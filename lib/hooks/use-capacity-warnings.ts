'use client';

import { useEffect } from 'react';
import { useNotificationStore } from '@/lib/store/notification-store';

interface CapacityWarningOptions {
  enabled?: boolean;
  checkInterval?: number; // milliseconds
}

/**
 * Hook to monitor capacity and trigger warnings
 */
export function useCapacityWarnings(options: CapacityWarningOptions = {}) {
  const { enabled = true, checkInterval = 60000 } = options; // Default: check every minute
  const { addNotification, preferences } = useNotificationStore();

  useEffect(() => {
    if (!enabled || !preferences.capacityWarnings) {
      return;
    }

    const checkCapacity = () => {
      // This would typically fetch data from your API
      // For now, we'll create a placeholder that can be called manually
    };

    const interval = setInterval(checkCapacity, checkInterval);
    return () => clearInterval(interval);
  }, [enabled, checkInterval, preferences.capacityWarnings]);

  /**
   * Check a region's capacity and create notification if needed
   */
  const checkRegionCapacity = (region: {
    region_id: string;
    region_name: string;
    utilization_percentage: number;
    allocated_hosts: number;
    country: string;
  }) => {
    const { warning, critical } = preferences.capacityThresholds;

    if (region.utilization_percentage >= critical) {
      addNotification({
        type: 'capacity',
        priority: 'critical',
        title: 'Critical Capacity Warning',
        message: `Region "${region.region_name}" is at ${region.utilization_percentage}% capacity (${region.allocated_hosts}/254 hosts). Immediate action required.`,
        resourceType: 'region',
        resourceId: region.region_id,
        resourceName: region.region_name,
        actionUrl: `/dashboard/regions/${region.region_id}`,
      });
    } else if (region.utilization_percentage >= warning) {
      addNotification({
        type: 'capacity',
        priority: 'high',
        title: 'Capacity Warning',
        message: `Region "${region.region_name}" is at ${region.utilization_percentage}% capacity (${region.allocated_hosts}/254 hosts). Consider planning for additional capacity.`,
        resourceType: 'region',
        resourceId: region.region_id,
        resourceName: region.region_name,
        actionUrl: `/dashboard/regions/${region.region_id}`,
      });
    }
  };

  /**
   * Check a country's capacity and create notification if needed
   */
  const checkCountryCapacity = (country: {
    country: string;
    utilization_percentage: number;
    allocated_regions: number;
    total_capacity: number;
  }) => {
    const { warning, critical } = preferences.capacityThresholds;

    if (country.utilization_percentage >= critical) {
      addNotification({
        type: 'capacity',
        priority: 'critical',
        title: 'Critical Country Capacity Warning',
        message: `Country "${country.country}" is at ${country.utilization_percentage}% capacity (${country.allocated_regions} regions allocated). Immediate action required.`,
        resourceType: 'country',
        resourceId: country.country,
        resourceName: country.country,
        actionUrl: `/dashboard/countries/${country.country}`,
      });
    } else if (country.utilization_percentage >= warning) {
      addNotification({
        type: 'capacity',
        priority: 'high',
        title: 'Country Capacity Warning',
        message: `Country "${country.country}" is at ${country.utilization_percentage}% capacity (${country.allocated_regions} regions allocated). Consider planning for additional capacity.`,
        resourceType: 'country',
        resourceId: country.country,
        resourceName: country.country,
        actionUrl: `/dashboard/countries/${country.country}`,
      });
    }
  };

  /**
   * Get capacity warning badge variant based on utilization
   */
  const getCapacityBadgeVariant = (utilization: number): 'default' | 'secondary' | 'destructive' => {
    const { warning, critical } = preferences.capacityThresholds;

    if (utilization >= critical) {
      return 'destructive';
    } else if (utilization >= warning) {
      return 'default';
    }
    return 'secondary';
  };

  /**
   * Get capacity warning message
   */
  const getCapacityWarningMessage = (utilization: number): string | null => {
    const { warning, critical } = preferences.capacityThresholds;

    if (utilization >= critical) {
      return 'Critical capacity - immediate action required';
    } else if (utilization >= warning) {
      return 'High capacity - plan for additional space';
    }
    return null;
  };

  /**
   * Check if capacity warning should be shown
   */
  const shouldShowCapacityWarning = (utilization: number): boolean => {
    return utilization >= preferences.capacityThresholds.warning;
  };

  return {
    checkRegionCapacity,
    checkCountryCapacity,
    getCapacityBadgeVariant,
    getCapacityWarningMessage,
    shouldShowCapacityWarning,
  };
}

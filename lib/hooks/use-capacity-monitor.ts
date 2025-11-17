import { useNotificationStore } from '@/lib/store/notification-store';
import type { Region, Country } from '@/lib/types/ipam';

export function useCapacityMonitor() {
  const { addNotification, preferences } = useNotificationStore();

  const checkRegionCapacity = (region: Region) => {
    if (!preferences.enabled || !preferences.capacityWarnings) return;

    const utilization = region.utilization_percentage ?? 0;

    if (utilization >= preferences.capacityThresholds.critical) {
      addNotification({
        type: 'error',
        priority: 'critical',
        title: 'Critical Capacity Warning',
        message: `Region "${region.region_name}" is at ${utilization.toFixed(1)}% capacity (${region.allocated_hosts ?? 0}/254 hosts)`,
        actionUrl: `/dashboard/regions/${region.region_id}`,
      });
    } else if (utilization >= preferences.capacityThresholds.warning) {
      addNotification({
        type: 'warning',
        priority: 'high',
        title: 'Capacity Warning',
        message: `Region "${region.region_name}" is at ${utilization.toFixed(1)}% capacity (${region.allocated_hosts ?? 0}/254 hosts)`,
        actionUrl: `/dashboard/regions/${region.region_id}`,
      });
    }
  };

  const checkCountryCapacity = (country: Country) => {
    if (!preferences.enabled || !preferences.capacityWarnings) return;

    const utilization = country.utilization_percentage ?? 0;

    if (utilization >= preferences.capacityThresholds.critical) {
      addNotification({
        type: 'error',
        priority: 'critical',
        title: 'Critical Country Capacity',
        message: `Country "${country.country}" is at ${utilization.toFixed(1)}% capacity (${country.allocated_regions ?? 0} regions)`,
        actionUrl: `/dashboard/countries/${country.country}`,
      });
    } else if (utilization >= preferences.capacityThresholds.warning) {
      addNotification({
        type: 'warning',
        priority: 'high',
        title: 'Country Capacity Warning',
        message: `Country "${country.country}" is at ${utilization.toFixed(1)}% capacity (${country.allocated_regions ?? 0} regions)`,
        actionUrl: `/dashboard/countries/${country.country}`,
      });
    }
  };

  return {
    checkRegionCapacity,
    checkCountryCapacity,
  };
}

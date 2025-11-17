'use client';

import { useQuery } from '@tanstack/react-query';
import { useCountries } from './use-countries';
import { useRegions } from './use-regions';
import { useHosts } from './use-hosts';

interface TreeNode {
  id: string;
  label: string;
  type: 'continent' | 'country' | 'region' | 'host';
  status?: 'Active' | 'Reserved' | 'Retired' | 'Released';
  utilization?: number;
  children?: TreeNode[];
  metadata?: {
    cidr?: string;
    ipAddress?: string;
    allocatedCount?: number;
    totalCapacity?: number;
  };
}

export function useHierarchy() {
  const { data: countriesData } = useCountries();
  const { data: regionsData } = useRegions();
  const { data: hostsData } = useHosts();

  return useQuery({
    queryKey: ['hierarchy', countriesData, regionsData, hostsData],
    queryFn: () => buildHierarchy(countriesData, regionsData, hostsData),
    enabled: !!countriesData && !!regionsData && !!hostsData,
  });
}

function buildHierarchy(
  countriesData: any,
  regionsData: any,
  hostsData: any
): TreeNode[] {
  const countries = countriesData?.results || [];
  const regions = regionsData?.results || [];
  const hosts = hostsData?.results || [];

  // Group countries by continent
  const continentMap = new Map<string, any[]>();
  countries.forEach((country: any) => {
    const continent = country.continent || 'Unknown';
    if (!continentMap.has(continent)) {
      continentMap.set(continent, []);
    }
    continentMap.get(continent)!.push(country);
  });

  // Group regions by country
  const regionsByCountry = new Map<string, any[]>();
  regions.forEach((region: any) => {
    if (!regionsByCountry.has(region.country)) {
      regionsByCountry.set(region.country, []);
    }
    regionsByCountry.get(region.country)!.push(region);
  });

  // Group hosts by region
  const hostsByRegion = new Map<string, any[]>();
  hosts.forEach((host: any) => {
    if (!hostsByRegion.has(host.region_id)) {
      hostsByRegion.set(host.region_id, []);
    }
    hostsByRegion.get(host.region_id)!.push(host);
  });

  // Build tree structure
  const tree: TreeNode[] = [];

  continentMap.forEach((continentCountries, continentName) => {
    const continentNode: TreeNode = {
      id: `continent-${continentName}`,
      label: continentName,
      type: 'continent',
      children: [],
    };

    continentCountries.forEach((country: any) => {
      const countryRegions = regionsByCountry.get(country.country) || [];
      
      const countryNode: TreeNode = {
        id: country.country,
        label: country.country,
        type: 'country',
        utilization: country.utilization_percentage,
        metadata: {
          allocatedCount: country.allocated_regions,
          totalCapacity: country.total_capacity,
        },
        children: [],
      };

      countryRegions.forEach((region: any) => {
        const regionHosts = hostsByRegion.get(region.region_id) || [];
        
        const regionNode: TreeNode = {
          id: region.region_id,
          label: region.region_name,
          type: 'region',
          status: region.status,
          utilization: region.utilization_percentage,
          metadata: {
            cidr: region.cidr,
            allocatedCount: region.allocated_hosts,
            totalCapacity: 254,
          },
          children: [],
        };

        regionHosts.forEach((host: any) => {
          const hostNode: TreeNode = {
            id: host.host_id,
            label: host.hostname,
            type: 'host',
            status: host.status,
            metadata: {
              ipAddress: host.ip_address,
            },
          };

          regionNode.children!.push(hostNode);
        });

        countryNode.children!.push(regionNode);
      });

      continentNode.children!.push(countryNode);
    });

    tree.push(continentNode);
  });

  return tree;
}

export function useCountryHierarchy(countryName: string) {
  const { data: regionsData } = useRegions({ country: countryName });
  const { data: hostsData } = useHosts();

  return useQuery({
    queryKey: ['country-hierarchy', countryName, regionsData, hostsData],
    queryFn: () => buildCountryHierarchy(countryName, regionsData, hostsData),
    enabled: !!regionsData && !!hostsData,
  });
}

function buildCountryHierarchy(
  countryName: string,
  regionsData: any,
  hostsData: any
): TreeNode[] {
  const regions = regionsData?.results || [];
  const hosts = hostsData?.results || [];

  const hostsByRegion = new Map<string, any[]>();
  hosts.forEach((host: any) => {
    if (!hostsByRegion.has(host.region_id)) {
      hostsByRegion.set(host.region_id, []);
    }
    hostsByRegion.get(host.region_id)!.push(host);
  });

  const tree: TreeNode[] = regions.map((region: any) => {
    const regionHosts = hostsByRegion.get(region.region_id) || [];
    
    return {
      id: region.region_id,
      label: region.region_name,
      type: 'region',
      status: region.status,
      utilization: region.utilization_percentage,
      metadata: {
        cidr: region.cidr,
        allocatedCount: region.allocated_hosts,
        totalCapacity: 254,
      },
      children: regionHosts.map((host: any) => ({
        id: host.host_id,
        label: host.hostname,
        type: 'host',
        status: host.status,
        metadata: {
          ipAddress: host.ip_address,
        },
      })),
    };
  });

  return tree;
}

export function useRegionHierarchy(regionId: string) {
  const { data: hostsData } = useHosts({ region_id: regionId });

  return useQuery({
    queryKey: ['region-hierarchy', regionId, hostsData],
    queryFn: () => buildRegionHierarchy(hostsData),
    enabled: !!hostsData,
  });
}

function buildRegionHierarchy(hostsData: any): TreeNode[] {
  const hosts = hostsData?.results || [];

  return hosts.map((host: any) => ({
    id: host.host_id,
    label: host.hostname,
    type: 'host',
    status: host.status,
    metadata: {
      ipAddress: host.ip_address,
    },
  }));
}

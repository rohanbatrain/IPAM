'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegions } from '@/lib/hooks/use-regions';
import { useCreateHost } from '@/lib/hooks/use-hosts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function HostForm() {
  const router = useRouter();
  const { data: regionsData, isLoading: regionsLoading } = useRegions();
  const createHost = useCreateHost();

  const [formData, setFormData] = useState({
    region_id: '',
    hostname: '',
    device_type: '',
    owner: '',
    purpose: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.region_id) {
      newErrors.region_id = 'Region is required';
    }

    if (!formData.hostname) {
      newErrors.hostname = 'Hostname is required';
    } else if (formData.hostname.length < 2) {
      newErrors.hostname = 'Hostname must be at least 2 characters';
    } else if (formData.hostname.length > 100) {
      newErrors.hostname = 'Hostname must be less than 100 characters';
    } else if (!/^[a-zA-Z0-9-_.]+$/.test(formData.hostname)) {
      newErrors.hostname = 'Hostname can only contain letters, numbers, hyphens, dots, and underscores';
    }

    if (formData.device_type && formData.device_type.length > 50) {
      newErrors.device_type = 'Device type must be less than 50 characters';
    }

    if (formData.owner && formData.owner.length > 100) {
      newErrors.owner = 'Owner must be less than 100 characters';
    }

    if (formData.purpose && formData.purpose.length > 500) {
      newErrors.purpose = 'Purpose must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createHost.mutateAsync({
        region_id: formData.region_id,
        hostname: formData.hostname,
        device_type: formData.device_type || undefined,
        owner: formData.owner || undefined,
        purpose: formData.purpose || undefined,
      });

      router.push('/dashboard/hosts');
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Failed to allocate host:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/hosts');
  };

  if (regionsLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const regions = regionsData?.results || [];
  const activeRegions = regions.filter((r) => r.status === 'Active');

  // Get selected region info
  const selectedRegion = regions.find((r) => r.region_id === formData.region_id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocate New Host</CardTitle>
        <CardDescription>
          Assign a new IP address from an available region. The system will automatically assign the
          next available IP.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="region_id">
              Region <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.region_id}
              onValueChange={(value) => setFormData({ ...formData, region_id: value })}
            >
              <SelectTrigger id="region_id" className={errors.region_id ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {activeRegions.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No active regions available. Create a region first.
                  </div>
                ) : (
                  activeRegions.map((region) => (
                    <SelectItem key={region.region_id} value={region.region_id}>
                      {region.region_name} ({region.cidr}) - {region.allocated_hosts}/254 used
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.region_id && <p className="text-sm text-destructive">{errors.region_id}</p>}
            {selectedRegion && (
              <p className="text-sm text-muted-foreground">
                Available IPs: {254 - (selectedRegion.allocated_hosts ?? 0)} •{' '}
                Utilization: {(selectedRegion.utilization_percentage ?? 0).toFixed(1)}%
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hostname">
              Hostname <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hostname"
              placeholder="e.g., web-server-01, db-primary"
              value={formData.hostname}
              onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
              className={errors.hostname ? 'border-destructive' : ''}
            />
            {errors.hostname && <p className="text-sm text-destructive">{errors.hostname}</p>}
            <p className="text-sm text-muted-foreground">
              A unique identifier for this host (letters, numbers, hyphens, dots, underscores)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device_type">Device Type (Optional)</Label>
            <Input
              id="device_type"
              placeholder="e.g., Server, Router, Switch, VM"
              value={formData.device_type}
              onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
              className={errors.device_type ? 'border-destructive' : ''}
            />
            {errors.device_type && <p className="text-sm text-destructive">{errors.device_type}</p>}
            <p className="text-sm text-muted-foreground">Type of device or system</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">Owner (Optional)</Label>
            <Input
              id="owner"
              placeholder="e.g., DevOps Team, John Doe"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              className={errors.owner ? 'border-destructive' : ''}
            />
            {errors.owner && <p className="text-sm text-destructive">{errors.owner}</p>}
            <p className="text-sm text-muted-foreground">Team or person responsible for this host</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose (Optional)</Label>
            <Textarea
              id="purpose"
              placeholder="Describe the purpose of this host..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className={errors.purpose ? 'border-destructive' : ''}
              rows={4}
            />
            {errors.purpose && <p className="text-sm text-destructive">{errors.purpose}</p>}
            <p className="text-sm text-muted-foreground">
              What this host is used for (max 500 characters)
            </p>
          </div>

          {selectedRegion && (
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium mb-2">Auto-Assignment Preview</h4>
              <p className="text-sm text-muted-foreground">
                The system will automatically assign the next available IP address in the{' '}
                <code className="font-mono">{selectedRegion.cidr}</code> range when you allocate this
                host.
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={createHost.isPending || activeRegions.length === 0}>
              {createHost.isPending ? 'Allocating...' : 'Allocate Host'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useRegions } from '@/lib/hooks/use-regions';
import { useBatchCreateHosts } from '@/lib/hooks/use-hosts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export function BatchHostForm() {
  const router = useRouter();
  const { data: regionsData, isLoading: regionsLoading } = useRegions();
  const batchCreate = useBatchCreateHosts();

  const [formData, setFormData] = useState({
    region_id: '',
    count: 1,
    hostname_prefix: '',
    device_type: '',
    owner: '',
    purpose: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Generate preview hostnames
  const previewHostnames = useMemo(() => {
    if (formData.hostname_prefix && formData.count > 0) {
      return Array.from({ length: Math.min(formData.count, 10) }, (_, i) => {
        const number = String(i + 1).padStart(2, '0');
        return `${formData.hostname_prefix}-${number}`;
      });
    }
    return [];
  }, [formData.hostname_prefix, formData.count]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.region_id) {
      newErrors.region_id = 'Region is required';
    }

    if (!formData.count || formData.count < 1) {
      newErrors.count = 'Count must be at least 1';
    } else if (formData.count > 100) {
      newErrors.count = 'Count cannot exceed 100';
    }

    if (!formData.hostname_prefix) {
      newErrors.hostname_prefix = 'Hostname prefix is required';
    } else if (formData.hostname_prefix.length < 2) {
      newErrors.hostname_prefix = 'Hostname prefix must be at least 2 characters';
    } else if (!/^[a-zA-Z0-9-_]+$/.test(formData.hostname_prefix)) {
      newErrors.hostname_prefix =
        'Hostname prefix can only contain letters, numbers, hyphens, and underscores';
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
      await batchCreate.mutateAsync({
        region_id: formData.region_id,
        count: formData.count,
        hostname_prefix: formData.hostname_prefix,
        device_type: formData.device_type || undefined,
        owner: formData.owner || undefined,
        purpose: formData.purpose || undefined,
      });

      router.push('/dashboard/hosts');
    } catch (error) {
      console.error('Failed to batch create hosts:', error);
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
  const selectedRegion = regions.find((r) => r.region_id === formData.region_id);
  const availableIPs = selectedRegion ? 254 - (selectedRegion.allocated_hosts ?? 0) : 0;
  const canAllocate = availableIPs >= formData.count;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Allocate Hosts</CardTitle>
        <CardDescription>
          Allocate multiple IP addresses at once. The system will automatically assign consecutive
          IPs and generate hostnames with sequential numbering.
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
                      {region.region_name} ({region.cidr}) - {254 - (region.allocated_hosts ?? 0)} IPs
                      available
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.region_id && <p className="text-sm text-destructive">{errors.region_id}</p>}
            {selectedRegion && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Available IPs: {availableIPs} • Utilization:{' '}
                  {(selectedRegion.utilization_percentage ?? 0).toFixed(1)}%
                </span>
                {!canAllocate && (
                  <Badge variant="destructive">Insufficient capacity</Badge>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="count">
              Number of Hosts <span className="text-destructive">*</span>
            </Label>
            <Input
              id="count"
              type="number"
              min="1"
              max="100"
              placeholder="e.g., 10"
              value={formData.count}
              onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) || 0 })}
              className={errors.count ? 'border-destructive' : ''}
            />
            {errors.count && <p className="text-sm text-destructive">{errors.count}</p>}
            <p className="text-sm text-muted-foreground">
              Number of hosts to allocate (1-100)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hostname_prefix">
              Hostname Prefix <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hostname_prefix"
              placeholder="e.g., web-server, db-node"
              value={formData.hostname_prefix}
              onChange={(e) => setFormData({ ...formData, hostname_prefix: e.target.value })}
              className={errors.hostname_prefix ? 'border-destructive' : ''}
            />
            {errors.hostname_prefix && (
              <p className="text-sm text-destructive">{errors.hostname_prefix}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Base name for hostnames (will be appended with -01, -02, etc.)
            </p>
          </div>

          {previewHostnames.length > 0 && (
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium mb-2">Hostname Preview</h4>
              <div className="flex flex-wrap gap-2">
                {previewHostnames.map((hostname: string, i: number) => (
                  <Badge key={i} variant="outline">
                    {hostname}
                  </Badge>
                ))}
                {formData.count > 10 && (
                  <Badge variant="secondary">+{formData.count - 10} more</Badge>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="device_type">Device Type (Optional)</Label>
            <Input
              id="device_type"
              placeholder="e.g., Server, VM, Container"
              value={formData.device_type}
              onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
              className={errors.device_type ? 'border-destructive' : ''}
            />
            {errors.device_type && <p className="text-sm text-destructive">{errors.device_type}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">Owner (Optional)</Label>
            <Input
              id="owner"
              placeholder="e.g., DevOps Team"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              className={errors.owner ? 'border-destructive' : ''}
            />
            {errors.owner && <p className="text-sm text-destructive">{errors.owner}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose (Optional)</Label>
            <Input
              id="purpose"
              placeholder="Describe the purpose of these hosts..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className={errors.purpose ? 'border-destructive' : ''}
            />
            {errors.purpose && <p className="text-sm text-destructive">{errors.purpose}</p>}
          </div>

          {selectedRegion && canAllocate && (
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium mb-2">Batch Allocation Summary</h4>
              <p className="text-sm text-muted-foreground">
                The system will allocate <strong>{formData.count}</strong> consecutive IP addresses
                in the <code className="font-mono">{selectedRegion.cidr}</code> range with hostnames
                from <strong>{formData.hostname_prefix}-01</strong> to{' '}
                <strong>
                  {formData.hostname_prefix}-{String(formData.count).padStart(2, '0')}
                </strong>
                .
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={batchCreate.isPending || activeRegions.length === 0 || !canAllocate}
            >
              {batchCreate.isPending ? 'Allocating...' : `Allocate ${formData.count} Hosts`}
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

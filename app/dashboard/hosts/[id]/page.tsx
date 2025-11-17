'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useHost, useUpdateHost, useReleaseHost } from '@/lib/hooks/use-hosts';
import { useRegion } from '@/lib/hooks/use-regions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CommentsSection } from '@/components/ipam/comments-section';
import { CopyButton } from '@/components/shared/copy-button';
import { formatDate, getStatusBadgeVariant } from '@/lib/utils/format';
import { ArrowLeft, Edit, Trash2, Save, X, ExternalLink } from 'lucide-react';

export default function HostDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const hostId = params.id as string;

  const { data: host, isLoading, error } = useHost(hostId);
  const { data: region } = useRegion(host?.region_id || '');
  const updateHost = useUpdateHost();
  const releaseHost = useReleaseHost();

  const [isEditing, setIsEditing] = useState(false);
  const [showReleaseDialog, setShowReleaseDialog] = useState(false);
  const [releaseReason, setReleaseReason] = useState('');

  const [editForm, setEditForm] = useState({
    hostname: '',
    device_type: '',
    owner: '',
    purpose: '',
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !host) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load host details</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditForm({
      hostname: host.hostname,
      device_type: host.device_type || '',
      owner: host.owner_name || host.owner || '',
      purpose: host.purpose || '',
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      hostname: '',
      device_type: '',
      owner: '',
      purpose: '',
    });
  };

  const handleSaveEdit = async () => {
    try {
      await updateHost.mutateAsync({
        hostId: host.host_id,
        updates: {
          hostname: editForm.hostname,
          device_type: editForm.device_type || undefined,
          owner: editForm.owner || undefined,
          purpose: editForm.purpose || undefined,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update host:', error);
    }
  };

  const handleRelease = async () => {
    if (!releaseReason.trim()) {
      return;
    }

    try {
      await releaseHost.mutateAsync({
        hostId: host.host_id,
        reason: releaseReason,
      });
      setShowReleaseDialog(false);
      router.push('/dashboard/hosts');
    } catch (error) {
      console.error('Failed to release host:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {isEditing ? (
              <Input
                value={editForm.hostname}
                onChange={(e) => setEditForm({ ...editForm, hostname: e.target.value })}
                className="text-3xl font-bold h-12"
              />
            ) : (
              <h2 className="text-3xl font-bold tracking-tight">{host.hostname}</h2>
            )}
          </div>
          <div className="flex items-center gap-2 ml-12">
            <code className="text-lg font-mono">{host.ip_address}</code>
            <CopyButton value={host.ip_address} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(host.status)} className="text-lg px-4 py-2">
            {host.status}
          </Badge>
          {!isEditing && host.status === 'Active' && (
            <>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setShowReleaseDialog(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Release
              </Button>
            </>
          )}
          {isEditing && (
            <>
              <Button size="sm" onClick={handleSaveEdit} disabled={updateHost.isPending}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Host Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Host Information</CardTitle>
          <CardDescription>IP address allocation and metadata</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">IP Address</p>
              <div className="flex items-center gap-2">
                <code className="text-lg font-mono">{host.ip_address}</code>
                <CopyButton value={host.ip_address} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">X.Y.Z Values</p>
              <code className="text-lg font-mono">
                {host.x_octet}.{host.y_octet}.{host.z_octet}.x
              </code>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={getStatusBadgeVariant(host.status)}>{host.status}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Region</p>
              {region ? (
                <Button
                  variant="link"
                  className="h-auto p-0 text-base"
                  onClick={() => router.push(`/dashboard/regions/${region.region_id}`)}
                >
                  {region.region_name}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              ) : (
                <p className="text-base">{host.region_id}</p>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="device_type">Device Type</Label>
                  <Input
                    id="device_type"
                    value={editForm.device_type}
                    onChange={(e) => setEditForm({ ...editForm, device_type: e.target.value })}
                    placeholder="e.g., Server, Router, VM"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner">Owner</Label>
                  <Input
                    id="owner"
                    value={editForm.owner}
                    onChange={(e) => setEditForm({ ...editForm, owner: e.target.value })}
                    placeholder="Team or person responsible"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Textarea
                    id="purpose"
                    value={editForm.purpose}
                    onChange={(e) => setEditForm({ ...editForm, purpose: e.target.value })}
                    placeholder="What this host is used for"
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <>
                {host.device_type && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Device Type:</span>
                    <span className="font-medium">{host.device_type}</span>
                  </div>
                )}
                {host.owner_name && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Owner:</span>
                    <span className="font-medium">{host.owner_name}</span>
                  </div>
                )}
                {host.purpose && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Purpose:</p>
                    <p className="text-sm">{host.purpose}</p>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Created:</span>
              <span>{formatDate(host.created_at)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated:</span>
              <span>{formatDate(host.updated_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parent Region Details */}
      {region && (
        <Card>
          <CardHeader>
            <CardTitle>Parent Region</CardTitle>
            <CardDescription>Network region containing this host</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Region Name</p>
                <Button
                  variant="link"
                  className="h-auto p-0 text-base font-medium"
                  onClick={() => router.push(`/dashboard/regions/${region.region_id}`)}
                >
                  {region.region_name}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">CIDR Block</p>
                <code className="text-base font-mono">{region.cidr}</code>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Country</p>
                <Button
                  variant="link"
                  className="h-auto p-0 text-base"
                  onClick={() => router.push(`/dashboard/countries/${region.country}`)}
                >
                  {region.country}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Region Status</p>
                <Badge variant={getStatusBadgeVariant(region.status)}>{region.status}</Badge>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Region Utilization</span>
                <span className="font-medium">{(region.utilization_percentage ?? 0).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    (region.utilization_percentage ?? 0) < 50
                      ? 'bg-green-500'
                      : (region.utilization_percentage ?? 0) < 80
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(region.utilization_percentage ?? 0, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {region.allocated_hosts} / 254 hosts allocated
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      <CommentsSection resourceType="host" resourceId={host.host_id} />

      {/* Release Dialog */}
      <Dialog open={showReleaseDialog} onOpenChange={setShowReleaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Release Host</DialogTitle>
            <DialogDescription>
              This action will release the IP address and mark the host as inactive. You must provide
              a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">Host: {host.hostname}</p>
              <p className="text-sm text-muted-foreground">IP: {host.ip_address}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Release *</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for releasing this host..."
                value={releaseReason}
                onChange={(e) => setReleaseReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReleaseDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRelease}
              disabled={!releaseReason.trim() || releaseHost.isPending}
            >
              {releaseHost.isPending ? 'Releasing...' : 'Release Host'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

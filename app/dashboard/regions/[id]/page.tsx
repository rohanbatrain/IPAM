'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRegion, useUpdateRegion, useRetireRegion } from '@/lib/hooks/use-regions';
import { useHosts } from '@/lib/hooks/use-hosts';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CommentsSection } from '@/components/ipam/comments-section';
import { formatPercentage, formatDate, getStatusBadgeVariant, getProgressBarWidth } from '@/lib/utils/format';
import { formatOwner, getOwnerTooltip } from '@/lib/utils/owner-utils';
import { ArrowLeft, Edit, Trash2, Save, X } from 'lucide-react';

export default function RegionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const regionId = params.id as string;

  const { data: region, isLoading, error } = useRegion(regionId);
  const { data: hostsData } = useHosts({ region_id: regionId });
  const updateRegion = useUpdateRegion();
  const retireRegion = useRetireRegion();

  const [isEditing, setIsEditing] = useState(false);
  const [showRetireDialog, setShowRetireDialog] = useState(false);
  const [retireReason, setRetireReason] = useState('');
  const [retireCascade, setRetireCascade] = useState(false);

  const [editForm, setEditForm] = useState({
    region_name: '',
    description: '',
    owner: '',
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

  if (error || !region) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load region details</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  const hosts = hostsData?.results || [];
  const totalCapacity = 254; // /24 network has 254 usable IPs
  const allocatedHosts = region.allocated_hosts ?? 0;
  const availableIPs = totalCapacity - allocatedHosts;
  const utilizationPercentage = region.utilization_percentage ?? 0;

  const handleEdit = () => {
    setEditForm({
      region_name: region.region_name,
      description: region.description || '',
      owner: region.owner_name || region.owner || '',
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      region_name: '',
      description: '',
      owner: '',
    });
  };

  const handleSaveEdit = async () => {
    try {
      await updateRegion.mutateAsync({
        regionId: region.region_id,
        updates: {
          region_name: editForm.region_name,
          description: editForm.description || undefined,
          owner: editForm.owner || undefined,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update region:', error);
    }
  };

  const handleRetire = async () => {
    if (!retireReason.trim()) {
      return;
    }

    try {
      await retireRegion.mutateAsync({
        regionId: region.region_id,
        reason: retireReason,
        cascade: retireCascade,
      });
      setShowRetireDialog(false);
      router.push('/dashboard/regions');
    } catch (error) {
      console.error('Failed to retire region:', error);
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
                value={editForm.region_name}
                onChange={(e) => setEditForm({ ...editForm, region_name: e.target.value })}
                className="text-3xl font-bold h-12"
              />
            ) : (
              <h2 className="text-3xl font-bold tracking-tight">{region.region_name}</h2>
            )}
          </div>
          <p className="text-muted-foreground ml-12">{region.country}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(region.status)} className="text-lg px-4 py-2">
            {region.status}
          </Badge>
          {!isEditing && region.status === 'Active' && (
            <>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowRetireDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Retire
              </Button>
            </>
          )}
          {isEditing && (
            <>
              <Button size="sm" onClick={handleSaveEdit} disabled={updateRegion.isPending}>
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

      {/* Region Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Region Information</CardTitle>
          <CardDescription>Network allocation details and metadata</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">CIDR Block</p>
              <code className="text-lg font-mono">{region.cidr}</code>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">X.Y Values</p>
              <code className="text-lg font-mono">
                {region.x_octet}.{region.y_octet}.x.x
              </code>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Allocated Hosts</p>
              <p className="text-2xl font-bold">
                {allocatedHosts} / {totalCapacity}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Available IPs</p>
              <p className="text-2xl font-bold">{availableIPs}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {isEditing ? (
              <>
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Additional details about this region"
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <>
                {(region.owner || region.owner_name) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Owner:</span>
                    <span 
                      className="font-medium"
                      title={getOwnerTooltip(region.owner || region.owner_name)}
                    >
                      {formatOwner(region.owner || region.owner_name)}
                    </span>
                  </div>
                )}
                {region.description && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Description:</p>
                    <p className="text-sm">{region.description}</p>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Created:</span>
              <span>{formatDate(region.created_at)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated:</span>
              <span>{formatDate(region.updated_at)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capacity Gauge */}
      <Card>
        <CardHeader>
          <CardTitle>Capacity Utilization</CardTitle>
          <CardDescription>IP address allocation status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{formatPercentage(utilizationPercentage)}</span>
              <Badge variant={
                utilizationPercentage < 50 ? 'default' :
                utilizationPercentage < 80 ? 'secondary' : 'destructive'
              }>
                {utilizationPercentage < 50 ? 'Healthy' :
                 utilizationPercentage < 80 ? 'Moderate' : 'High'}
              </Badge>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  utilizationPercentage < 50
                    ? 'bg-green-500'
                    : utilizationPercentage < 80
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ 
                  width: `${getProgressBarWidth(utilizationPercentage)}%`,
                  minWidth: utilizationPercentage > 0 ? '2px' : '0'
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{availableIPs}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{allocatedHosts}</p>
                <p className="text-xs text-muted-foreground">Allocated</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCapacity}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allocated Hosts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Allocated Hosts</h3>
            <p className="text-sm text-muted-foreground">
              {hosts.length} {hosts.length === 1 ? 'host' : 'hosts'} in this region
            </p>
          </div>
          <Button onClick={() => router.push(`/dashboard/hosts/create?region=${regionId}`)}>
            Allocate Host
          </Button>
        </div>

        {hosts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No hosts allocated in this region yet</p>
              <Button
                className="mt-4"
                onClick={() => router.push(`/dashboard/hosts/create?region=${regionId}`)}
              >
                Allocate First Host
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Hostname</TableHead>
                  <TableHead>Device Type</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hosts.map((host) => (
                  <TableRow
                    key={host.host_id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/dashboard/hosts/${host.host_id}`)}
                  >
                    <TableCell>
                      <code className="text-sm font-mono">{host.ip_address}</code>
                    </TableCell>
                    <TableCell className="font-medium">{host.hostname}</TableCell>
                    <TableCell>{host.device_type || '-'}</TableCell>
                    <TableCell>{host.owner_name || host.owner || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(host.status)}>{host.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(host.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <CommentsSection resourceType="region" resourceId={region.region_id} />

      {/* Retire Dialog */}
      <Dialog open={showRetireDialog} onOpenChange={setShowRetireDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retire Region</DialogTitle>
            <DialogDescription>
              This action will mark the region as retired. You must provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Retirement *</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for retiring this region..."
                value={retireReason}
                onChange={(e) => setRetireReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="cascade"
                checked={retireCascade}
                onChange={(e) => setRetireCascade(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="cascade" className="text-sm font-normal">
                Also release all allocated hosts in this region ({allocatedHosts} hosts)
              </Label>
            </div>
            {allocatedHosts > 0 && !retireCascade && (
              <p className="text-sm text-yellow-600">
                Warning: This region has {allocatedHosts} allocated hosts. They will remain active unless you enable cascade.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRetireDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRetire}
              disabled={!retireReason.trim() || retireRegion.isPending}
            >
              {retireRegion.isPending ? 'Retiring...' : 'Retire Region'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

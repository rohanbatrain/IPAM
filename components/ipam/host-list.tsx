'use client';

import { useState } from 'react';
import { useHosts, useReleaseHost, useUpdateHost } from '@/lib/hooks/use-hosts';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, getStatusBadgeVariant } from '@/lib/utils/format';
import { useRouter } from 'next/navigation';
import { Trash2, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { BulkTagEditor } from '@/components/dialogs/bulk-tag-editor';
import { useTableKeyboardNav } from '@/lib/hooks/use-table-keyboard-nav';
import { cn } from '@/lib/utils/cn';

export function HostList() {
  const { data, isLoading, error } = useHosts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHosts, setSelectedHosts] = useState<Set<string>>(new Set());
  const [showBulkReleaseDialog, setShowBulkReleaseDialog] = useState(false);
  const [showBulkTagEditor, setShowBulkTagEditor] = useState(false);
  const [bulkReleaseReason, setBulkReleaseReason] = useState('');
  const [isReleasingBulk, setIsReleasingBulk] = useState(false);
  const router = useRouter();
  const releaseHost = useReleaseHost();
  const updateHost = useUpdateHost();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load hosts</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  const hosts = data?.results || [];

  if (hosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hosts allocated yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Allocate your first host to get started
        </p>
      </div>
    );
  }

  // Filter hosts by search term
  const filteredHosts = hosts.filter(
    (host) =>
      host.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      host.ip_address.includes(searchTerm) ||
      host.owner?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeHosts = filteredHosts.filter((h) => h.status === 'Active');
  const allSelected = activeHosts.length > 0 && activeHosts.every((h) => selectedHosts.has(h.host_id));
  const someSelected = selectedHosts.size > 0;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedHosts(new Set());
    } else {
      setSelectedHosts(new Set(activeHosts.map((h) => h.host_id)));
    }
  };

  const handleSelectHost = (hostId: string, checked: boolean) => {
    const newSelected = new Set(selectedHosts);
    if (checked) {
      newSelected.add(hostId);
    } else {
      newSelected.delete(hostId);
    }
    setSelectedHosts(newSelected);
  };

  const handleBulkRelease = async () => {
    if (!bulkReleaseReason.trim() || selectedHosts.size === 0) {
      return;
    }

    setIsReleasingBulk(true);
    const hostsToRelease = Array.from(selectedHosts);
    let successCount = 0;
    let failCount = 0;

    for (const hostId of hostsToRelease) {
      try {
        await releaseHost.mutateAsync({ hostId, reason: bulkReleaseReason });
        successCount++;
      } catch (error) {
        failCount++;
        console.error(`Failed to release host ${hostId}:`, error);
      }
    }

    setIsReleasingBulk(false);
    setShowBulkReleaseDialog(false);
    setBulkReleaseReason('');
    setSelectedHosts(new Set());

    if (successCount > 0) {
      toast.success(`Successfully released ${successCount} host(s)`);
    }
    if (failCount > 0) {
      toast.error(`Failed to release ${failCount} host(s)`);
    }
  };

  const handleBulkTagUpdate = async (
    tagsToAdd: Record<string, string>,
    tagsToRemove: string[]
  ) => {
    const hostsToUpdate = Array.from(selectedHosts);
    let successCount = 0;
    let failCount = 0;

    for (const hostId of hostsToUpdate) {
      try {
        // Note: This assumes the backend supports tags on hosts
        // If not, this will need to be adjusted when backend support is added
        const updates: any = {};
        if (Object.keys(tagsToAdd).length > 0 || tagsToRemove.length > 0) {
          updates.tags = { add: tagsToAdd, remove: tagsToRemove };
        }
        await updateHost.mutateAsync({ hostId, updates });
        successCount++;
      } catch (error) {
        failCount++;
        console.error(`Failed to update tags for host ${hostId}:`, error);
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully updated tags for ${successCount} host(s)`);
    }
    if (failCount > 0) {
      toast.error(`Failed to update tags for ${failCount} host(s)`);
    }

    setSelectedHosts(new Set());
  };

  const handleRowClick = (hostId: string, event: React.MouseEvent) => {
    // Don't navigate if clicking checkbox
    if ((event.target as HTMLElement).closest('input[type="checkbox"]')) {
      return;
    }
    router.push(`/dashboard/hosts/${hostId}`);
  };

  // Keyboard navigation
  const { getTableProps, getRowProps, focusedRow } = useTableKeyboardNav({
    rowCount: filteredHosts.length,
    onRowSelect: (rowIndex) => {
      const host = filteredHosts[rowIndex];
      if (host) {
        router.push(`/dashboard/hosts/${host.host_id}`);
      }
    },
    onRowToggle: (rowIndex) => {
      const host = filteredHosts[rowIndex];
      if (host && host.status === 'Active') {
        handleSelectHost(host.host_id, !selectedHosts.has(host.host_id));
      }
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search hosts by hostname, IP, or owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          {filteredHosts.length} {filteredHosts.length === 1 ? 'host' : 'hosts'}
        </div>
      </div>

      {someSelected && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">{selectedHosts.size} selected</span>
          <div className="flex gap-2 ml-auto">
            <Button size="sm" variant="outline" onClick={() => setShowBulkTagEditor(true)}>
              <Tag className="h-4 w-4 mr-2" />
              Edit Tags
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setShowBulkReleaseDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Release Selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedHosts(new Set())}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table {...getTableProps()}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onChange={handleSelectAll}
                  disabled={activeHosts.length === 0}
                />
              </TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Hostname</TableHead>
              <TableHead>Device Type</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHosts.map((host, index) => (
              <TableRow
                key={host.host_id}
                {...getRowProps(index)}
                className={cn(
                  'cursor-pointer transition-colors',
                  focusedRow === index && 'bg-accent'
                )}
                onClick={(e) => handleRowClick(host.host_id, e)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedHosts.has(host.host_id)}
                    onChange={(e) => handleSelectHost(host.host_id, e.target.checked)}
                    disabled={host.status !== 'Active'}
                  />
                </TableCell>
                <TableCell>
                  <code className="text-sm font-mono">{host.ip_address}</code>
                </TableCell>
                <TableCell className="font-medium">{host.hostname}</TableCell>
                <TableCell>{host.device_type || '-'}</TableCell>
                <TableCell>{host.owner || '-'}</TableCell>
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

      {filteredHosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hosts match your search</p>
        </div>
      )}

      {/* Bulk Tag Editor */}
      <BulkTagEditor
        open={showBulkTagEditor}
        onOpenChange={setShowBulkTagEditor}
        selectedCount={selectedHosts.size}
        onApply={handleBulkTagUpdate}
      />

      {/* Bulk Release Dialog */}
      <Dialog open={showBulkReleaseDialog} onOpenChange={setShowBulkReleaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Release Multiple Hosts</DialogTitle>
            <DialogDescription>
              This action will release {selectedHosts.size} host(s). You must provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">Selected Hosts: {selectedHosts.size}</p>
              <p className="text-sm text-muted-foreground mt-1">
                All selected hosts will be released and their IP addresses will become available for
                reallocation.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulk-reason">Reason for Release *</Label>
              <Textarea
                id="bulk-reason"
                placeholder="Enter the reason for releasing these hosts..."
                value={bulkReleaseReason}
                onChange={(e) => setBulkReleaseReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkReleaseDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkRelease}
              disabled={!bulkReleaseReason.trim() || isReleasingBulk}
            >
              {isReleasingBulk ? 'Releasing...' : `Release ${selectedHosts.size} Hosts`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

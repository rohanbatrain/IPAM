'use client';

import { useState } from 'react';
import { useAuditLog } from '@/lib/hooks/use-audit';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/shared/pagination';
import { AuditDetailDialog } from './audit-detail-dialog';
import { format, parseISO } from 'date-fns';
import { FileText, Download, Filter, Search } from 'lucide-react';
import type { AuditEntry } from '@/lib/api/audit';

export function AuditLogViewer() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [actionType, setActionType] = useState<string>('all');
  const [resourceType, setResourceType] = useState<string>('all');
  const [searchUser, setSearchUser] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const filters = {
    page,
    page_size: pageSize,
    ...(actionType !== 'all' && { action_type: actionType }),
    ...(resourceType !== 'all' && { resource_type: resourceType }),
    ...(searchUser && { user: searchUser }),
  };

  const { data, isLoading, error } = useAuditLog(filters);

  const getActionBadge = (action: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      create: { color: 'bg-green-500 text-white', label: 'Created' },
      update: { color: 'bg-blue-500 text-white', label: 'Updated' },
      release: { color: 'bg-orange-500 text-white', label: 'Released' },
      retire: { color: 'bg-red-500 text-white', label: 'Retired' },
    };
    const variant = variants[action] || { color: 'bg-gray-500 text-white', label: action };
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  const getResourceIcon = (type: string) => {
    return <FileText className="h-4 w-4" />;
  };

  const handleExport = async () => {
    try {
      // Call the export API with current filters
      const response = await fetch('/api/ipam/audit/export?' + new URLSearchParams(
        Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ));

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get the blob data
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('Audit log exported successfully');
    } catch (error) {
      alert('Failed to export audit log. Please try again.');
      console.error('Export error:', error);
    }
  };

  const handleViewDetails = (entry: AuditEntry) => {
    setSelectedEntry(entry);
    setDetailDialogOpen(true);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Failed to load audit log
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              <CardDescription>Filter audit entries by criteria</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Action Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Action Type</label>
              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="release">Release</SelectItem>
                  <SelectItem value="retire">Retire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Resource Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Resource Type</label>
              <Select value={resourceType} onValueChange={setResourceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Resources</SelectItem>
                  <SelectItem value="region">Regions</SelectItem>
                  <SelectItem value="host">Hosts</SelectItem>
                  <SelectItem value="country">Countries</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* User Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">User</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Entries</CardTitle>
          <CardDescription>
            {data ? `${data.pagination.total_count} total entries` : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : data && data.results.length > 0 ? (
            <div className="space-y-3">
              {data.results.map((entry) => (
                <div
                  key={entry.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(entry)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      {/* Header */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {getActionBadge(entry.action_type)}
                        <Badge variant="outline" className="capitalize">
                          {getResourceIcon(entry.resource_type)}
                          <span className="ml-1">{entry.resource_type}</span>
                        </Badge>
                        <span className="text-sm font-medium">{entry.resource_name}</span>
                      </div>

                      {/* Details */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>User: <span className="font-medium text-foreground">{entry.user}</span></span>
                        <span>•</span>
                        <span>{format(parseISO(entry.timestamp), 'MMM dd, yyyy HH:mm:ss')}</span>
                      </div>

                      {/* Reason */}
                      {entry.reason && (
                        <div className="text-sm text-muted-foreground">
                          Reason: {entry.reason}
                        </div>
                      )}

                      {/* Changes Summary */}
                      {entry.changes && entry.changes.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {entry.changes.length} field{entry.changes.length !== 1 ? 's' : ''} changed
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No audit entries found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}

          {/* Pagination */}
          {data && data.pagination.total_pages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={data.pagination.total_pages}
                pageSize={pageSize}
                totalCount={data.pagination.total_count}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      {selectedEntry && (
        <AuditDetailDialog
          entry={selectedEntry}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
        />
      )}
    </div>
  );
}

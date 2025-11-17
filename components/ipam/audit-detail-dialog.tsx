'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { FileText, User, Clock, ArrowRight } from 'lucide-react';
import type { AuditEntry } from '@/lib/api/audit';

interface AuditDetailDialogProps {
  entry: AuditEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditDetailDialog({ entry, open, onOpenChange }: AuditDetailDialogProps) {
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

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Audit Entry Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this audit entry
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {getActionBadge(entry.action_type)}
                <Badge variant="outline" className="capitalize">
                  {entry.resource_type}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Resource</div>
                  <div className="font-medium">{entry.resource_name}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Resource ID</div>
                  <div className="font-mono text-xs">{entry.resource_id}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">User:</span>
                <span className="font-medium">{entry.user}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Timestamp:</span>
                <span className="font-medium">
                  {format(parseISO(entry.timestamp), 'MMMM dd, yyyy HH:mm:ss')}
                </span>
              </div>

              {entry.reason && (
                <div className="pt-2 border-t">
                  <div className="text-muted-foreground text-sm mb-1">Reason</div>
                  <div className="text-sm">{entry.reason}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Changes Card */}
          {entry.changes && entry.changes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {entry.changes.map((change, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="font-medium text-sm mb-2 capitalize">
                        {change.field.replace(/_/g, ' ')}
                      </div>
                      <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-start">
                        {/* Old Value */}
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Before</div>
                          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded p-2">
                            <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                              {formatValue(change.old_value)}
                            </pre>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center justify-center pt-6">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>

                        {/* New Value */}
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">After</div>
                          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded p-2">
                            <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                              {formatValue(change.new_value)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata Card */}
          {entry.metadata && Object.keys(entry.metadata).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Additional Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(entry.metadata).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2 text-sm">
                      <span className="text-muted-foreground capitalize min-w-[120px]">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="font-mono text-xs break-all">
                        {formatValue(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

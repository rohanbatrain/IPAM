'use client';

import { useState } from 'react';
import { AuditLogViewer } from '@/components/ipam/audit-log-viewer';
import { AllocationTimeline } from '@/components/ipam/allocation-timeline';
import { Button } from '@/components/ui/button';
import { List, Clock } from 'lucide-react';

type ViewMode = 'list' | 'timeline';

export default function AuditPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground mt-2">
            View all allocation operations and changes
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 border rounded-lg p-1">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            List View
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('timeline')}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            Timeline
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? <AuditLogViewer /> : <AllocationTimeline />}
    </div>
  );
}

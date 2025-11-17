'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Loading fallback for dialogs
const DialogSkeleton = () => (
  <Dialog open>
    <DialogContent>
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

// Lazy load heavy dialog components
export const ExportDialog = dynamic(
  () => import('./export-dialog').then((mod) => ({ default: mod.ExportDialog })),
  {
    loading: () => <DialogSkeleton />,
  }
);

export const ImportDialog = dynamic(
  () => import('./import-dialog').then((mod) => ({ default: mod.ImportDialog })),
  {
    loading: () => <DialogSkeleton />,
  }
);

export const BulkTagEditor = dynamic(
  () => import('./bulk-tag-editor').then((mod) => ({ default: mod.BulkTagEditor })),
  {
    loading: () => <DialogSkeleton />,
  }
);

export const AnalyticsExportDialog = dynamic(
  () => import('../ipam/analytics-export-dialog').then((mod) => ({ default: mod.AnalyticsExportDialog })),
  {
    loading: () => <DialogSkeleton />,
  }
);

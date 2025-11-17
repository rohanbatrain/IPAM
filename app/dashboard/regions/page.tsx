'use client';

import { useState } from 'react';
import { RegionList } from '@/components/ipam/region-list';
import { Button } from '@/components/ui/button';
import { ImportDialog } from '@/components/dialogs/import-dialog';
import { ExportDialog } from '@/components/dialogs/export-dialog';
import { useRouter } from 'next/navigation';
import { useImportRegions, useDownloadTemplate } from '@/lib/hooks/use-import';
import { useExportRegions } from '@/lib/hooks/use-export';
import { Upload, Download, FileDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const REGION_FIELDS = [
  { key: 'region_id', label: 'Region ID' },
  { key: 'region_name', label: 'Region Name' },
  { key: 'country', label: 'Country' },
  { key: 'cidr', label: 'CIDR' },
  { key: 'x_octet', label: 'X Value' },
  { key: 'y_octet', label: 'Y Value' },
  { key: 'status', label: 'Status' },
  { key: 'allocated_hosts', label: 'Allocated Hosts' },
  { key: 'utilization_percentage', label: 'Utilization %' },
  { key: 'owner', label: 'Owner' },
  { key: 'description', label: 'Description' },
  { key: 'created_at', label: 'Created At' },
  { key: 'updated_at', label: 'Updated At' },
];

export default function RegionsPage() {
  const router = useRouter();
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const { mutateAsync: importRegions } = useImportRegions();
  const { mutateAsync: exportRegions } = useExportRegions();
  const { downloadRegionTemplate } = useDownloadTemplate();

  const handleExport = async (format: any, fields: string[]) => {
    await exportRegions({ format, fields });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Regions</h2>
          <p className="text-muted-foreground">Manage your allocated /24 network regions</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Templates
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={downloadRegionTemplate}>
                Download Region Template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" onClick={() => setExportDialogOpen(true)}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push('/dashboard/regions/create')}>
            Create Region
          </Button>
        </div>
      </div>

      <RegionList />

      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        type="regions"
        onImport={importRegions}
      />

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        type="regions"
        availableFields={REGION_FIELDS}
        onExport={handleExport}
      />
    </div>
  );
}

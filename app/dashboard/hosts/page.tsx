'use client';

import { useState } from 'react';
import { HostList } from '@/components/ipam/host-list';
import { Button } from '@/components/ui/button';
import { ImportDialog } from '@/components/dialogs/import-dialog';
import { ExportDialog } from '@/components/dialogs/export-dialog';
import { useRouter } from 'next/navigation';
import { useImportHosts, useDownloadTemplate } from '@/lib/hooks/use-import';
import { useExportHosts } from '@/lib/hooks/use-export';
import { Upload, Download, FileDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const HOST_FIELDS = [
  { key: 'host_id', label: 'Host ID' },
  { key: 'hostname', label: 'Hostname' },
  { key: 'ip_address', label: 'IP Address' },
  { key: 'region_id', label: 'Region ID' },
  { key: 'x_octet', label: 'X Value' },
  { key: 'y_octet', label: 'Y Value' },
  { key: 'z_octet', label: 'Z Value' },
  { key: 'status', label: 'Status' },
  { key: 'device_type', label: 'Device Type' },
  { key: 'owner', label: 'Owner' },
  { key: 'purpose', label: 'Purpose' },
  { key: 'created_at', label: 'Created At' },
  { key: 'updated_at', label: 'Updated At' },
];

export default function HostsPage() {
  const router = useRouter();
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const { mutateAsync: importHosts } = useImportHosts();
  const { mutateAsync: exportHosts } = useExportHosts();
  const { downloadHostTemplate } = useDownloadTemplate();

  const handleExport = async (format: any, fields: string[]) => {
    await exportHosts({ format, fields });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hosts</h2>
          <p className="text-muted-foreground">Manage individual IP address allocations</p>
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
              <DropdownMenuItem onClick={downloadHostTemplate}>
                Download Host Template
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
          <Button onClick={() => router.push('/dashboard/hosts/create')}>
            Allocate Host
          </Button>
        </div>
      </div>

      <HostList />

      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        type="hosts"
        onImport={importHosts}
      />

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        type="hosts"
        availableFields={HOST_FIELDS}
        onExport={handleExport}
      />
    </div>
  );
}

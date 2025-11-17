'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, Image, FileSpreadsheet } from 'lucide-react';

interface AnalyticsExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeRange: string;
}

type ExportFormat = 'csv' | 'json' | 'png' | 'pdf';

interface ExportOptions {
  includeCharts: boolean;
  includeGauges: boolean;
  includeForecasts: boolean;
  includeRawData: boolean;
}

export function AnalyticsExportDialog({
  open,
  onOpenChange,
  timeRange,
}: AnalyticsExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    includeCharts: true,
    includeGauges: true,
    includeForecasts: true,
    includeRawData: true,
  });

  const formats: Array<{
    value: ExportFormat;
    label: string;
    icon: React.ReactNode;
    description: string;
  }> = [
    {
      value: 'csv',
      label: 'CSV',
      icon: <FileSpreadsheet className="h-5 w-5" />,
      description: 'Spreadsheet format for data analysis',
    },
    {
      value: 'json',
      label: 'JSON',
      icon: <FileText className="h-5 w-5" />,
      description: 'Structured data for API integration',
    },
    {
      value: 'png',
      label: 'PNG',
      icon: <Image className="h-5 w-5" />,
      description: 'Chart images for presentations',
    },
    {
      value: 'pdf',
      label: 'PDF',
      icon: <FileText className="h-5 w-5" />,
      description: 'Complete report with charts and data',
    },
  ];

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, this would call the backend API
      // const response = await apiClient.post('/ipam/analytics/export', {
      //   format: selectedFormat,
      //   time_range: timeRange,
      //   options,
      // });

      // Show success message
      alert(`Analytics exported successfully as ${selectedFormat.toUpperCase()}\nTime range: ${timeRange}`);

      onOpenChange(false);
    } catch (error) {
      // Show error message
      alert('Export failed. Please try again or contact support.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Analytics</DialogTitle>
          <DialogDescription>
            Choose format and options for exporting analytics data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <div className="grid grid-cols-2 gap-3">
              {formats.map((format) => (
                <button
                  key={format.value}
                  onClick={() => setSelectedFormat(format.value)}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-colors text-left ${
                    selectedFormat === format.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="mt-0.5">{format.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{format.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {format.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <Label>Include in Export</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="charts"
                  checked={options.includeCharts}
                  onChange={(e) =>
                    setOptions({ ...options, includeCharts: e.target.checked })
                  }
                />
                <label
                  htmlFor="charts"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Utilization Charts
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gauges"
                  checked={options.includeGauges}
                  onChange={(e) =>
                    setOptions({ ...options, includeGauges: e.target.checked })
                  }
                />
                <label
                  htmlFor="gauges"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Capacity Gauges
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="forecasts"
                  checked={options.includeForecasts}
                  onChange={(e) =>
                    setOptions({ ...options, includeForecasts: e.target.checked })
                  }
                />
                <label
                  htmlFor="forecasts"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Capacity Forecasts
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rawData"
                  checked={options.includeRawData}
                  onChange={(e) =>
                    setOptions({ ...options, includeRawData: e.target.checked })
                  }
                />
                <label
                  htmlFor="rawData"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Raw Data Tables
                </label>
              </div>
            </div>
          </div>

          {/* Time Range Info */}
          <div className="rounded-lg bg-muted p-3 text-sm">
            <div className="font-medium mb-1">Export Details</div>
            <div className="text-muted-foreground">
              Time Range: <span className="font-medium text-foreground">{timeRange}</span>
            </div>
            <div className="text-muted-foreground">
              Format: <span className="font-medium text-foreground">{selectedFormat.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

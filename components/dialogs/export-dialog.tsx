'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileDown, FileJson, FileSpreadsheet, FileText } from 'lucide-react';
import { ExportFormat } from '@/lib/api/export';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'regions' | 'hosts' | 'countries';
  availableFields: Array<{ key: string; label: string }>;
  currentFilters?: Record<string, unknown>;
  onExport: (format: ExportFormat, fields: string[]) => Promise<void>;
}

export function ExportDialog({
  open,
  onOpenChange,
  type,
  availableFields,
  currentFilters,
  onExport,
}: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>(
    availableFields.map((f) => f.key)
  );
  const [isExporting, setIsExporting] = useState(false);

  const handleFieldToggle = (fieldKey: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldKey)
        ? prev.filter((f) => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const handleSelectAll = () => {
    setSelectedFields(availableFields.map((f) => f.key));
  };

  const handleDeselectAll = () => {
    setSelectedFields([]);
  };

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      return;
    }

    setIsExporting(true);
    try {
      await onExport(format, selectedFields);
      onOpenChange(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileText, description: 'Comma-separated values' },
    { value: 'json', label: 'JSON', icon: FileJson, description: 'JavaScript Object Notation' },
    { value: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'Microsoft Excel format' },
    { value: 'pdf', label: 'PDF', icon: FileDown, description: 'Portable Document Format' },
  ];

  const hasFilters = currentFilters && Object.keys(currentFilters).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Export Format</Label>
            <RadioGroup value={format} onValueChange={(value: string) => setFormat(value as ExportFormat)}>
              <div className="grid grid-cols-2 gap-3">
                {formatOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      className={`
                        relative flex items-start space-x-3 rounded-lg border p-4 cursor-pointer
                        transition-colors
                        ${format === option.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                      `}
                      onClick={() => setFormat(option.value as ExportFormat)}
                    >
                      <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <Label htmlFor={option.value} className="font-medium cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Field Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Select Fields</Label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={selectedFields.length === availableFields.length}
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeselectAll}
                  disabled={selectedFields.length === 0}
                >
                  Deselect All
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-3">
                {availableFields.map((field) => (
                  <div key={field.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.key}
                      checked={selectedFields.includes(field.key)}
                      onChange={() => handleFieldToggle(field.key)}
                    />
                    <Label
                      htmlFor={field.key}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {field.label}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <p className="text-xs text-muted-foreground">
              {selectedFields.length} of {availableFields.length} fields selected
            </p>
          </div>

          {/* Filter Info */}
          {hasFilters && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 p-3">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Active Filters
              </p>
              <div className="space-y-1">
                {Object.entries(currentFilters).map(([key, value]) => (
                  <p key={key} className="text-xs text-blue-700 dark:text-blue-300">
                    <span className="font-medium">{key}:</span> {String(value)}
                  </p>
                ))}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                These filters will be preserved in the export
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={selectedFields.length === 0 || isExporting}>
            {isExporting ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

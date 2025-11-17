'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImportForm } from '@/components/forms/import-form';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; message: string }>;
}

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'regions' | 'hosts';
  onImport: (data: any[]) => Promise<ImportResult>;
}

export function ImportDialog({ open, onOpenChange, type, onImport }: ImportDialogProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleImport = async (data: any[]) => {
    setIsImporting(true);
    setProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const importResult = await onImport(data);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResult(importResult);
    } catch (error) {
      setResult({
        success: 0,
        failed: data.length,
        errors: [{ row: 0, message: 'Import failed. Please try again.' }],
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setProgress(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Import {type === 'regions' ? 'Regions' : 'Hosts'}
          </DialogTitle>
        </DialogHeader>

        {!result ? (
          <>
            {isImporting ? (
              <div className="space-y-4 py-8">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Importing {type}... Please wait.
                  </p>
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {progress}% complete
                  </p>
                </div>
              </div>
            ) : (
              <ImportForm
                type={type}
                onImport={handleImport}
                onCancel={handleClose}
              />
            )}
          </>
        ) : (
          <div className="space-y-4 py-4">
            {result.success > 0 && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Successfully imported {result.success} {type}.
                </AlertDescription>
              </Alert>
            )}

            {result.failed > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to import {result.failed} {type}.
                  {result.errors.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {result.errors.slice(0, 5).map((error, index) => (
                        <div key={index} className="text-xs">
                          Row {error.row}: {error.message}
                        </div>
                      ))}
                      {result.errors.length > 5 && (
                        <div className="text-xs">
                          ... and {result.errors.length - 5} more errors
                        </div>
                      )}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button onClick={handleClose}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

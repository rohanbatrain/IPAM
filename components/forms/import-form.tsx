'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface ParsedRow {
  rowNumber: number;
  data: Record<string, string>;
  isValid: boolean;
  errors: ValidationError[];
}

interface ImportFormProps {
  type: 'regions' | 'hosts';
  onImport: (data: any[]) => Promise<void>;
  onCancel: () => void;
}

export function ImportForm({ type, onImport, onCancel }: ImportFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const csvFile = acceptedFiles[0];
    if (csvFile) {
      setFile(csvFile);
      setError(null);
      parseCSV(csvFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
  });

  const parseCSV = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        setError('CSV file is empty');
        setIsProcessing(false);
        return;
      }

      // Parse header
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Validate headers based on type
      const requiredHeaders = type === 'regions' 
        ? ['country', 'region_name']
        : ['region_id', 'hostname'];
      
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        setError(`Missing required columns: ${missingHeaders.join(', ')}`);
        setIsProcessing(false);
        return;
      }

      // Parse data rows
      const parsed: ParsedRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const rowData: Record<string, string> = {};
        
        headers.forEach((header, index) => {
          rowData[header] = values[index] || '';
        });

        const errors = validateRow(rowData, type);
        parsed.push({
          rowNumber: i,
          data: rowData,
          isValid: errors.length === 0,
          errors,
        });
      }

      setParsedData(parsed);
    } catch (err) {
      setError('Failed to parse CSV file. Please check the format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const validateRow = (data: Record<string, string>, type: 'regions' | 'hosts'): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (type === 'regions') {
      if (!data.country) {
        errors.push({ row: 0, field: 'country', message: 'Country is required' });
      }
      if (!data.region_name) {
        errors.push({ row: 0, field: 'region_name', message: 'Region name is required' });
      }
      if (data.region_name && data.region_name.length < 3) {
        errors.push({ row: 0, field: 'region_name', message: 'Region name must be at least 3 characters' });
      }
    } else {
      if (!data.region_id) {
        errors.push({ row: 0, field: 'region_id', message: 'Region ID is required' });
      }
      if (!data.hostname) {
        errors.push({ row: 0, field: 'hostname', message: 'Hostname is required' });
      }
      if (data.hostname && !/^[a-zA-Z0-9-]+$/.test(data.hostname)) {
        errors.push({ row: 0, field: 'hostname', message: 'Hostname can only contain letters, numbers, and hyphens' });
      }
    }

    return errors;
  };

  const handleImport = async () => {
    const validRows = parsedData.filter(row => row.isValid);
    if (validRows.length === 0) {
      setError('No valid rows to import');
      return;
    }

    try {
      setIsProcessing(true);
      await onImport(validRows.map(row => row.data));
    } catch (err) {
      setError('Import failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadErrorReport = () => {
    const invalidRows = parsedData.filter(row => !row.isValid);
    const csv = [
      'Row,Field,Error',
      ...invalidRows.flatMap(row =>
        row.errors.map(err => `${row.rowNumber},${err.field},${err.message}`)
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `import-errors-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFile = () => {
    setFile(null);
    setParsedData([]);
    setError(null);
  };

  const validCount = parsedData.filter(row => row.isValid).length;
  const invalidCount = parsedData.filter(row => !row.isValid).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import {type === 'regions' ? 'Regions' : 'Hosts'}</CardTitle>
        <CardDescription>
          Upload a CSV file to bulk import {type}. Download the template to see required columns.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!file ? (
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? 'Drop the CSV file here'
                : 'Drag and drop a CSV file here, or click to select'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supports .csv files only
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File info */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Validation summary */}
            {parsedData.length > 0 && (
              <div className="flex gap-2">
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {validCount} Valid
                </Badge>
                {invalidCount > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {invalidCount} Invalid
                  </Badge>
                )}
              </div>
            )}

            {/* Error alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Preview table */}
            {parsedData.length > 0 && (
              <div className="border rounded-lg">
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Row</TableHead>
                        <TableHead className="w-20">Status</TableHead>
                        {Object.keys(parsedData[0].data).map(key => (
                          <TableHead key={key}>{key}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.map((row) => (
                        <TableRow key={row.rowNumber} className={!row.isValid ? 'bg-destructive/5' : ''}>
                          <TableCell className="font-mono text-sm">{row.rowNumber}</TableCell>
                          <TableCell>
                            {row.isValid ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            )}
                          </TableCell>
                          {Object.entries(row.data).map(([key, value]) => (
                            <TableCell key={key} className={
                              row.errors.some(e => e.field === key) ? 'text-destructive' : ''
                            }>
                              {value}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between">
              <div className="flex gap-2">
                {invalidCount > 0 && (
                  <Button variant="outline" size="sm" onClick={downloadErrorReport}>
                    Download Error Report
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={validCount === 0 || isProcessing}
                >
                  {isProcessing ? 'Importing...' : `Import ${validCount} ${type}`}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

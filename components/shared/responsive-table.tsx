'use client';

import { useIsMobile } from '@/lib/hooks/use-mobile';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  mobileLabel?: string; // Optional different label for mobile
  hideOnMobile?: boolean; // Hide this column on mobile
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  getRowKey: (item: T) => string;
  emptyMessage?: string;
  className?: string;
}

export function ResponsiveTable<T>({
  data,
  columns,
  onRowClick,
  getRowKey,
  emptyMessage = 'No data available',
  className,
}: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile();

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  // Mobile: Card Layout
  if (isMobile) {
    return (
      <div className={cn('space-y-3', className)}>
        {data.map((item) => {
          const visibleColumns = columns.filter((col) => !col.hideOnMobile);
          
          return (
            <Card
              key={getRowKey(item)}
              className={cn(
                'transition-colors',
                onRowClick && 'cursor-pointer hover:bg-accent'
              )}
              onClick={() => onRowClick?.(item)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  {visibleColumns.map((column) => (
                    <div key={column.key} className="flex justify-between items-start gap-4">
                      <span className="text-sm font-medium text-muted-foreground min-w-[100px]">
                        {column.mobileLabel || column.label}
                      </span>
                      <div className="text-sm text-right flex-1">
                        {column.render(item)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Desktop: Table Layout
  return (
    <div className={cn('rounded-md border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={getRowKey(item)}
              className={cn(onRowClick && 'cursor-pointer')}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <TableCell key={column.key}>{column.render(item)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

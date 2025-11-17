'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export interface UseTableKeyboardNavOptions {
  rowCount: number;
  columnCount?: number;
  onRowSelect?: (rowIndex: number) => void;
  onRowToggle?: (rowIndex: number) => void;
  enableColumnNav?: boolean;
  initialFocusedRow?: number;
}

export function useTableKeyboardNav({
  rowCount,
  columnCount = 1,
  onRowSelect,
  onRowToggle,
  enableColumnNav = false,
  initialFocusedRow = -1,
}: UseTableKeyboardNavOptions) {
  const [focusedRow, setFocusedRow] = useState(initialFocusedRow);
  const [focusedColumn, setFocusedColumn] = useState(0);
  const tableRef = useRef<HTMLTableElement>(null);

  // Move focus to a specific row
  const focusRow = useCallback((rowIndex: number) => {
    if (rowIndex < 0 || rowIndex >= rowCount) return;
    
    setFocusedRow(rowIndex);
    
    // Find and focus the row element
    if (tableRef.current) {
      const rows = tableRef.current.querySelectorAll('tbody tr');
      const row = rows[rowIndex] as HTMLElement;
      if (row) {
        row.focus();
        row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [rowCount]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if focus is within the table
      const target = e.target as HTMLElement;
      if (!tableRef.current?.contains(target)) return;

      // Don't handle if typing in an input
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (focusedRow < rowCount - 1) {
            focusRow(focusedRow + 1);
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (focusedRow > 0) {
            focusRow(focusedRow - 1);
          } else if (focusedRow === -1 && rowCount > 0) {
            focusRow(0);
          }
          break;

        case 'ArrowRight':
          if (enableColumnNav) {
            e.preventDefault();
            if (focusedColumn < columnCount - 1) {
              setFocusedColumn(focusedColumn + 1);
            }
          }
          break;

        case 'ArrowLeft':
          if (enableColumnNav) {
            e.preventDefault();
            if (focusedColumn > 0) {
              setFocusedColumn(focusedColumn - 1);
            }
          }
          break;

        case 'Enter':
          e.preventDefault();
          if (focusedRow >= 0 && onRowSelect) {
            onRowSelect(focusedRow);
          }
          break;

        case ' ':
          e.preventDefault();
          if (focusedRow >= 0 && onRowToggle) {
            onRowToggle(focusedRow);
          }
          break;

        case 'Home':
          e.preventDefault();
          if (e.ctrlKey || e.metaKey) {
            // Ctrl+Home: Go to first row
            focusRow(0);
          } else if (enableColumnNav) {
            // Home: Go to first column
            setFocusedColumn(0);
          }
          break;

        case 'End':
          e.preventDefault();
          if (e.ctrlKey || e.metaKey) {
            // Ctrl+End: Go to last row
            focusRow(rowCount - 1);
          } else if (enableColumnNav) {
            // End: Go to last column
            setFocusedColumn(columnCount - 1);
          }
          break;

        case 'PageDown':
          e.preventDefault();
          // Jump 10 rows down
          focusRow(Math.min(focusedRow + 10, rowCount - 1));
          break;

        case 'PageUp':
          e.preventDefault();
          // Jump 10 rows up
          focusRow(Math.max(focusedRow - 10, 0));
          break;

        case 'Escape':
          e.preventDefault();
          // Clear focus
          setFocusedRow(-1);
          setFocusedColumn(0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    focusedRow,
    focusedColumn,
    rowCount,
    columnCount,
    enableColumnNav,
    onRowSelect,
    onRowToggle,
    focusRow,
  ]);

  // Handle click to focus
  useEffect(() => {
    if (!tableRef.current) return;

    const handleRowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const row = target.closest('tbody tr');
      if (!row) return;

      const rows = Array.from(tableRef.current!.querySelectorAll('tbody tr'));
      const rowIndex = rows.indexOf(row as HTMLTableRowElement);
      if (rowIndex >= 0) {
        setFocusedRow(rowIndex);
      }
    };

    tableRef.current.addEventListener('click', handleRowClick);
    const currentRef = tableRef.current;
    
    return () => {
      currentRef?.removeEventListener('click', handleRowClick);
    };
  }, []);

  // Get props for table element
  const getTableProps = () => ({
    ref: tableRef,
    role: 'grid',
    'aria-rowcount': rowCount,
    'aria-colcount': columnCount,
  });

  // Get props for row element
  const getRowProps = (rowIndex: number) => ({
    tabIndex: focusedRow === rowIndex ? 0 : -1,
    'aria-rowindex': rowIndex + 1,
    'data-focused': focusedRow === rowIndex,
    className: focusedRow === rowIndex ? 'ring-2 ring-ring ring-offset-2' : '',
    role: 'row',
  });

  // Get props for cell element
  const getCellProps = (rowIndex: number, columnIndex: number) => ({
    'aria-colindex': columnIndex + 1,
    'data-focused': focusedRow === rowIndex && focusedColumn === columnIndex,
    role: 'gridcell',
  });

  return {
    focusedRow,
    focusedColumn,
    setFocusedRow,
    setFocusedColumn,
    focusRow,
    getTableProps,
    getRowProps,
    getCellProps,
    tableRef,
  };
}

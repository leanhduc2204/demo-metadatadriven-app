/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ColumnDef,
  getCoreRowModel,
  RowSelectionState,
  useReactTable,
  ColumnPinningState,
} from "@tanstack/react-table";

import { useVirtualizer } from "@tanstack/react-virtual";

import { TableBody, TableHeader, TableRow } from "@/components/ui/table";

import { useMemo, useRef, useState, useEffect } from "react";

import { DefaultCell } from "./default-cell";
import { DefaultHeader } from "./default-header";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  hideHeader?: boolean;
  height?: string | number;
  children?: React.ReactNode;
  overflow?: string;
  pinnedColumns?: string[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  hideHeader = false,
  height = "85vh",
  children,
  overflow,
  pinnedColumns = ["select", "fullName"],
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: pinnedColumns,
    right: [],
  });
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setColumnPinning({
      left: pinnedColumns,
      right: [],
    });
  }, [pinnedColumns]);

  const table = useReactTable({
    data: data,
    columns,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    enableColumnResizing: true,
    enableColumnPinning: true,
    onRowSelectionChange: setRowSelection,
    onColumnPinningChange: setColumnPinning,
    state: {
      rowSelection,
      columnPinning,
    },
  });

  const columnSizing = table.getState().columnSizing;
  const totalTableWidth = useMemo(() => {
    return table.getTotalSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnSizing]);

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 35, // estimate row height
    overscan: 10,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();

  return (
    <div
      style={{
        height: height,
        width: "100%",
        overflow: overflow || "auto",
        position: "relative",
      }}
      ref={tableContainerRef}
    >
      <table
        style={{
          width: `${totalTableWidth}px`,
          tableLayout: "fixed",
        }}
        className="w-full caption-bottom text-sm text-left border-b"
      >
        {!hideHeader && (
          <TableHeader className="sticky top-0 z-20 bg-background shadow-xs">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => (
                  <DefaultHeader key={header.column.id} header={header} />
                ))}
              </TableRow>
            ))}
          </TableHeader>
        )}
        <TableBody
          style={{
            width: "100%",
            position: "relative",
          }}
        >
          {virtualRows.map((virtualItem) => {
            const row = rows[virtualItem.index];
            return (
              <TableRow
                key={virtualItem.key}
                className="absolute top-0 left-0 flex w-full group"
                style={{
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <DefaultCell key={cell.id} cell={cell} />
                ))}
              </TableRow>
            );
          })}
          {/* Render children (like Load More button) as the last row */}
          {children && (
            <tr
              style={{
                transform: `translateY(${rowVirtualizer.getTotalSize()}px)`,
                position: "absolute",
                width: "100%",
              }}
            >
              <td colSpan={columns.length} className="p-0">
                {children}
              </td>
            </tr>
          )}
        </TableBody>
      </table>
    </div>
  );
}

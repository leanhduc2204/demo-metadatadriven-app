/* eslint-disable react-hooks/exhaustive-deps */
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

import { useMemo, useRef, useState } from "react";

import { DefaultCell } from "./default-cell";
import { DefaultHeader } from "./default-header";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ["select", "fullName"],
    right: [],
  });
  const tableContainerRef = useRef<HTMLDivElement>(null);

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

  const totalTableWidth = useMemo(() => {
    return table.getTotalSize();
  }, [table.getState().columnSizing]);

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
      className="border-t border-b"
      style={{
        height: "800px", // Set a fixed height for the container to enable virtual scrolling
        width: "100%",
        overflow: "auto", // Enable both X and Y scrolling
        position: "relative",
      }}
      ref={tableContainerRef}
    >
      <table
        style={{
          width: `${totalTableWidth}px`,
          tableLayout: "fixed",
        }}
        className="w-full caption-bottom text-sm text-left"
      >
        <TableHeader className="sticky top-0 z-20 bg-background shadow-sm">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="flex w-full">
              {headerGroup.headers.map((header) => (
                <DefaultHeader key={header.column.id} header={header} />
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualRows.map((virtualItem) => {
            const row = rows[virtualItem.index];
            return (
              <TableRow
                key={virtualItem.key}
                className="absolute top-0 left-0 flex w-full items-center group"
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
        </TableBody>
      </table>
    </div>
  );
}

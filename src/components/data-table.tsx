/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  ColumnDef,
  getCoreRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";

import { useVirtualizer } from "@tanstack/react-virtual";

import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";

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
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data: data,
    columns,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    enableColumnResizing: true,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
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

  const tableProps = {
    style: {
      width: `${totalTableWidth}px`,
      tableLayout: "fixed" as const,
    },
  };

  return (
    <div
      className="flex flex-col border rounded-sm"
      style={{
        maxWidth: "100%",
        overflow: "auto",
        overflowY: "hidden",
      }}
      ref={outerContainerRef}
    >
      <div style={{ width: Math.max(totalTableWidth + 10, 100) + "px" }}>
        <div className="overflow-hidden">
          <Table {...tableProps}>
            <TableHeader className="sticky top-0 z-10 bg-background shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="flex w-full">
                  {headerGroup.headers.map((header) => {
                    return (
                      <DefaultHeader key={header.column.id} header={header} />
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
          </Table>
        </div>
        <div
          ref={tableContainerRef}
          style={{
            width: Math.max(totalTableWidth + 10, 100) + "px",
            height: `1000px`,
            overflowY: "auto",
            overflowX: "hidden", // Prevent horizontal scrolling in the body
          }}
          onWheel={(e) => {
            // If this is a horizontal scroll attempt, let the parent handle it
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
              e.stopPropagation();
              if (outerContainerRef.current) {
                outerContainerRef.current.scrollLeft += e.deltaX;
              }
            }
          }}
        >
          <Table {...tableProps}>
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
                    className="absolute top-0 left-0 flex w-full items-center"
                    style={{
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return <DefaultCell key={cell.id} cell={cell} />;
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

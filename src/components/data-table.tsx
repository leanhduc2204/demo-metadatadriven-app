/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ColumnDef,
  getCoreRowModel,
  RowSelectionState,
  useReactTable,
  ColumnPinningState,
  OnChangeFn,
  Row,
} from "@tanstack/react-table";

import { useVirtualizer } from "@tanstack/react-virtual";

import { TableBody, TableHeader, TableRow } from "@/components/ui/table";

import { useMemo, useRef, useState, useEffect } from "react";

import { DefaultCell } from "./default-cell";
import { DefaultHeader } from "./default-header";
import { Skeleton } from "./ui/skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  hideHeader?: boolean;
  hideBody?: boolean;
  height?: string | number;
  children?: React.ReactNode;
  overflow?: string;
  pinnedColumns?: string[];
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  isLoading?: boolean;
  skeletonRowCount?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  hideHeader = false,
  hideBody = false,
  height = "82vh",
  children,
  overflow,
  pinnedColumns = ["select", "fullName"],
  rowSelection: controlledRowSelection,
  onRowSelectionChange: setControlledRowSelection,
  getRowId,
  isLoading = false,
  skeletonRowCount = 10,
}: DataTableProps<TData, TValue>) {
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: pinnedColumns,
    right: [],
  });
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const rowSelection = controlledRowSelection ?? internalRowSelection;
  const setRowSelection = setControlledRowSelection ?? setInternalRowSelection;

  useEffect(() => {
    setColumnPinning({
      left: pinnedColumns,
      right: [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(pinnedColumns)]);

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
    getRowId,
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
  const rowCount = isLoading ? skeletonRowCount : rows.length;
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
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
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {!hideBody &&
            virtualRows.map((virtualItem) => {
              if (isLoading) {
                const headerGroup = table.getHeaderGroups()[0];
                return (
                  <TableRow
                    key={virtualItem.key}
                    className="absolute top-0 left-0 flex w-full"
                    style={{
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                  >
                    {headerGroup.headers.map((header) => {
                      const isPinned = header.column.getIsPinned();
                      return (
                        <td
                          key={header.id}
                          className={`p-1 px-2 ${
                            header.id !== "select" && header.id !== "add-column"
                              ? "border-r"
                              : ""
                          } ${
                            isPinned
                              ? "flex items-center sticky z-10 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r-2 border-r-border border-b border-border"
                              : ""
                          } ${header.id === "select" ? "border-r-0" : ""}`}
                          style={{
                            width: header.column.getSize(),
                            flex: `0 0 ${header.column.getSize()}px`,
                            left:
                              isPinned === "left"
                                ? `${header.column.getStart("left")}px`
                                : undefined,
                          }}
                        >
                          <Skeleton className="h-4 w-full" />
                        </td>
                      );
                    })}
                  </TableRow>
                );
              }

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

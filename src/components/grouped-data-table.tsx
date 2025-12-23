"use client";

import {
  ColumnDef,
  ColumnPinningState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  OnChangeFn,
  Row,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ChevronDown, ChevronRight } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import { DefaultCell } from "./default-cell";
import { DefaultHeader } from "./default-header";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { TableBody, TableHeader, TableRow } from "./ui/table";
import { Skeleton } from "./ui/skeleton";

interface GroupedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  groupBy: string;
  pinnedColumns?: string[];
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  groups?: string[];
  groupColorMap?: Record<string, string>;
  isLoading?: boolean;
  skeletonRowCount?: number;
}

export function GroupedDataTable<TData, TValue>({
  columns,
  data,
  groupBy,
  pinnedColumns = [],
  getRowId,
  rowSelection: controlledRowSelection,
  onRowSelectionChange: setControlledRowSelection,
  groups,
  groupColorMap,
  isLoading = false,
  skeletonRowCount = 8,
}: GroupedDataTableProps<TData, TValue>) {
  // --- State Management ---
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: pinnedColumns,
    right: [],
  });

  // Load more & Expanded state per group
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const [visibleRows, setVisibleRows] = useState<Record<string, number>>({});

  const rowSelection = controlledRowSelection ?? internalRowSelection;
  const setRowSelection = setControlledRowSelection ?? setInternalRowSelection;

  // Update pinning when props change
  useEffect(() => {
    setColumnPinning({
      left: pinnedColumns,
      right: [],
    });
  }, [pinnedColumns]);

  // --- Table Setup ---
  const table = useReactTable({
    data,
    columns,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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

  // --- Data Processing for Grouping ---
  // We process rows AFTER sorting/filtering from the table instance
  const tableRows = table.getRowModel().rows;

  const groupedData = useMemo(() => {
    const groupsMap: Record<string, Row<TData>[]> = {};

    tableRows.forEach((row) => {
      const groupVal = String(row.getValue(groupBy));
      if (!groupsMap[groupVal]) {
        groupsMap[groupVal] = [];
      }
      groupsMap[groupVal].push(row);
    });
    return groupsMap;
  }, [tableRows, groupBy]);

  // Initialize expanded/visible state for new groups
  useEffect(() => {
    const newGroups = Object.keys(groupedData);
    setExpandedGroups((prev) => {
      const next = { ...prev };
      newGroups.forEach((g) => {
        if (next[g] === undefined) next[g] = true; // Default expanded
      });
      return next;
    });
    setVisibleRows((prev) => {
      const next = { ...prev };
      newGroups.forEach((g) => {
        if (next[g] === undefined) next[g] = 8; // Default limit 8
      });
      return next;
    });
  }, [groupedData]);

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const loadMore = (group: string) => {
    setVisibleRows((prev) => ({
      ...prev,
      [group]: (prev[group] || 8) + 8,
    }));
  };

  const totalTableWidth = table.getTotalSize();

  // Order groups based on props OR default logic
  const orderedGroups = useMemo(() => {
    if (groups) {
      return groups;
    }

    const groupKeys = Object.keys(groupedData);
    return groupKeys.sort((a, b) => a.localeCompare(b));
  }, [groupedData, groups]);

  return (
    <div
      className="flex flex-col w-full overflow-auto border bg-white relative"
      style={{ height: "85vh" }}
    >
      <table
        style={{
          width: `${totalTableWidth}px`,
          tableLayout: "fixed",
        }}
        className="w-full caption-bottom text-sm text-left border-b"
      >
        {/* Sticky Header */}
        <TableHeader className="sticky top-0 z-40 bg-background shadow-xs">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="flex w-full border-b-0">
              {headerGroup.headers.map((header) => (
                <DefaultHeader key={header.id} header={header} />
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className="relative w-full">
          {isLoading ? (
            // Skeleton loading state
            <>
              {Array.from({ length: 3 }).map((_, groupIndex) => (
                <React.Fragment key={`skeleton-group-${groupIndex}`}>
                  {/* Skeleton Group Header */}
                  <TableRow className="sticky left-0 z-20 flex items-center w-full bg-white backdrop-blur-sm border-y px-2 py-2">
                    <td
                      className="w-full border-none p-0"
                      colSpan={columns.length}
                    >
                      <div className="sticky left-0 pl-2 flex items-center w-fit">
                        <Skeleton className="h-6 w-6 mr-2" />
                        <Skeleton className="h-5 w-24 mr-2" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                    </td>
                  </TableRow>

                  {/* Skeleton Rows */}
                  {Array.from({ length: skeletonRowCount }).map(
                    (_, rowIndex) => {
                      const headerGroup = table.getHeaderGroups()[0];
                      return (
                        <TableRow
                          key={`skeleton-row-${groupIndex}-${rowIndex}`}
                          className="flex w-full border-b last:border-b-0"
                        >
                          {headerGroup.headers.map((header) => {
                            const isPinned = header.column.getIsPinned();
                            return (
                              <td
                                key={header.id}
                                className={`p-1 px-2 ${
                                  header.id !== "select" &&
                                  header.id !== "add-column"
                                    ? "border-r"
                                    : ""
                                } ${
                                  isPinned
                                    ? "flex items-center sticky z-10 bg-background shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r-2 border-r-border border-b border-border"
                                    : ""
                                } ${
                                  header.id === "select" ? "border-r-0" : ""
                                }`}
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
                  )}
                </React.Fragment>
              ))}
            </>
          ) : (
            orderedGroups.map((groupName) => {
              const rowsInGroup = groupedData[groupName] || [];

              // If rowsInGroup is empty (e.g. hidden by filter but group is visible), we might want to show empty group or skip.
              // Currently we render it.

              const isExpanded = expandedGroups[groupName];
              const limit = visibleRows[groupName] || 8;
              const visibleGroupRows = rowsInGroup.slice(0, limit);
              const hasMore = rowsInGroup.length > limit;

              return (
                <React.Fragment key={groupName}>
                  {/* Group Header */}
                  <TableRow className="sticky left-0 z-20 flex items-center w-full bg-white backdrop-blur-sm border-y px-2 py-2">
                    <td
                      className="w-full border-none p-0"
                      colSpan={columns.length}
                    >
                      <div className="sticky left-0 pl-2 flex items-center w-fit">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-6 w-6 mr-2 hover:bg-transparent"
                          onClick={() => toggleGroup(groupName)}
                        >
                          {isExpanded ? (
                            <ChevronDown
                              size={16}
                              className="text-neutral-500"
                            />
                          ) : (
                            <ChevronRight
                              size={16}
                              className="text-neutral-500"
                            />
                          )}
                        </Button>
                        <Badge
                          variant={"secondary"}
                          className={`${
                            (groupColorMap && groupColorMap[groupName]) ||
                            "bg-neutral-100 text-neutral-700"
                          } rounded-sm px-1.5 py-0.5 mr-2`}
                        >
                          <span className="font-medium text-[13px] text-nowrap">
                            {groupName}
                          </span>
                        </Badge>
                        <span className="text-xs text-neutral-400">
                          {rowsInGroup.length}
                        </span>
                      </div>
                    </td>
                  </TableRow>

                  {/* Group Rows */}
                  {isExpanded && (
                    <>
                      {visibleGroupRows.map((row) => (
                        <TableRow
                          key={row.id}
                          className="flex w-full border-b last:border-b-0 hover:bg-muted/50 data-[state=selected]:bg-muted"
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <DefaultCell key={cell.id} cell={cell} />
                          ))}
                        </TableRow>
                      ))}

                      {/* Load More Row */}
                      {hasMore && (
                        <TableRow className="flex w-full border-t bg-white">
                          <td
                            className="w-full border-none p-0"
                            colSpan={columns.length}
                          >
                            <div className="sticky left-0 p-2 z-10 w-fit">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => loadMore(groupName)}
                                className="h-8 text-neutral-500 hover:text-neutral-900 font-normal text-[13px]"
                              >
                                <ArrowDown size={14} className="mr-2" />
                                Load more
                              </Button>
                            </div>
                          </td>
                        </TableRow>
                      )}
                    </>
                  )}
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </table>
    </div>
  );
}

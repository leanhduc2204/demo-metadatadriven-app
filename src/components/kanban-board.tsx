/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FieldConfigItem } from "@/lib/field-config";
import { cn } from "@/lib/utils";
import { ReactNode, useMemo, useState } from "react";
import { EventCard } from "./event-card";

interface KanbanBoardProps<T> {
  data: T[];
  groupBy: string;
  groups: string[];
  primaryField: keyof T;
  visibleFields: string[];
  fieldConfig: Record<string, FieldConfigItem>;
  formatters?: Partial<Record<keyof T, (value: any) => ReactNode>>;
  compactView?: boolean;
}

export function KanbanBoard<T extends { id: number }>({
  data,
  groupBy,
  groups,
  primaryField,
  visibleFields,
  fieldConfig,
  formatters,
  compactView = false,
}: KanbanBoardProps<T>) {
  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Toggle selection for an item
  const toggleSelection = (id: number, selected: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  // Group data by the groupBy field
  const groupedData = useMemo(() => {
    const grouped: Record<string, T[]> = {};

    // Initialize all groups with empty arrays
    groups.forEach((group) => {
      grouped[group] = [];
    });

    // Populate groups with data
    data.forEach((item) => {
      const groupValue = String(item[groupBy as keyof T] || "");
      if (grouped[groupValue]) {
        grouped[groupValue].push(item);
      }
    });

    return grouped;
  }, [data, groupBy, groups]);

  // Get max items count for grid layout
  const maxItems = useMemo(() => {
    return Math.max(
      ...Object.values(groupedData).map((items) => items.length),
      1
    );
  }, [groupedData]);

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
      {/* Single scroll container for both header and body */}
      <div className="flex-1 overflow-auto">
        <div className="inline-flex flex-col min-w-full">
          {/* Sticky Header Row - scrolls horizontally with body */}
          <div className="flex border-b bg-white sticky top-0 z-10">
            {groups.map((group) => {
              const items = groupedData[group] || [];
              // Count selected items in this group
              const selectedCount = items.filter((item) =>
                selectedIds.has(item.id)
              ).length;

              return (
                <div
                  key={group}
                  className="w-[280px] min-w-[280px] max-w-[350px] flex-shrink-0 px-3 py-3 border-r last:border-r-0"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-neutral-700">
                      {group}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      {selectedCount > 0 && (
                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {selectedCount} selected
                        </span>
                      )}
                      <span className="text-xs text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded-full">
                        {items.length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Body - columns */}
          <div className="flex min-h-full">
            {groups.map((group) => {
              const items = groupedData[group] || [];

              return (
                <div
                  key={group}
                  className={cn(
                    "w-[280px] min-w-[280px] max-w-[350px] flex-shrink-0 border-r last:border-r-0 bg-neutral-50/50",
                    "flex flex-col"
                  )}
                >
                  {/* Cards Container */}
                  <div className="p-2 space-y-2 flex-1">
                    {items.length === 0 ? (
                      <div className="text-center text-neutral-400 text-sm py-8">
                        No items
                      </div>
                    ) : (
                      items.map((item) => (
                        <EventCard
                          key={item.id}
                          item={item}
                          primaryField={primaryField}
                          visibleFields={visibleFields}
                          fieldConfig={fieldConfig}
                          formatters={formatters}
                          compact={compactView}
                          selected={selectedIds.has(item.id)}
                          onSelectChange={(selected) =>
                            toggleSelection(item.id, selected)
                          }
                        />
                      ))
                    )}

                    {/* Spacer to ensure all columns have same min height */}
                    {items.length < maxItems && (
                      <div
                        style={{
                          minHeight: `${(maxItems - items.length) * 60}px`,
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selection Summary Bar */}
      {selectedIds.size > 0 && (
        <div className="border-t bg-primary/5 px-4 py-2 flex items-center justify-between">
          <span className="text-sm text-neutral-600">
            {selectedIds.size} item{selectedIds.size > 1 ? "s" : ""} selected
          </span>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-sm text-primary hover:underline"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}

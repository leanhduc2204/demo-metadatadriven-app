import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DataTable } from "@/components/data-table";

interface GroupedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  groupBy: keyof TData;
  pinnedColumns?: string[];
}

export function GroupedDataTable<TData, TValue>({
  columns,
  data,
  groupBy,
  pinnedColumns,
}: GroupedDataTableProps<TData, TValue>) {
  // Get unique group values
  const groups = Array.from(new Set(data.map((item) => item[groupBy])));
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    groups.reduce((acc, group) => ({ ...acc, [String(group)]: true }), {})
  );
  const [visibleRows, setVisibleRows] = useState<Record<string, number>>(
    groups.reduce((acc, group) => ({ ...acc, [String(group)]: 10 }), {})
  );

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const loadMore = (group: string) => {
    setVisibleRows((prev) => ({
      ...prev,
      [group]: (prev[group] || 10) + 10,
    }));
  };

  const rowHeight = 35;

  return (
    <div className="flex flex-col w-full overflow-x-auto border rounded-md bg-white">
      <div className="min-w-full w-max">
        <DataTable
          columns={columns}
          data={[]}
          hideHeader={false}
          height="auto"
          overflow="visible"
          pinnedColumns={pinnedColumns}
        />
        {groups.map((group) => {
          const groupData = data.filter((item) => item[groupBy] === group);
          const isExpanded = expandedGroups[String(group)];
          const currentVisibleRows = visibleRows[String(group)] || 10;
          const displayData = groupData.slice(0, currentVisibleRows);
          const hasMore = groupData.length > currentVisibleRows;

          // Calculate height including the Load More button row if it exists
          const contentHeight = displayData.length * rowHeight;
          const loadMoreHeight = hasMore ? 36 : 0; // Height of the load more button row
          const totalHeight = contentHeight + loadMoreHeight;

          return (
            <div key={String(group)} className="flex flex-col">
              <div className="flex items-center px-4 py-2 bg-neutral-50 border-y sticky left-0 z-10 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-6 w-6 mr-2 hover:bg-transparent"
                  onClick={() => toggleGroup(String(group))}
                >
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-neutral-500" />
                  ) : (
                    <ChevronRight size={16} className="text-neutral-500" />
                  )}
                </Button>
                <span className="font-medium text-sm text-neutral-700">
                  {String(group)}
                </span>
                <span className="ml-2 text-xs text-neutral-400">
                  {groupData.length}
                </span>
              </div>

              {isExpanded && (
                <div className="flex flex-col">
                  <DataTable
                    columns={columns}
                    data={displayData}
                    hideHeader={true}
                    height={totalHeight}
                    overflow="visible"
                    pinnedColumns={pinnedColumns}
                  >
                    {hasMore && (
                      <div className="w-full bg-white sticky left-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => loadMore(String(group))}
                          className="w-full h-9 justify-start pl-9 font-normal text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-none"
                        >
                          <ChevronDown size={16} className="mr-4" />
                          Load more
                        </Button>
                      </div>
                    )}
                  </DataTable>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

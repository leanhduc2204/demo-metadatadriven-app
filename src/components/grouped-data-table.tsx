import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, ChevronDown, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { Badge } from "./ui/badge";
import { Stage } from "@/lib/data";

interface GroupedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  groupBy: keyof TData;
  pinnedColumns?: string[];
}

const stageColorMap: Record<string, string> = {
  [Stage.NEW]: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  [Stage.SCREENING]: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  [Stage.MEETING]: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  [Stage.PROPOSAL]: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  [Stage.CUSTOMER]: "bg-green-100 text-green-700 hover:bg-green-100",
};

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
    <div className="flex flex-col w-full overflow-x-auto border bg-white">
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

          // Calculate height of content only
          const contentHeight = displayData.length * rowHeight;

          return (
            <div key={String(group)} className="flex flex-col">
              <div className="flex w-full bg-white border-y">
                <div className="sticky left-0 z-20 flex items-center px-4 py-2 bg-white w-fit">
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
                  <Badge
                    variant={"secondary"}
                    className={`${
                      stageColorMap[String(group)] ||
                      "bg-neutral-100 text-neutral-700"
                    } rounded-md px-2 py-0.5`}
                  >
                    <span className="font-medium text-sm text-nowrap">
                      {String(group)}
                    </span>
                  </Badge>
                  <span className="ml-2 text-xs text-neutral-400">
                    {groupData.length}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="flex flex-col">
                  <DataTable
                    columns={columns}
                    data={displayData}
                    hideHeader={true}
                    height={contentHeight}
                    overflow="visible"
                    pinnedColumns={pinnedColumns}
                  />
                  {hasMore && (
                    <div className="w-full bg-white border-t">
                      <div className="sticky left-0 z-10 w-fit bg-white">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => loadMore(String(group))}
                          className="w-max h-9 justify-start pl-9 font-normal text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-none"
                        >
                          <ArrowDown size={16} className="mr-4" />
                          Load more
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { fieldConfig } from "@/lib/field-config";
import { AddColumnHeader } from "@/components/add-column-header";
import { useMemo } from "react";
import { User as UserIcon } from "lucide-react";
import { EntityConfig } from "@/lib/entity-config";
import { Badge } from "@/components/ui/badge";

interface UseEntityColumnsProps<T> {
  config: EntityConfig<T>;
  visibleFields: string[];
  setVisibleFields: (fields: string[]) => void;
}

export function useEntityColumns<T extends { id: number }>({
  config,
  visibleFields,
  setVisibleFields,
}: UseEntityColumnsProps<T>) {
  const columns = useMemo<ColumnDef<T>[]>(() => {
    // Select column
    const selectColumn: ColumnDef<T> = {
      id: "select",
      size: 48,
      header: ({ table }) => (
        <div className="h-full flex items-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="h-full flex items-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={`Select row ${row.original.id}`}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    };

    // Data columns based on visible fields
    const dataColumns: ColumnDef<T>[] = visibleFields.map((field) => {
      const fieldCfg = fieldConfig[field];
      const Icon = fieldCfg?.icon || UserIcon;
      const customCellRenderer = config.customCellRenderers?.[field as keyof T];
      const formatter = config.formatters?.[field as keyof T];

      return {
        id: field,
        minSize: 200,
        accessorKey: field,
        header: () => (
          <div className="flex items-center gap-2">
            <Icon size={16} />
            <span>{fieldCfg?.label || field}</span>
          </div>
        ),
        cell: ({ row }) => {
          const value = row.original[field as keyof T];

          // Priority 1: Use custom cell renderer if available (full control)
          if (customCellRenderer) {
            return customCellRenderer(row.original, field as keyof T);
          }

          // Priority 2: Check if this is a group column with color map
          const isGroupColumn = field === config.grouping?.defaultGroupBy;
          const groupColorClass =
            isGroupColumn && config.groupColorMap
              ? config.groupColorMap[String(value)]
              : undefined;

          if (groupColorClass) {
            return (
              <Badge
                variant={"secondary"}
                className={`${groupColorClass} rounded-md px-2 py-0.5`}
              >
                <span className="font-medium text-xs whitespace-nowrap">
                  {String(value || "")}
                </span>
              </Badge>
            );
          }

          // Priority 3: Use formatter if available
          if (formatter) {
            // Call formatter with both value and row
            // If formatter only accepts value (backward compatible), it will ignore the second parameter
            const formatterFn = formatter as any;
            return formatterFn(value, row.original);
          }

          // Default: convert to string
          return String(value ?? "");
        },
      };
    });

    // Add column header
    const addColumnColumn: ColumnDef<T> = {
      id: "add-column",
      size: 1000,
      header: () => (
        <AddColumnHeader
          visibleFields={visibleFields}
          setVisibleFields={setVisibleFields}
          allowedFields={config.fields}
        />
      ),
      cell: () => null,
      enableSorting: false,
      enableHiding: false,
    };

    return [selectColumn, ...dataColumns, addColumnColumn];
  }, [visibleFields, setVisibleFields, config]);

  return columns;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { fieldConfig } from "@/lib/field-config";
import { AddColumnHeader } from "@/components/add-column-header";
import { useMemo } from "react";
import { User as UserIcon } from "lucide-react";
import { EntityConfig } from "@/lib/entity-config";

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

          // Use custom formatter if available
          if (formatter) {
            return formatter(value);
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

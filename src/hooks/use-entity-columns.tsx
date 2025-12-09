import { AddColumnHeader } from "@/components/add-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { COLUMN_IDS, DEFAULTS } from "@/lib/constants";
import { EntityConfig } from "@/lib/entity-config";
import { fieldConfig } from "@/lib/field-config";
import { formatFieldValue } from "@/lib/field-formatter";
import { ColumnDef } from "@tanstack/react-table";
import { User as UserIcon } from "lucide-react";
import { useMemo } from "react";

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
      id: COLUMN_IDS.SELECT,
      size: DEFAULTS.SELECT_COLUMN_SIZE,
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

      return {
        id: field,
        minSize: DEFAULTS.COLUMN_MIN_SIZE,
        accessorKey: field,
        header: () => (
          <div className="flex items-center gap-2">
            <Icon size={16} />
            <span>{fieldCfg?.label || field}</span>
          </div>
        ),
        cell: ({ row }) => {
          const value = row.original[field as keyof T];
          return formatFieldValue({
            config,
            field,
            value,
            row: row.original,
            isPrimaryField: false,
          });
        },
      };
    });

    // Add column header
    const addColumnColumn: ColumnDef<T> = {
      id: COLUMN_IDS.ADD_COLUMN,
      size: DEFAULTS.ADD_COLUMN_SIZE,
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

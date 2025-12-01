import { ColumnDef } from "@tanstack/react-table";
import { Opportunity } from "@/lib/data";
import { Checkbox } from "@/components/ui/checkbox";
import { fieldConfig } from "@/lib/field-config";
import { AddColumnHeader } from "@/components/add-column-header";
import { useMemo } from "react";
import { User as UserIcon } from "lucide-react";

interface UseOpportunityColumnsProps {
  visibleFields: string[];
  setVisibleFields: (fields: string[]) => void;
}

export function useOpportunityColumns({
  visibleFields,
  setVisibleFields,
}: UseOpportunityColumnsProps) {
  const columns = useMemo<ColumnDef<Opportunity>[]>(() => {
    const selectColumn: ColumnDef<Opportunity> = {
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

    const dataColumns: ColumnDef<Opportunity>[] = visibleFields.map((field) => {
      const config = fieldConfig[field];
      const Icon = config?.icon || UserIcon;

      return {
        id: field,
        minSize: 200,
        accessorKey: field,
        header: () => (
          <div className="flex items-center gap-2">
            <Icon size={16} />
            <span>{config?.label || field}</span>
          </div>
        ),
        cell: ({ row }) => {
          const value = row.original[field as keyof Opportunity];

          if (field === "amount") {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(Number(value));
          }

          if (
            (field === "closeDate" ||
              field === "creationDate" ||
              field === "lastUpdate") &&
            value
          ) {
            return new Date(String(value)).toLocaleDateString();
          }

          return String(value || "");
        },
      };
    });

    const addColumnColumn: ColumnDef<Opportunity> = {
      id: "add-column",
      size: 1000,
      header: () => (
        <AddColumnHeader
          visibleFields={visibleFields}
          setVisibleFields={setVisibleFields}
        />
      ),
      cell: () => null,
      enableSorting: false,
      enableHiding: false,
    };

    return [selectColumn, ...dataColumns, addColumnColumn];
  }, [visibleFields, setVisibleFields]);

  return columns;
}

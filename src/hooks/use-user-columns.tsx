import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/lib/data";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";
import { fieldConfig } from "@/lib/field-config";
import { AddColumnHeader } from "@/components/add-column-header";
import { useMemo } from "react";

interface UseUserColumnsProps {
  visibleFields: string[];
  setVisibleFields: (fields: string[]) => void;
}

export function useUserColumns({
  visibleFields,
  setVisibleFields,
}: UseUserColumnsProps) {
  const columns = useMemo<ColumnDef<User>[]>(() => {
    const selectColumn: ColumnDef<User> = {
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

    const dataColumns: ColumnDef<User>[] = visibleFields.map((field) => {
      const config = fieldConfig[field];
      const Icon = config?.icon || UserIcon;
      const isNameField = field === "fullName";

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
          const value = row.original[field as keyof User];
          if (Array.isArray(value)) {
            return value.join(", ");
          }

          if (isNameField) {
            const avatar = row.original.avatar;
            return (
              <div className="flex items-center gap-2">
                <Avatar className="size-4">
                  {avatar ? (
                    <AvatarImage src={avatar} alt={String(value || "")} />
                  ) : null}
                  <AvatarFallback className="bg-gray-200">
                    <UserIcon className="text-neutral-500" />
                  </AvatarFallback>
                </Avatar>
                <span>{String(value || "")}</span>
              </div>
            );
          }

          return String(value || "");
        },
      };
    });

    const addColumnColumn: ColumnDef<User> = {
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

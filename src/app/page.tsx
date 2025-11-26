/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/data-table";
import { FilterPopover } from "@/components/filter-popover";
import { SortPopover } from "@/components/sort-popover";
import { ViewSwitcher } from "@/components/view-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { data, User } from "@/lib/data";

import { SortBy } from "@/types/common";

import { type ColumnDef } from "@tanstack/react-table";

import {
  ArrowDown01,
  BriefcaseBusiness,
  Building,
  Calendar1,
  History,
  Mail,
  Map,
  Phone,
  Plus,
  User as UserIcon,
} from "lucide-react";

import { useMemo, useState } from "react";
import { OptionsPopover } from "@/components/options-popover";

// Mapping các field với label và icon
type IconComponent = typeof UserIcon;
const fieldConfig: Record<string, { label: string; icon: IconComponent }> = {
  id: { label: "Id", icon: ArrowDown01 },
  fullName: { label: "Name", icon: UserIcon },
  emails: { label: "Emails", icon: Mail },
  company: { label: "Company", icon: Building },
  phones: { label: "Phones", icon: Phone },
  createdBy: { label: "Created by", icon: History },
  creationDate: { label: "Creation date", icon: Calendar1 },
  city: { label: "City", icon: Map },
  jobTitle: { label: "Job Title", icon: BriefcaseBusiness },
};

export default function Home() {
  const [visibleFields, setVisibleFields] = useState<string[]>([
    "fullName",
    "emails",
    "company",
    "phones",
    "city",
    "jobTitle",
  ]);
  const [searchFields, setSearchFields] = useState<string>("");
  const [sortFields, setSortFields] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.ASC);

  // Tạo columns dựa trên visibleFields
  const columns = useMemo<ColumnDef<User>[]>(() => {
    const selectColumn: ColumnDef<User> = {
      id: "select",
      size: 48, // Fixed width for checkbox column
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
                    <UserIcon size={16} className="text-gray-500" />
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
      minSize: 1000,
      header: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon-sm"}>
              <Plus size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              {Object.keys(fieldConfig)
                .filter(
                  (field) => !visibleFields.includes(field) && field !== "id"
                )
                .map((field) => {
                  const config = fieldConfig[field];
                  const Icon = config?.icon || UserIcon;
                  return (
                    <DropdownMenuItem
                      key={field}
                      onClick={() => {
                        setVisibleFields([...visibleFields, field]);
                      }}
                    >
                      <Icon size={16} />
                      <span>{config?.label || field}</span>
                    </DropdownMenuItem>
                  );
                })}
              {Object.keys(fieldConfig).filter(
                (field) => !visibleFields.includes(field) && field !== "id"
              ).length === 0 && (
                <DropdownMenuItem disabled>
                  <span className="text-gray-400">
                    No hidden fields available
                  </span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      cell: () => null,
      enableSorting: false,
      enableHiding: false,
    };

    return [selectColumn, ...dataColumns, addColumnColumn];
  }, [visibleFields]);

  return (
    <div className="w-full h-full bg-gray-100 p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <UserIcon size={16} className="text-neutral-900" />
        <p className="text-sm font-medium text-neutral-900">People</p>
      </div>

      <div className="bg-white w-full border rounded-md flex flex-col p-2 gap-2">
        <div className="flex items-center justify-between">
          <div>
            <ViewSwitcher itemCount={data.length} />
          </div>

          <div className="flex items-center">
            <div>
              <FilterPopover
                fieldConfig={fieldConfig}
                visibleFields={visibleFields}
                searchFields={searchFields}
                onSearchFieldsChange={setSearchFields}
              />
            </div>

            <div>
              <SortPopover
                fieldConfig={fieldConfig}
                visibleFields={visibleFields}
                sortFields={sortFields}
                onSortFieldsChange={setSortFields}
                sortBy={sortBy}
                onSortByChange={setSortBy}
              />
            </div>

            <div>
              <OptionsPopover
                fieldConfig={fieldConfig}
                visibleFields={visibleFields}
                onHideField={(field) => {
                  setVisibleFields(visibleFields.filter((f) => f !== field));
                }}
                onShowField={(field) => {
                  setVisibleFields([...visibleFields, field]);
                }}
                onReorderFields={(fields) => {
                  setVisibleFields(fields);
                }}
              />
            </div>
          </div>
        </div>

        <DataTable<User, any> columns={columns} data={data} />
      </div>
    </div>
  );
}

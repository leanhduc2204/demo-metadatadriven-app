/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/data-table";
import { FilterItemBadge } from "@/components/filter-item-badge";
import { FilterPopover } from "@/components/filter-popover";
import { OptionsPopover } from "@/components/options-popover";
import { SortItemBadge } from "@/components/sort-item-badge";
import { SortPopover } from "@/components/sort-popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ViewSwitcher } from "@/components/view-switcher";
import { useUserColumns } from "@/hooks/use-user-columns";
import { data, User } from "@/lib/data";
import { fieldConfig } from "@/lib/field-config";
import { useFilterStore } from "@/stores/use-filter-store";
import { useSortStore } from "@/stores/use-sort-store";
import { FilterOperator } from "@/types/common";
import { Plus, User as UserIcon } from "lucide-react";
import { useState } from "react";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { filters, clearFilters } = useFilterStore();
  const { sortConditions, clearSortConditions } = useSortStore();

  const columns = useUserColumns({ visibleFields, setVisibleFields });

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white w-full border rounded-md flex flex-col py-2">
        <div className="flex items-center justify-between px-2 mb-2">
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
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
              />
            </div>

            <div>
              <SortPopover
                fieldConfig={fieldConfig}
                visibleFields={visibleFields}
                sortFields={sortFields}
                onSortFieldsChange={setSortFields}
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

        {((filters.length > 0 &&
          (filters.some(
            (filter) =>
              filter.value !== "" &&
              filter.operator !== FilterOperator.IS_EMPTY &&
              filter.operator !== FilterOperator.IS_NOT_EMPTY
          ) ||
            filters.some(
              (filter) =>
                filter.operator === FilterOperator.IS_EMPTY ||
                filter.operator === FilterOperator.IS_NOT_EMPTY
            ))) ||
          sortConditions.length > 0) && (
          <>
            <Separator />
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {sortConditions.map((sortCondition) => {
                    return (
                      <SortItemBadge
                        key={sortCondition.id}
                        sortCondition={sortCondition}
                        label={
                          fieldConfig[sortCondition.field]?.label ||
                          sortCondition.field
                        }
                      />
                    );
                  })}
                </div>

                {sortConditions.length > 0 && filters.length > 0 && (
                  <div className="w-[1.5px] h-2 bg-neutral-200" />
                )}

                <div className="flex items-center gap-2">
                  {filters.map((filter) => {
                    const Icon = fieldConfig[filter.field]?.icon || UserIcon;
                    return (
                      <FilterItemBadge
                        key={filter.id}
                        filter={filter}
                        icon={<Icon />}
                        label={fieldConfig[filter.field]?.label || filter.field}
                      />
                    );
                  })}
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="text-neutral-500"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <Plus />
                    Add filter
                  </Button>
                </div>
              </div>

              <div>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="text-neutral-500"
                  onClick={() => {
                    clearFilters();
                    clearSortConditions();
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </>
        )}
        <Separator />
        <DataTable<User, any> columns={columns} data={data} />
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/data-table";
import { FilterPopover } from "@/components/filter-popover";
import { FilterSortBar } from "@/components/filter-sort-bar";
import { OptionsPopover } from "@/components/options-popover";
import { SortPopover } from "@/components/sort-popover";
import { Separator } from "@/components/ui/separator";
import { ViewSwitcher } from "@/components/view-switcher";
import { useUserColumns } from "@/hooks/use-user-columns";
import { data, User } from "@/lib/data";
import { getFieldConfig, peopleFields } from "@/lib/field-config";
import { useMemo, useState } from "react";

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

  const columns = useUserColumns({ visibleFields, setVisibleFields });

  const peopleFieldConfig = useMemo(() => getFieldConfig(peopleFields), []);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white w-full border rounded-md flex flex-col py-2">
        <div className="flex items-center justify-between px-2 mb-2">
          <div>
            <ViewSwitcher itemCount={data.length} tableName="People" />
          </div>

          <div className="flex items-center">
            <div>
              <FilterPopover
                fieldConfig={peopleFieldConfig}
                visibleFields={visibleFields}
                searchFields={searchFields}
                onSearchFieldsChange={setSearchFields}
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
              />
            </div>

            <div>
              <SortPopover
                fieldConfig={peopleFieldConfig}
                visibleFields={visibleFields}
                sortFields={sortFields}
                onSortFieldsChange={setSortFields}
              />
            </div>

            <div>
              <OptionsPopover
                fieldConfig={peopleFieldConfig}
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

        <FilterSortBar
          fieldConfig={peopleFieldConfig}
          onFilterOpen={() => setIsFilterOpen(true)}
        />

        <Separator />
        <DataTable<User, any> columns={columns} data={data} />
      </div>
    </div>
  );
}

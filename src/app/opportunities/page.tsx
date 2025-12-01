/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/data-table";
import { FilterItemBadge } from "@/components/filter-item-badge";
import { FilterPopover } from "@/components/filter-popover";
import { GroupedDataTable } from "@/components/grouped-data-table";
import { OptionsPopover, ViewLayout } from "@/components/options-popover";
import { SortItemBadge } from "@/components/sort-item-badge";
import { SortPopover } from "@/components/sort-popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ViewSwitcher } from "@/components/view-switcher";
import { useOpportunityColumns } from "@/hooks/use-opportunity-columns";
import { opportunities, Opportunity } from "@/lib/data";
import {
  fieldConfig,
  getFieldConfig,
  opportunityFields,
} from "@/lib/field-config";
import { useFilterStore } from "@/stores/use-filter-store";
import { useSortStore } from "@/stores/use-sort-store";
import { FilterOperator } from "@/types/common";
import { Kanban, Plus, User as UserIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function OpportunitiesPage() {
  const [visibleFields, setVisibleFields] = useState<string[]>([
    "name",
    "amount",
    "stage",
    "closeDate",
    "company",
  ]);
  const [searchFields, setSearchFields] = useState<string>("");
  const [sortFields, setSortFields] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewLayout, setViewLayout] = useState<ViewLayout>("table");
  const [currentView, setCurrentView] = useState<"all" | "by-stage">("all");

  const { filters, clearFilters } = useFilterStore();
  const { sortConditions, clearSortConditions } = useSortStore();

  const columns = useOpportunityColumns({ visibleFields, setVisibleFields });

  const opportunityFieldConfig = useMemo(
    () => getFieldConfig(opportunityFields),
    []
  );

  const renderContent = () => {
    if (currentView === "by-stage") {
      if (viewLayout === "table") {
        return (
          <GroupedDataTable<Opportunity, any>
            columns={columns}
            data={opportunities}
            groupBy="stage"
            pinnedColumns={["select", "name"]}
          />
        );
      }
      if (viewLayout === "kanban") {
        return (
          <div className="p-4 text-center text-neutral-500">
            Kanban View (Coming Soon)
          </div>
        );
      }
      if (viewLayout === "calendar") {
        return (
          <div className="p-4 text-center text-neutral-500">
            Calendar View (Coming Soon)
          </div>
        );
      }
    }

    // Default All Opportunities view (Table only)
    return (
      <DataTable<Opportunity, any>
        columns={columns}
        data={opportunities}
        pinnedColumns={["select", "name"]}
      />
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white w-full border rounded-md flex flex-col py-2">
        <div className="flex items-center justify-between px-2 mb-2">
          <div>
            <ViewSwitcher
              itemCount={opportunities.length}
              tableName="Opportunities"
              currentView={currentView === "by-stage" ? "By Stage" : undefined}
              onDefaultViewClick={() => {
                setCurrentView("all");
                setViewLayout("table");
              }}
            >
              <DropdownMenuItem
                className="text-neutral-500 w-full justify-between"
                onClick={() => {
                  setCurrentView("by-stage");
                  setViewLayout("table"); // Default to kanban when switching to by-stage
                }}
              >
                <div className="flex flex-1 items-center gap-2">
                  <Kanban />
                  By Stage
                </div>
              </DropdownMenuItem>
            </ViewSwitcher>
          </div>

          <div className="flex items-center">
            <div>
              <FilterPopover
                fieldConfig={opportunityFieldConfig}
                visibleFields={visibleFields}
                searchFields={searchFields}
                onSearchFieldsChange={setSearchFields}
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
              />
            </div>

            <div>
              <SortPopover
                fieldConfig={opportunityFieldConfig}
                visibleFields={visibleFields}
                sortFields={sortFields}
                onSortFieldsChange={setSortFields}
              />
            </div>

            <div>
              <OptionsPopover
                fieldConfig={opportunityFieldConfig}
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
                viewLayout={currentView === "by-stage" ? viewLayout : undefined}
                onViewLayoutChange={
                  currentView === "by-stage" ? setViewLayout : undefined
                }
                lockedColumns={["name"]}
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
        {renderContent()}
      </div>
    </div>
  );
}

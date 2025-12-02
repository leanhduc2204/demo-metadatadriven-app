/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/data-table";
import { FilterPopover } from "@/components/filter-popover";
import { FilterSortBar } from "@/components/filter-sort-bar";
import { GroupedDataTable } from "@/components/grouped-data-table";
import { OptionsPopover, ViewLayout } from "@/components/options-popover";
import { SortPopover } from "@/components/sort-popover";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ViewSwitcher } from "@/components/view-switcher";
import { useOpportunityColumns } from "@/hooks/use-opportunity-columns";
import { opportunities, Opportunity } from "@/lib/data";
import { getFieldConfig, opportunityFields } from "@/lib/field-config";
import { ListIcon, Table2 } from "lucide-react";
import { ReactNode, useMemo, useState } from "react";

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
  const [currentIcon, setCurrentIcon] = useState<ReactNode>(<ListIcon />);

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
            getRowId={(row) => String(row.id)}
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
        getRowId={(row) => String(row.id)}
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
                setCurrentIcon(<ListIcon />);
              }}
              currentIcon={currentIcon}
            >
              <DropdownMenuItem
                className="text-neutral-500 w-full justify-between"
                onClick={() => {
                  setCurrentView("by-stage");
                  setViewLayout("table");
                  setCurrentIcon(<Table2 />);
                }}
              >
                <div className="flex flex-1 items-center gap-2">
                  <Table2 />
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

        <FilterSortBar
          fieldConfig={opportunityFieldConfig}
          onFilterOpen={() => setIsFilterOpen(true)}
        />

        <Separator />
        {renderContent()}
      </div>
    </div>
  );
}

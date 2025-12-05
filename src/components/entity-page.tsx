/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { FilterPopover } from "@/components/filter-popover";
import { FilterSortBar } from "@/components/filter-sort-bar";
import { GroupedDataTable } from "@/components/grouped-data-table";
import { EventCalendar } from "@/components/event-calendar";
import { KanbanBoard } from "@/components/kanban-board";
import { GroupedOptionsPopover } from "@/components/grouped-options-popover";
import { OptionsPopover } from "@/components/options-popover";
import { SortPopover } from "@/components/sort-popover";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ViewSwitcher } from "@/components/view-switcher";
import { useEntityColumns } from "@/hooks/use-entity-columns";
import { useEntityPageState } from "@/hooks/use-entity-page-state";
import { LayoutIcon } from "@/components/layout-icon";
import { ViewLayout } from "@/types/common";
import { EntityConfig } from "@/lib/entity-config";

interface EntityPageProps<T> {
  config: EntityConfig<T>;
  data: T[];
}

export function EntityPage<T extends { id: number }>({
  config,
  data,
}: EntityPageProps<T>) {
  const state = useEntityPageState(config);
  const { applyViewPreset, resetToDefaultView } = state;
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");

  useEffect(() => {
    if (!viewParam) {
      resetToDefaultView();
      return;
    }

    const applied = applyViewPreset(viewParam);
    if (!applied) {
      resetToDefaultView();
    }
  }, [viewParam, applyViewPreset, resetToDefaultView]);

  const columns = useEntityColumns({
    config,
    visibleFields: state.visibleFields,
    setVisibleFields: state.setVisibleFields,
  });

  const isGroupedView =
    state.currentView === "grouped" && state.supportsGrouping;

  const renderContent = () => {
    if (isGroupedView) {
      if (state.viewLayout === ViewLayout.TABLE) {
        return (
          <GroupedDataTable<T, any>
            columns={columns}
            data={data}
            groupBy={state.groupBy}
            pinnedColumns={config.pinnedColumns}
            getRowId={(row) => String(row.id)}
            groups={state.visibleGroups}
          />
        );
      }
      if (state.viewLayout === ViewLayout.KANBAN) {
        return (
          <KanbanBoard
            data={data}
            groupBy={state.groupBy}
            groups={state.visibleGroups}
            primaryField={config.primaryField as keyof T}
            visibleFields={state.visibleFields}
            fieldConfig={state.fieldConfigData}
            formatters={config.formatters}
            compactView={state.compactView}
          />
        );
      }
      if (state.viewLayout === ViewLayout.CALENDAR && config.calendar) {
        return (
          <EventCalendar
            data={data}
            dateField={
              (state.calendarDateField as keyof T) || config.calendar.dateField
            }
            primaryField={config.primaryField as keyof T}
            visibleFields={state.visibleFields}
            fieldConfig={state.fieldConfigData}
            formatters={config.formatters}
            compactView={state.compactView}
            calendarViewType={state.calendarViewType}
          />
        );
      }
    }

    return (
      <DataTable<T, any>
        columns={columns}
        data={data}
        pinnedColumns={config.pinnedColumns}
        getRowId={(row) => String(row.id)}
      />
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white w-full border rounded-md flex flex-col py-2">
        <div className="flex items-center justify-between px-2 mb-2">
          <ViewSwitcher
            itemCount={data.length}
            tableName={config.name}
            currentView={isGroupedView ? state.groupViewLabel : undefined}
            onDefaultViewClick={state.resetToDefaultView}
            currentIcon={state.currentIcon}
          >
            {state.supportsGrouping && (
              <DropdownMenuItem
                className="text-neutral-500 w-full justify-between"
                onClick={() =>
                  state.switchToGroupedView(
                    <LayoutIcon layout={ViewLayout.TABLE} />
                  )
                }
              >
                <div className="flex flex-1 items-center gap-2">
                  <LayoutIcon layout={state.viewLayout} />
                  {state.groupViewLabel}
                </div>
              </DropdownMenuItem>
            )}
          </ViewSwitcher>

          <div className="flex items-center">
            <FilterPopover
              fieldConfig={state.fieldConfigData}
              visibleFields={state.visibleFields}
              searchFields={state.searchFields}
              onSearchFieldsChange={state.setSearchFields}
              open={state.isFilterOpen}
              onOpenChange={state.setIsFilterOpen}
            />

            <SortPopover
              fieldConfig={state.fieldConfigData}
              visibleFields={state.visibleFields}
              sortFields={state.sortFields}
              onSortFieldsChange={state.setSortFields}
            />

            {isGroupedView ? (
              <GroupedOptionsPopover
                fieldConfig={state.fieldConfigData}
                visibleFields={state.visibleFields}
                {...state.fieldHandlers}
                viewLayout={state.viewLayout}
                onViewLayoutChange={(layout) =>
                  state.changeViewLayout(layout, <LayoutIcon layout={layout} />)
                }
                groupBy={state.groupBy}
                onGroupByChange={state.setGroupBy}
                allowedGroupByFields={state.groupableFields}
                sortBy={state.sortByGroup}
                onSortByChange={state.groupHandlers.onSortByChange}
                hideEmptyGroups={state.hideEmptyGroups}
                onHideEmptyGroupsChange={state.setHideEmptyGroups}
                visibleGroups={state.visibleGroups}
                hiddenGroups={state.hiddenGroups}
                onReorderGroups={state.groupHandlers.onReorderGroups}
                onHideGroup={state.groupHandlers.onHideGroup}
                onShowGroup={state.groupHandlers.onShowGroup}
                lockedColumns={state.lockedColumns}
                // Calendar props
                calendarDateField={state.calendarDateField}
                onCalendarDateFieldChange={
                  state.calendarHandlers.onCalendarDateFieldChange
                }
                allowedDateFields={state.allowedDateFields}
                calendarViewType={state.calendarViewType}
                onCalendarViewTypeChange={
                  state.calendarHandlers.onCalendarViewTypeChange
                }
                openIn={state.openIn}
                onOpenInChange={state.calendarHandlers.onOpenInChange}
                compactView={state.compactView}
                onCompactViewChange={state.calendarHandlers.onCompactViewChange}
              />
            ) : (
              <OptionsPopover
                fieldConfig={state.fieldConfigData}
                visibleFields={state.visibleFields}
                {...state.fieldHandlers}
                lockedColumns={state.lockedColumns}
              />
            )}
          </div>
        </div>

        <FilterSortBar
          fieldConfig={state.fieldConfigData}
          onFilterOpen={state.openFilter}
        />

        <Separator />
        {renderContent()}
      </div>
    </div>
  );
}

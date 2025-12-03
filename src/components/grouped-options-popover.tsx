"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldConfigItem } from "@/lib/field-config";
import { SortOrder } from "@/types/common";
import { useState } from "react";
import { FieldsView } from "./options/fields-view";
import { GroupByView } from "./options/group-by-view";
import { GroupView } from "./options/group-view";
import { GroupedMainMenu } from "./options/grouped-main-menu";
import { HiddenFieldsView } from "./options/hidden-fields-view";
import { HiddenGroupsView } from "./options/hidden-groups-view";
import { LayoutView } from "./options/layout-view";
import { SortView } from "./options/sort-view";

export type ViewLayout = "table" | "kanban" | "calendar";

export interface GroupedOptionsPopoverProps {
  fieldConfig: Record<string, FieldConfigItem>;
  visibleFields: string[];
  onHideField: (field: string) => void;
  onShowField: (field: string) => void;
  onReorderFields: (fields: string[]) => void;

  viewLayout: ViewLayout;
  onViewLayoutChange: (layout: ViewLayout) => void;

  groupBy: string;
  onGroupByChange: (field: string) => void;
  allowedGroupByFields: string[];

  sortBy: SortOrder;
  onSortByChange: (sort: SortOrder) => void;

  hideEmptyGroups: boolean;
  onHideEmptyGroupsChange: (hide: boolean) => void;

  visibleGroups: string[];
  hiddenGroups: string[];
  onReorderGroups: (groups: string[]) => void;
  onHideGroup: (group: string) => void;
  onShowGroup: (group: string) => void;

  lockedColumns?: string[];
}

type ViewState =
  | "main"
  | "layout"
  | "fields"
  | "hidden-fields"
  | "group"
  | "group-by"
  | "sort"
  | "hidden-groups";

export function GroupedOptionsPopover({
  fieldConfig,
  visibleFields,
  onHideField,
  onShowField,
  onReorderFields,
  viewLayout,
  onViewLayoutChange,
  groupBy,
  onGroupByChange,
  allowedGroupByFields,
  sortBy,
  onSortByChange,
  hideEmptyGroups,
  onHideEmptyGroupsChange,
  visibleGroups,
  hiddenGroups,
  onReorderGroups,
  onHideGroup,
  onShowGroup,
  lockedColumns = ["name"],
}: GroupedOptionsPopoverProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<ViewState>("main");

  // Reset view when closing
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => setView("main"), 300);
    }
  };

  const renderContent = () => {
    switch (view) {
      case "layout":
        return (
          <LayoutView
            currentLayout={viewLayout}
            onLayoutChange={onViewLayoutChange}
            onBack={() => setView("main")}
          />
        );
      case "fields":
        return (
          <FieldsView
            fieldConfig={fieldConfig}
            visibleFields={visibleFields}
            onHideField={onHideField}
            onReorderFields={onReorderFields}
            onBack={() => setView("main")}
            onOpenHiddenFields={() => setView("hidden-fields")}
            lockedColumns={lockedColumns}
          />
        );
      case "hidden-fields":
        return (
          <HiddenFieldsView
            fieldConfig={fieldConfig}
            visibleFields={visibleFields}
            onShowField={onShowField}
            onBack={() => setView("fields")}
          />
        );
      case "group":
        return (
          <GroupView
            onBack={() => setView("main")}
            groupBy={groupBy}
            sortBy={sortBy}
            hideEmptyGroups={hideEmptyGroups}
            onHideEmptyGroupsChange={onHideEmptyGroupsChange}
            visibleGroups={visibleGroups}
            onReorderGroups={onReorderGroups}
            onHideGroup={onHideGroup}
            onOpenHiddenGroups={() => setView("hidden-groups")}
            onOpenGroupBy={() => setView("group-by")}
            onOpenSort={() => setView("sort")}
            fieldConfig={fieldConfig}
          />
        );
      case "group-by":
        return (
          <GroupByView
            onBack={() => setView("group")}
            groupBy={groupBy}
            onGroupByChange={onGroupByChange}
            allowedGroupByFields={allowedGroupByFields}
            fieldConfig={fieldConfig}
          />
        );
      case "sort":
        return (
          <SortView
            sortOrder={sortBy}
            onSortOrderChange={onSortByChange}
            onBack={() => setView("group")}
          />
        );
      case "hidden-groups":
        return (
          <HiddenGroupsView
            hiddenGroups={hiddenGroups}
            onShowGroup={onShowGroup}
            onBack={() => setView("group")}
          />
        );
      default:
        return (
          <GroupedMainMenu
            visibleFieldsCount={visibleFields.length}
            onOpenFields={() => setView("fields")}
            onOpenLayout={() => setView("layout")}
            onOpenGroup={() => setView("group")}
            currentLayoutLabel={
              viewLayout.charAt(0).toUpperCase() + viewLayout.slice(1)
            }
            currentGroupByLabel={fieldConfig[groupBy]?.label || groupBy}
          />
        );
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} size={"sm"} className="text-neutral-500 px-2">
          Options
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 py-1 flex flex-col gap-1" align="end">
        {renderContent()}
      </PopoverContent>
    </Popover>
  );
}

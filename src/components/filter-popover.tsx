"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterOperator } from "@/types/common";
import { useFilterStore } from "@/stores/use-filter-store";
import { FieldConfigItem } from "@/lib/field-config";
import { FilterItem } from "./filter/filter-item";
import { FilterMenu } from "./filter/filter-menu";

interface FilterPopoverProps {
  fieldConfig: Record<string, FieldConfigItem>;
  visibleFields: string[];
  searchFields: string;
  onSearchFieldsChange: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FilterPopover({
  fieldConfig,
  visibleFields,
  searchFields,
  onSearchFieldsChange,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: FilterPopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen =
    isControlled && controlledOnOpenChange
      ? controlledOnOpenChange
      : setUncontrolledOpen;

  const { filters, addFilter, updateFilter } = useFilterStore();

  const activeFilter = filters.find((f) => f.id === activeFilterId);

  const handleSelectField = (field: string) => {
    if (filters.find((f) => f.field === field)) {
      setActiveFilterId(field);
    } else {
      addFilter({
        id: field,
        field,
        operator: FilterOperator.CONTAINS,
        value: "",
      });
      setActiveFilterId(field);
    }
  };

  const renderContent = () => {
    if (activeFilterId && activeFilter) {
      return (
        <FilterItem
          label={fieldConfig[activeFilter.field]?.label || activeFilter.field}
          onBack={() => setActiveFilterId(null)}
          onSelectOperator={(op) =>
            updateFilter(activeFilterId, { operator: op })
          }
          selectedOperator={activeFilter.operator}
          filterValue={activeFilter.value}
          onFilterValueChange={(val) =>
            updateFilter(activeFilterId, { value: val })
          }
        />
      );
    }

    return (
      <FilterMenu
        fieldConfig={fieldConfig}
        visibleFields={visibleFields}
        searchFields={searchFields}
        onSearchFieldsChange={onSearchFieldsChange}
        onSelectField={handleSelectField}
        onClose={() => setOpen(false)}
      />
    );
  };

  return (
    <Popover
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setActiveFilterId(null);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="text-neutral-500 px-2"
          onClick={() => {}}
        >
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {renderContent()}
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldConfigItem, getArrayFieldValues } from "@/lib/field-config";
import { getDefaultOperator } from "@/lib/filter-operators";
import { useFilterStore } from "@/stores/use-filter-store";
import { useState } from "react";
import { FilterItem } from "./filter/filter-item";
import { FilterMenu } from "./filter/filter-menu";

interface FilterPopoverProps {
  fieldConfig: Record<string, FieldConfigItem>;
  visibleFields: string[];
  searchFields: string;
  onSearchFieldsChange: (value: string) => void;
  getArrayFieldValues?: (field: string) => string[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FilterPopover({
  fieldConfig,
  visibleFields,
  searchFields,
  onSearchFieldsChange,
  getArrayFieldValues: getArrayFieldValuesProp,
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
      const fieldConfigItem = fieldConfig[field];
      const defaultOperator = getDefaultOperator(fieldConfigItem?.type, field);
      addFilter({
        id: field,
        field,
        operator: defaultOperator,
        value: "",
      });
      setActiveFilterId(field);
    }
  };

  const renderContent = () => {
    if (activeFilterId && activeFilter) {
      const fieldConfigItem = fieldConfig[activeFilter.field];
      // Get array field values: try from prop first, then fallback to default function
      const propValues = getArrayFieldValuesProp?.(activeFilter.field);
      const arrayFieldValues =
        propValues && propValues.length > 0
          ? propValues
          : getArrayFieldValues(activeFilter.field);
      return (
        <FilterItem
          label={fieldConfigItem?.label || activeFilter.field}
          field={activeFilter.field}
          fieldType={fieldConfigItem?.type}
          arrayFieldValues={arrayFieldValues}
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

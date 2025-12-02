"use client";

import { FilterItemBadge } from "@/components/filter-item-badge";
import { SortItemBadge } from "@/components/sort-item-badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FieldConfigItem } from "@/lib/field-config";
import { useFilterStore } from "@/stores/use-filter-store";
import { useSortStore } from "@/stores/use-sort-store";
import { FilterOperator } from "@/types/common";
import { Plus, User as UserIcon } from "lucide-react";

interface FilterSortBarProps {
  fieldConfig: Record<string, FieldConfigItem>;
  onFilterOpen: () => void;
}

export function FilterSortBar({
  fieldConfig,
  onFilterOpen,
}: FilterSortBarProps) {
  const { filters, clearFilters } = useFilterStore();
  const { sortConditions, clearSortConditions } = useSortStore();

  const hasActiveFilters =
    filters.length > 0 &&
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
      ));

  if (!hasActiveFilters && sortConditions.length === 0) {
    return null;
  }

  return (
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
              onClick={onFilterOpen}
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
  );
}

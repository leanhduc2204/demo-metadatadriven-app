import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FilterCondition, FilterOperator } from "@/types/common";
import { Funnel, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterItemPopover } from "./filter-item-popover";
import { useFilterStore } from "@/stores/use-filter-store";
import { useState, useMemo } from "react";
import { fieldConfig, FieldType } from "@/lib/field-config";
import { parse, isValid, format } from "date-fns";

interface FilterItemBadgeProps {
  filter: FilterCondition;
  icon: React.ReactNode;
  label: string;
}

export function FilterItemBadge({ filter, icon, label }: FilterItemBadgeProps) {
  const { updateFilter, removeFilter } = useFilterStore();
  const [open, setOpen] = useState(false);

  const fieldType = fieldConfig[filter.field]?.type;

  const isEmpty =
    filter.operator === FilterOperator.IS_EMPTY ||
    filter.operator === FilterOperator.IS_NOT_EMPTY;
  const isDateOperatorWithoutValue =
    filter.operator === FilterOperator.IS_IN_PAST ||
    filter.operator === FilterOperator.IS_IN_FUTURE ||
    filter.operator === FilterOperator.IS_TODAY;

  const isAnyField = filter.id === "Search any field";

  const isArrayFieldWithIsOperator =
    fieldType === FieldType.ARRAY &&
    (filter.operator === FilterOperator.IS ||
      filter.operator === FilterOperator.IS_NOT);

  const isDateFieldWithDateOperator =
    fieldType === FieldType.DATE &&
    (filter.operator === FilterOperator.IS ||
      filter.operator === FilterOperator.IS_BEFORE ||
      filter.operator === FilterOperator.IS_AFTER);

  const displayValue = useMemo(() => {
    if (isEmpty) {
      return filter.operator === FilterOperator.IS_EMPTY ? "Empty" : "NotEmpty";
    }

    if (isDateOperatorWithoutValue) {
      return filter.operator === FilterOperator.IS_IN_PAST
        ? "Past"
        : filter.operator === FilterOperator.IS_IN_FUTURE
        ? "Future"
        : "Today";
    }

    if (!filter.value) {
      return "";
    }

    if (isArrayFieldWithIsOperator) {
      const values = filter.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      if (values.length === 0) return "";
      if (values.length <= 2) {
        return values.join(", ");
      }
      return `${values.slice(0, 2).join(", ")} and ${values.length - 2} more`;
    }

    if (isDateFieldWithDateOperator) {
      try {
        const parsed = parse(filter.value, "dd/MM/yyyy HH:mm", new Date());
        if (isValid(parsed)) {
          return filter.operator === FilterOperator.IS_BEFORE
            ? `< ${format(parsed, "dd/MM/yyyy HH:mm")}`
            : filter.operator === FilterOperator.IS_AFTER
            ? `> ${format(parsed, "dd/MM/yyyy HH:mm")}`
            : format(parsed, "dd/MM/yyyy HH:mm");
        }
        const parsedDate = parse(filter.value, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
          return format(parsedDate, "dd/MM/yyyy");
        }
      } catch {}
      if (filter.value.includes("_")) {
        const digits = filter.value.replace(/\D/g, "");
        if (digits.length >= 8) {
          return filter.value;
        }
      }
      return filter.value;
    }

    return filter.value;
  }, [
    filter.value,
    filter.operator,
    isEmpty,
    isDateOperatorWithoutValue,
    isArrayFieldWithIsOperator,
    isDateFieldWithDateOperator,
  ]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          key={filter.id}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "flex items-center justify-between gap-2 px-2 rounded-sm bg-blue-50 hover:bg-blue-50 text-xs text-blue-500 hover:text-blue-500 border-blue-100 cursor-pointer"
          )}
        >
          <div className="flex items-center gap-1">
            {isAnyField ? <Funnel /> : icon}
            <span className="font-medium">
              {isAnyField ? "Any field" : label}
              {displayValue ? `: ${displayValue}` : ""}
            </span>
          </div>
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            className="text-blue-500 hover:text-blue-500 hover:bg-blue-100 size-6"
            onClick={(e) => {
              e.stopPropagation();
              removeFilter(filter.id);
            }}
          >
            <X />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-0">
        <FilterItemPopover
          label={label}
          onClose={() => setOpen(false)}
          onSelectOperator={(operator) => {
            updateFilter(filter.id, { operator });
          }}
          selectedOperator={filter.operator}
          filterValue={filter.value}
          onFilterValueChange={(value) => {
            console.log("value", value);
            updateFilter(filter.id, { value });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

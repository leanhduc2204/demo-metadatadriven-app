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
import { useState } from "react";

interface FilterItemBadgeProps {
  filter: FilterCondition;
  icon: React.ReactNode;
  label: string;
}

export function FilterItemBadge({ filter, icon, label }: FilterItemBadgeProps) {
  const { updateFilter, removeFilter } = useFilterStore();
  const [open, setOpen] = useState(false);
  const isEmpty =
    filter.operator === FilterOperator.IS_EMPTY ||
    filter.operator === FilterOperator.IS_NOT_EMPTY;
  const isAnyField = filter.id === "Search any field";
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
              {filter.value
                ? `: ${filter.value}`
                : isEmpty
                ? filter.operator === FilterOperator.IS_EMPTY
                  ? ": Empty"
                  : ": NotEmpty"
                : ""}
            </span>
          </div>
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            className="text-blue-500 hover:text-blue-500 hover:bg-blue-100 size-6"
            onClick={(e) => {
              e.stopPropagation(); // Prevent popover from opening when clicking remove
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
            updateFilter(filter.id, { value });
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

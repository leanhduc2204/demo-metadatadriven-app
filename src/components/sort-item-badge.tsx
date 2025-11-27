import { cn } from "@/lib/utils";
import { useSortStore } from "@/stores/use-sort-store";
import { SortBy, SortCondition } from "@/types/common";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";

interface SortItemBadgeProps {
  sortCondition: SortCondition;
  label: string;
}

export function SortItemBadge({ sortCondition, label }: SortItemBadgeProps) {
  const { removeSortCondition, updateSortCondition } = useSortStore();
  return (
    <div
      key={sortCondition.id}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "flex items-center justify-between gap-2 px-2 rounded-sm bg-blue-50 hover:bg-blue-50 text-blue-500 hover:text-blue-500 border-blue-100 cursor-pointer"
      )}
      onClick={() =>
        updateSortCondition(sortCondition.id, {
          sortBy:
            sortCondition.sortBy === SortBy.ASC ? SortBy.DESC : SortBy.ASC,
        })
      }
    >
      <div className="flex items-center gap-1">
        {sortCondition.sortBy === SortBy.ASC ? <ArrowUp /> : <ArrowDown />}
        <span className="font-medium">{label}</span>
      </div>
      <Button
        variant={"ghost"}
        size={"icon-sm"}
        className="text-blue-500 hover:text-blue-500 hover:bg-blue-100 size-6"
        onClick={(e) => {
          e.stopPropagation(); // Prevent popover from opening when clicking remove
          removeSortCondition(sortCondition.id);
        }}
      >
        <X />
      </Button>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SortBy } from "@/types/common";
import { X } from "lucide-react";
import { useState } from "react";
import { FieldConfigItem } from "@/lib/field-config";
import { useSortStore } from "@/stores/use-sort-store";
import { SortDirectionSelect } from "@/components/sort/sort-direction-select";
import { SortFieldList } from "@/components/sort/sort-field-list";
import { SortFieldSearch } from "@/components/sort/sort-field-search";

interface SortPopoverProps {
  fieldConfig: Record<string, FieldConfigItem>;
  visibleFields: string[];
  sortFields: string;
  onSortFieldsChange: (value: string) => void;
}

export function SortPopover({
  fieldConfig,
  visibleFields,
  sortFields,
  onSortFieldsChange,
}: SortPopoverProps) {
  const [open, setOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.ASC);

  const { addSortCondition, sortConditions } = useSortStore();

  const handleFieldClick = (field: string) => {
    if (sortConditions.find((sc) => sc.field === field)) {
      // Already sorted, do nothing or toggle? Original did nothing
    } else {
      addSortCondition({
        id: field,
        field,
        sortBy,
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} size={"sm"} className="text-neutral-500 px-2">
          Sort
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center">
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            onClick={() => setOpen(false)}
          >
            <X className="text-neutral-400" />
          </Button>

          <span className="text-neutral-700 text-sm">Sort</span>
        </div>
        <Separator />
        <div>
          <SortDirectionSelect value={sortBy} onChange={setSortBy} />
        </div>
        <Separator />
        <SortFieldSearch value={sortFields} onChange={onSortFieldsChange} />
        <Separator />
        <div className="max-h-[300px] overflow-y-auto">
          <SortFieldList
            fieldConfig={fieldConfig}
            visibleFields={visibleFields}
            searchTerm={sortFields}
            onFieldClick={handleFieldClick}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SORT_BY_OPTIONS } from "@/lib/constants";
import { SortBy } from "@/types/common";
import { Check, ChevronDown, User as UserIcon, X } from "lucide-react";
import { useState } from "react";

type IconComponent = typeof UserIcon;

interface FieldConfig {
  label: string;
  icon: IconComponent;
}

interface SortPopoverProps {
  fieldConfig: Record<string, FieldConfig>;
  visibleFields: string[];
  sortFields: string;
  onSortFieldsChange: (value: string) => void;
  sortBy: SortBy;
  onSortByChange: (value: SortBy) => void;
}

export function SortPopover({
  fieldConfig,
  visibleFields,
  sortFields,
  onSortFieldsChange,
  sortBy,
  onSortByChange,
}: SortPopoverProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} size={"sm"} className="text-neutral-500">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size={"sm"}
                className="text-neutral-500 text-xs w-full justify-between"
              >
                {sortBy === SortBy.ASC
                  ? SORT_BY_OPTIONS[SortBy.ASC]
                  : SORT_BY_OPTIONS[SortBy.DESC]}
                <ChevronDown className="text-neutral-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => onSortByChange(SortBy.ASC)}
                className="justify-between text-neutral-500 text-xs"
              >
                <span>{SORT_BY_OPTIONS[SortBy.ASC]}</span>
                {sortBy === SortBy.ASC && <Check />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onSortByChange(SortBy.DESC)}
                className="justify-between text-neutral-500 text-xs"
              >
                <span>{SORT_BY_OPTIONS[SortBy.DESC]}</span>
                {sortBy !== SortBy.ASC && <Check />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Separator />
        <div>
          <Input
            placeholder="Search fields"
            value={sortFields}
            onChange={(e) => onSortFieldsChange(e.target.value)}
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-xs placeholder:text-neutral-400 text-xs"
          />
        </div>
        <Separator />
        {(() => {
          const sortLower = sortFields.toLowerCase().trim();
          const allFields = Object.keys(fieldConfig).filter(
            (field) => field !== "id"
          );

          const matchedFields = sortLower
            ? allFields.filter((field) => {
                const config = fieldConfig[field];
                const label =
                  config?.label.toLowerCase() || field.toLowerCase();
                return label.includes(sortLower);
              })
            : allFields;

          const matchedVisibleFields = matchedFields.filter((field) =>
            visibleFields.includes(field)
          );
          const matchedHiddenFields = matchedFields.filter(
            (field) => !visibleFields.includes(field) && field !== "id"
          );

          const hasSearch = sortLower.length > 0;
          const hasMatches = matchedFields.length > 0;
          const showVisibleFields =
            !hasSearch || (hasMatches && matchedVisibleFields.length > 0);
          const showHiddenFields =
            !hasSearch || (hasMatches && matchedHiddenFields.length > 0);

          return (
            <>
              {showVisibleFields && (
                <>
                  <div>
                    <div className="bg-neutral-100 px-1 py-0.5">
                      <span className="text-[10px] text-neutral-500 font-light">
                        Visible fields
                      </span>
                    </div>
                    <div className="py-1 px-0.5 flex flex-col gap-1">
                      {(hasSearch ? matchedVisibleFields : visibleFields).map(
                        (field) => {
                          const config = fieldConfig[field];
                          const Icon = config?.icon || UserIcon;
                          return (
                            <Button
                              key={field}
                              variant={"ghost"}
                              className="justify-start text-neutral-500 text-sm font-light gap-2"
                              size={"sm"}
                            >
                              <Icon />
                              <span>{config?.label || field}</span>
                            </Button>
                          );
                        }
                      )}
                    </div>
                  </div>
                  {showHiddenFields && <Separator />}
                </>
              )}
              {showHiddenFields && (
                <div>
                  <div className="bg-neutral-100 px-1 py-0.5">
                    <span className="text-[10px] text-neutral-500 font-light">
                      Hidden fields
                    </span>
                  </div>
                  <div className="py-1 px-0.5 flex flex-col gap-1">
                    {(hasSearch
                      ? matchedHiddenFields
                      : Object.keys(fieldConfig).filter(
                          (field) =>
                            !visibleFields.includes(field) && field !== "id"
                        )
                    ).map((field) => {
                      const config = fieldConfig[field];
                      const Icon = config?.icon || UserIcon;
                      return (
                        <Button
                          key={field}
                          variant={"ghost"}
                          className="justify-start text-neutral-500 text-sm font-light gap-2"
                          size={"sm"}
                        >
                          <Icon />
                          <span>{config?.label || field}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </PopoverContent>
    </Popover>
  );
}

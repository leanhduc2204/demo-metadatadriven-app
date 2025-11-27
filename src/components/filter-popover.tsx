"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Funnel, Search, User as UserIcon, X } from "lucide-react";

type IconComponent = typeof UserIcon;

interface FieldConfig {
  label: string;
  icon: IconComponent;
}

interface FilterPopoverProps {
  fieldConfig: Record<string, FieldConfig>;
  visibleFields: string[];
  searchFields: string;
  onSearchFieldsChange: (value: string) => void;
}

export function FilterPopover({
  fieldConfig,
  visibleFields,
  searchFields,
  onSearchFieldsChange,
}: FilterPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="text-neutral-500"
          onClick={() => {}}
        >
          Filter
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

          <span className="text-neutral-700 text-sm">Filter</span>
        </div>
        <Separator />
        <div>
          <Input
            placeholder="Search fields"
            value={searchFields}
            onChange={(e) => onSearchFieldsChange(e.target.value)}
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-xs placeholder:text-neutral-400 text-xs"
          />
        </div>
        <Separator />
        {(() => {
          // Tìm kiếm field dựa trên searchFields
          const searchLower = searchFields.toLowerCase().trim();
          const allFields = Object.keys(fieldConfig);

          // Tìm các field khớp với search
          const matchedFields = searchLower
            ? allFields.filter((field) => {
                const config = fieldConfig[field];
                const label =
                  config?.label.toLowerCase() || field.toLowerCase();
                return label.includes(searchLower);
              })
            : allFields;

          // Phân loại field tìm được
          const matchedVisibleFields = matchedFields.filter((field) =>
            visibleFields.includes(field)
          );
          const matchedHiddenFields = matchedFields.filter(
            (field) => !visibleFields.includes(field)
          );

          // Logic hiển thị: nếu có search và không tìm thấy gì -> ẩn cả hai
          const hasSearch = searchLower.length > 0;
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
                          (field) => !visibleFields.includes(field)
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
        <Separator />
        <div className="py-1 px-0.5 flex flex-col gap-1">
          <Button
            variant={"ghost"}
            size={"sm"}
            className="justify-start text-neutral-500 text-sm font-light"
          >
            <Search />
            Search any field
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="justify-start text-neutral-500 text-sm font-light"
          >
            <Funnel />
            Advanced filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

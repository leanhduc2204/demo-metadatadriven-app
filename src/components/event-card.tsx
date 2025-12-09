/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox } from "@/components/ui/checkbox";
import { FieldConfigItem } from "@/lib/field-config";
import { EntityConfig } from "@/lib/entity-config";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface EventCardProps<T> {
  item: T;
  primaryField: keyof T;
  visibleFields: string[];
  fieldConfig: Record<string, FieldConfigItem>;
  config: EntityConfig<T>;
  context?: "kanban" | "calendar" | "table";
  compact?: boolean;
  className?: string;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
}

export function EventCard<T extends { id: number }>({
  item,
  primaryField,
  visibleFields,
  fieldConfig,
  config,
  context = "table",
  compact = false,
  className,
  selected = false,
  onSelectChange,
}: EventCardProps<T>) {
  // Format primary field value (skip customCellRenderers for simplicity)
  const formatPrimaryValue = (field: keyof T, value: any): ReactNode => {
    // Priority 1: Use context-specific formatter if available
    const contextFormatter = config.primaryFieldFormatters?.[context];
    if (contextFormatter) {
      return contextFormatter(value, item);
    }

    // Priority 2: Check if this is a group column with color map
    const isGroupColumn = String(field) === config.grouping?.defaultGroupBy;
    const groupColorClass =
      isGroupColumn && config.groupColorMap
        ? config.groupColorMap[String(value)]
        : undefined;

    if (groupColorClass) {
      return (
        <Badge
          variant={"secondary"}
          className={`${groupColorClass} rounded-md px-2 py-0.5`}
        >
          <span className="font-medium text-xs whitespace-nowrap">
            {String(value || "")}
          </span>
        </Badge>
      );
    }

    // Priority 3: Use formatter if available
    if (config.formatters?.[field]) {
      const formatter = config.formatters[field]!;
      const formatterFn = formatter as any;
      const formatted = formatterFn(value, item);
      // If formatter returns ReactNode (like Badge), extract text or return as is
      // For now, just return the formatted value
      return formatted;
    }

    // Priority 4: Default formatting (simple text)
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  };

  // Format field value with priority (for non-primary fields)
  const formatFieldValue = (field: string, value: any): ReactNode => {
    const fieldKey = field as keyof T;

    // Priority 1: Use custom cell renderer if available (full control)
    if (config.customCellRenderers?.[fieldKey]) {
      return config.customCellRenderers[fieldKey]!(item, fieldKey);
    }

    // Priority 2: Check if this is a group column with color map
    const isGroupColumn = field === config.grouping?.defaultGroupBy;
    const groupColorClass =
      isGroupColumn && config.groupColorMap
        ? config.groupColorMap[String(value)]
        : undefined;

    if (groupColorClass) {
      return (
        <Badge
          variant={"secondary"}
          className={`${groupColorClass} rounded-md px-2 py-0.5`}
        >
          <span className="font-medium text-xs whitespace-nowrap">
            {String(value || "")}
          </span>
        </Badge>
      );
    }

    // Priority 3: Use formatter if available
    if (config.formatters?.[fieldKey]) {
      const formatter = config.formatters[fieldKey]!;
      // Call formatter with both value and row
      // If formatter only accepts value (backward compatible), it will ignore the second parameter
      const formatterFn = formatter as any;
      return formatterFn(value, item);
    }

    // Priority 4: Default formatting
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  };

  // Get primary field value (skip customCellRenderers)
  const primaryValue = item[primaryField];
  const formattedPrimaryValue = formatPrimaryValue(primaryField, primaryValue);

  // Get visible fields excluding primary field
  const displayFields = visibleFields.filter(
    (field) => field !== primaryField && field !== "id"
  );

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={cn(
        "group relative bg-white border rounded-md p-1.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-xs",
        selected && "ring-2 ring-primary border-primary",
        className
      )}
    >
      {/* Checkbox - visible on hover or when selected */}
      <div
        className={cn(
          "absolute top-1.5 right-1.5 z-10 transition-opacity",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        onClick={handleCheckboxClick}
      >
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelectChange?.(!!checked)}
          className="h-4 w-4 bg-white border-neutral-300 shadow-sm"
        />
      </div>

      {/* Primary field - always visible */}
      <div className="text-[13px] font-medium text-[#171717] truncate leading-tight pr-4">
        {formattedPrimaryValue}
      </div>

      {/* Additional fields - only in full mode */}
      {!compact && displayFields.length > 0 && (
        <div className="mt-1 space-y-0.5">
          {displayFields.map((field) => {
            const fieldCfg = fieldConfig[field];
            if (!fieldCfg) return null;

            const Icon = fieldCfg.icon;
            const value = item[field as keyof T];
            const formattedValue = formatFieldValue(field, value);

            if (!formattedValue) return null;

            return (
              <div
                key={field}
                className="flex items-center gap-1 text-neutral-500"
              >
                <Icon className="h-3 w-3 shrink-0" />
                <span className="truncate text-[13px] text-[#333333] font-normal">
                  {formattedValue}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

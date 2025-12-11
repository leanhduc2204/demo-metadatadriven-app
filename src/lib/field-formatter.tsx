/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { EntityConfig } from "./entity-config";

interface FormatFieldValueOptions<T> {
  config: EntityConfig<T>;
  field: string | keyof T;
  value: any;
  row: T;
  context?: "kanban" | "calendar" | "table";
  isPrimaryField?: boolean;
}

/**
 * Formats a field value according to the entity config priority:
 * 1. Custom cell renderer (if not primary field)
 * 2. Primary field formatter (if primary field and context provided)
 * 3. Group color map badge (if field is group column)
 * 4. Formatter function
 * 5. Default formatting (string conversion)
 */
export function formatFieldValue<T extends { id: number }>({
  config,
  field,
  value,
  row,
  context,
  isPrimaryField = false,
}: FormatFieldValueOptions<T>): ReactNode {
  const fieldKey = field as keyof T;

  // Priority 1: Use custom cell renderer if available (skip for primary field)
  if (!isPrimaryField && config.customCellRenderers?.[fieldKey]) {
    return config.customCellRenderers[fieldKey]!(row, fieldKey);
  }

  // Priority 2: Use context-specific primary field formatter (only for primary field)
  if (isPrimaryField && context && config.primaryFieldFormatters?.[context]) {
    return config.primaryFieldFormatters[context](value, row);
  }

  // Priority 3: Check if this is a group column with color map
  const isGroupColumn = String(field) === config.grouping?.defaultGroupBy;
  const groupColorClass =
    isGroupColumn && config.groupColorMap
      ? config.groupColorMap[String(value)]
      : undefined;

  if (groupColorClass) {
    return (
      <Badge
        variant={"secondary"}
        className={`${groupColorClass} rounded-md px-1.5 py-0.5`}
      >
        <span className="font-medium text-xs whitespace-nowrap">
          {String(value || "")}
        </span>
      </Badge>
    );
  }

  // Priority 4: Use formatter if available
  if (config.formatters?.[fieldKey]) {
    const formatter = config.formatters[fieldKey]!;
    // Call formatter with both value and row
    // If formatter only accepts value (backward compatible), it will ignore the second parameter
    const formatterFn = formatter as (value: any, row?: T) => ReactNode;
    return formatterFn(value, row);
  }

  // Priority 5: Default formatting
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

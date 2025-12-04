/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldConfigItem } from "@/lib/field-config";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EventCardProps<T> {
  item: T;
  primaryField: keyof T;
  visibleFields: string[];
  fieldConfig: Record<string, FieldConfigItem>;
  formatters?: Partial<Record<keyof T, (value: any) => ReactNode>>;
  compact?: boolean;
  className?: string;
}

export function EventCard<T extends { id: number }>({
  item,
  primaryField,
  visibleFields,
  fieldConfig,
  formatters,
  compact = false,
  className,
}: EventCardProps<T>) {
  // Get primary field value
  const primaryValue = item[primaryField];
  const formattedPrimaryValue = formatters?.[primaryField]
    ? formatters[primaryField]!(primaryValue)
    : String(primaryValue || "");

  // Get visible fields excluding primary field
  const displayFields = visibleFields.filter(
    (field) => field !== primaryField && field !== "id"
  );

  // Format field value
  const formatFieldValue = (field: string, value: any): ReactNode => {
    if (formatters?.[field as keyof T]) {
      return formatters[field as keyof T]!(value);
    }
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  };

  return (
    <div
      className={cn(
        "bg-white border rounded-md p-1.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-xs",
        className
      )}
    >
      {/* Primary field - always visible */}
      <div className="font-medium text-neutral-900 truncate leading-tight">
        {formattedPrimaryValue}
      </div>

      {/* Additional fields - only in full mode */}
      {!compact && displayFields.length > 0 && (
        <div className="mt-1 space-y-0.5">
          {displayFields.map((field) => {
            const config = fieldConfig[field];
            if (!config) return null;

            const Icon = config.icon;
            const value = item[field as keyof T];
            const formattedValue = formatFieldValue(field, value);

            if (!formattedValue) return null;

            return (
              <div
                key={field}
                className="flex items-center gap-1 text-neutral-500"
              >
                <Icon className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{formattedValue}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

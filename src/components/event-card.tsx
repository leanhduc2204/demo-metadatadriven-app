import { Checkbox } from "@/components/ui/checkbox";
import { FieldConfigItem } from "@/lib/field-config";
import { EntityConfig } from "@/lib/entity-config";
import { cn } from "@/lib/utils";
import { formatFieldValue } from "@/lib/field-formatter";
import { RESERVED_FIELDS } from "@/lib/constants";

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
  // Get primary field value
  const primaryValue = item[primaryField];
  const formattedPrimaryValue = formatFieldValue({
    config,
    field: primaryField,
    value: primaryValue,
    row: item,
    context,
    isPrimaryField: true,
  });

  // Get visible fields excluding primary field
  const displayFields = visibleFields.filter(
    (field) => field !== primaryField && field !== RESERVED_FIELDS.ID
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
            const formattedValue = formatFieldValue({
              config,
              field,
              value,
              row: item,
              context,
              isPrimaryField: false,
            });

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

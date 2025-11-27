import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FieldConfigItem } from "@/lib/field-config";
import { User as UserIcon } from "lucide-react";

interface SortFieldListProps {
  fieldConfig: Record<string, FieldConfigItem>;
  visibleFields: string[];
  searchTerm: string;
  onFieldClick: (field: string) => void;
}

export function SortFieldList({
  fieldConfig,
  visibleFields,
  searchTerm,
  onFieldClick,
}: SortFieldListProps) {
  const sortLower = searchTerm.toLowerCase().trim();
  const allFields = Object.keys(fieldConfig).filter((field) => field !== "id");

  const matchedFields = sortLower
    ? allFields.filter((field) => {
        const config = fieldConfig[field];
        const label = config?.label.toLowerCase() || field.toLowerCase();
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

  if (!showVisibleFields && !showHiddenFields) {
    return (
      <div className="p-4 text-center text-neutral-500 text-xs">
        No fields found
      </div>
    );
  }

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
                      onClick={() => onFieldClick(field)}
                    >
                      <Icon className="h-4 w-4" />
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
                  (field) => !visibleFields.includes(field) && field !== "id"
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
                  onClick={() => onFieldClick(field)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{config?.label || field}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

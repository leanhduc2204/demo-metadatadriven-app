import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FieldConfigItem } from "@/lib/field-config";
import { Check, ChevronLeft } from "lucide-react";
import { useState } from "react";

interface DateFieldViewProps {
  currentDateField: string;
  onDateFieldChange: (field: string) => void;
  allowedDateFields: string[];
  fieldConfig: Record<string, FieldConfigItem>;
  onBack: () => void;
}

export function DateFieldView({
  currentDateField,
  onDateFieldChange,
  allowedDateFields,
  fieldConfig,
  onBack,
}: DateFieldViewProps) {
  const [searchFields, setSearchFields] = useState("");

  const filteredFields = allowedDateFields.filter((field) => {
    const config = fieldConfig[field];
    const label = config?.label || field;
    return label.toLowerCase().includes(searchFields.toLowerCase());
  });

  return (
    <>
      <div className="flex items-center">
        <Button variant={"ghost"} size={"icon-sm"} onClick={onBack}>
          <ChevronLeft className="text-neutral-400" />
        </Button>
        <span className="text-neutral-900 font-semibold text-sm">
          Date field
        </span>
      </div>
      <Separator />
      <div>
        <Input
          placeholder="Search fields"
          value={searchFields}
          onChange={(e) => setSearchFields(e.target.value)}
          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-xs placeholder:text-neutral-400 text-xs"
        />
      </div>
      <Separator />
      <div className="py-1 px-0.5 flex flex-col gap-1">
        {filteredFields.map((field) => {
          const config = fieldConfig[field];
          const Icon = config?.icon;

          return (
            <Button
              key={field}
              variant={"ghost"}
              className="justify-between w-full text-neutral-500"
              size={"sm"}
              onClick={() => onDateFieldChange(field)}
            >
              <div className="flex flex-1 items-center gap-2">
                {Icon && <Icon className="h-4 w-4" />}
                <span>{config?.label || field}</span>
              </div>
              <Check
                size={16}
                className={`${
                  currentDateField === field ? "opacity-100" : "opacity-0"
                }`}
              />
            </Button>
          );
        })}
      </div>
    </>
  );
}

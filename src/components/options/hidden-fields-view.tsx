import { ChevronLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FieldConfigItem } from "@/lib/field-config";

interface HiddenFieldsViewProps {
  fieldConfig: Record<string, FieldConfigItem>;
  visibleFields: string[];
  onShowField: (field: string) => void;
  onBack: () => void;
}

export function HiddenFieldsView({
  fieldConfig,
  visibleFields,
  onShowField,
  onBack,
}: HiddenFieldsViewProps) {
  return (
    <>
      <div className="flex items-center">
        <Button variant={"ghost"} size={"icon-sm"} onClick={onBack}>
          <ChevronLeft className="text-neutral-400" />
        </Button>

        <span className="text-neutral-900 text-semibold text-sm">
          Hidden Fields
        </span>
      </div>
      <Separator />
      <div className="py-1 px-0.5 flex flex-col gap-1">
        {Object.keys(fieldConfig)
          .filter((field) => !visibleFields.includes(field) && field !== "id")
          .map((field) => {
            const config = fieldConfig[field];
            const Icon = config?.icon;
            return (
              <div
                key={field}
                className="group flex items-center justify-between w-full hover:bg-neutral-100 rounded-md pr-1"
              >
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="justify-start text-neutral-500 text-sm font-light gap-3 flex-1 hover:bg-transparent"
                >
                  <Icon />
                  <span>{config?.label || field}</span>
                </Button>
                <Button
                  variant={"ghost"}
                  size={"icon-sm"}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowField(field);
                  }}
                >
                  <Eye />
                </Button>
              </div>
            );
          })}
      </div>
    </>
  );
}

import { Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FieldConfigItem } from "@/lib/field-config";

interface GroupByViewProps {
  groupBy: string;
  onGroupByChange: (value: string) => void;
  onBack: () => void;
  allowedGroupByFields: string[];
  fieldConfig: Record<string, FieldConfigItem>;
}

export function GroupByView({
  groupBy,
  onGroupByChange,
  onBack,
  allowedGroupByFields,
  fieldConfig,
}: GroupByViewProps) {
  return (
    <>
      <div className="flex items-center">
        <Button variant={"ghost"} size={"icon-sm"} onClick={onBack}>
          <ChevronLeft className="text-neutral-400" />
        </Button>
        <span className="text-neutral-900 font-semibold text-sm">Group by</span>
      </div>
      <Separator />
      <div className="py-1 px-0.5 flex flex-col gap-1">
        {allowedGroupByFields.map((field) => {
          const config = fieldConfig[field];
          return (
            <Button
              key={field}
              variant={"ghost"}
              className="justify-between w-full text-neutral-500"
              size={"sm"}
              onClick={() => {
                onGroupByChange(field);
                onBack();
              }}
            >
              <span className="text-sm pl-2">{config?.label || field}</span>
              {groupBy === field && <Check size={16} />}
            </Button>
          );
        })}
      </div>
    </>
  );
}

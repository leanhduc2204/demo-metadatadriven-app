import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, User as UserIcon } from "lucide-react";
import { fieldConfig } from "@/lib/field-config";

interface AddColumnHeaderProps {
  visibleFields: string[];
  setVisibleFields: (fields: string[]) => void;
}

export function AddColumnHeader({
  visibleFields,
  setVisibleFields,
}: AddColumnHeaderProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon-sm"}>
          <Plus />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          {Object.keys(fieldConfig)
            .filter((field) => !visibleFields.includes(field) && field !== "id")
            .map((field) => {
              const config = fieldConfig[field];
              const Icon = config?.icon || UserIcon;
              return (
                <DropdownMenuItem
                  key={field}
                  onClick={() => {
                    setVisibleFields([...visibleFields, field]);
                  }}
                >
                  <Icon />
                  <span>{config?.label || field}</span>
                </DropdownMenuItem>
              );
            })}
          {Object.keys(fieldConfig).filter(
            (field) => !visibleFields.includes(field) && field !== "id"
          ).length === 0 && (
            <DropdownMenuItem disabled>
              <span className="text-neutral-400">
                No hidden fields available
              </span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FILTER_OPERATOR_OPTIONS } from "@/lib/constants";
import { FilterOperator } from "@/types/common";
import { Check, ChevronDown, X } from "lucide-react";

interface FilterItemPopoverProps {
  label: string;
  onClose: () => void;
  onSelectOperator: (operator: FilterOperator) => void;
  selectedOperator: FilterOperator;
  filterValue: string;
  onFilterValueChange: (value: string) => void;
}

export function FilterItemPopover({
  label,
  onClose,
  onSelectOperator,
  selectedOperator,
  filterValue,
  onFilterValueChange,
}: FilterItemPopoverProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <Button variant={"ghost"} size={"icon-sm"} onClick={onClose}>
          <X className="text-neutral-400" />
        </Button>

        <span className="text-neutral-900 text-bold text-sm">{label}</span>
      </div>
      <Separator />
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size={"sm"}
              className="text-neutral-500 text-xs w-full justify-between"
            >
              {FILTER_OPERATOR_OPTIONS[selectedOperator]}
              <ChevronDown className="text-neutral-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {Object.values(FilterOperator).map((operator) => (
              <DropdownMenuItem
                key={operator}
                onClick={() => onSelectOperator(operator)}
                className="justify-between text-neutral-500"
              >
                <span>{FILTER_OPERATOR_OPTIONS[operator]}</span>
                {selectedOperator === operator && <Check />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      <div>
        <Input
          placeholder={label}
          value={filterValue}
          onChange={(e) => onFilterValueChange(e.target.value)}
          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-xs placeholder:text-neutral-400 text-xs"
        />
      </div>
    </div>
  );
}

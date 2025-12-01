import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronDown, ChevronLeft } from "lucide-react";
import { FilterOperator } from "@/types/common";
import { FILTER_OPERATOR_OPTIONS } from "@/lib/constants";

interface FilterItemProps {
  label: string;
  onBack: () => void;
  onSelectOperator: (operator: FilterOperator) => void;
  selectedOperator: FilterOperator;
  filterValue: string;
  onFilterValueChange: (value: string) => void;
}

export function FilterItem({
  label,
  onBack,
  onSelectOperator,
  selectedOperator,
  filterValue,
  onFilterValueChange,
}: FilterItemProps) {
  return (
    <>
      <div className="flex items-center">
        <Button variant={"ghost"} size={"icon-sm"} onClick={onBack}>
          <ChevronLeft className="text-neutral-400" />
        </Button>

        <span className="text-neutral-900 text-bold text-sm">{label}</span>
      </div>
      <Separator />
      {label !== "Search any field" && (
        <>
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
              <DropdownMenuContent align="end" className="w-80">
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
        </>
      )}
      {!(
        selectedOperator === FilterOperator.IS_EMPTY ||
        selectedOperator === FilterOperator.IS_NOT_EMPTY
      ) && (
        <div>
          <Input
            placeholder={label}
            value={filterValue}
            onChange={(e) => onFilterValueChange(e.target.value)}
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-xs placeholder:text-neutral-400 text-xs"
          />
        </div>
      )}
    </>
  );
}

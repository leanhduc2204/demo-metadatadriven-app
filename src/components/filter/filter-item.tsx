import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FILTER_OPERATOR_OPTIONS } from "@/lib/constants";
import { FieldType } from "@/lib/field-config";
import { getAvailableOperators } from "@/lib/filter-operators";
import { FilterOperator } from "@/types/common";
import { Check, ChevronDown, ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";

interface FilterItemProps {
  label: string;
  field?: string;
  fieldType?: FieldType;
  arrayFieldValues?: string[];
  onBack: () => void;
  onSelectOperator: (operator: FilterOperator) => void;
  selectedOperator: FilterOperator;
  filterValue: string;
  onFilterValueChange: (value: string) => void;
}

export function FilterItem({
  label,
  field,
  fieldType,
  arrayFieldValues = [],
  onBack,
  onSelectOperator,
  selectedOperator,
  filterValue,
  onFilterValueChange,
}: FilterItemProps) {
  const availableOperators = fieldType
    ? getAvailableOperators(fieldType, field)
    : Object.values(FilterOperator);

  const isArrayFieldWithIsOperator =
    fieldType === FieldType.ARRAY &&
    (selectedOperator === FilterOperator.IS ||
      selectedOperator === FilterOperator.IS_NOT);

  // Search state for filtering array field values
  const [searchTerm, setSearchTerm] = useState("");

  // Parse selected values from filterValue (comma-separated string)
  const selectedValues = useMemo(() => {
    if (!filterValue) return [];
    return filterValue
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }, [filterValue]);

  // Filter array field values based on search term
  const filteredArrayFieldValues = useMemo(() => {
    if (!searchTerm.trim()) return arrayFieldValues;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return arrayFieldValues.filter((value) =>
      value.toLowerCase().includes(lowerSearchTerm)
    );
  }, [arrayFieldValues, searchTerm]);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const currentValues = selectedValues;
    let newValues: string[];
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((v) => v !== value);
    }
    onFilterValueChange(newValues.join(","));
  };

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
                {availableOperators.map((operator) => (
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
      ) &&
        (isArrayFieldWithIsOperator ? (
          <>
            <div>
              <Input
                placeholder={label}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-xs placeholder:text-neutral-400 text-xs"
              />
            </div>
            <Separator />
            <div className="max-h-60 overflow-y-auto px-2 py-2">
              {filteredArrayFieldValues.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {filteredArrayFieldValues.map((value) => (
                    <div
                      key={value}
                      className="flex items-center gap-2 py-1 hover:bg-neutral-50 rounded px-1 cursor-pointer"
                      onClick={() =>
                        handleCheckboxChange(
                          value,
                          !selectedValues.includes(value)
                        )
                      }
                    >
                      <Checkbox
                        checked={selectedValues.includes(value)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(value, checked as boolean)
                        }
                      />
                      <span className="text-xs text-neutral-700">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-neutral-400 py-2">
                  {arrayFieldValues.length > 0
                    ? "No results found"
                    : "No options available"}
                </div>
              )}
            </div>
          </>
        ) : (
          <div>
            <Input
              placeholder={label}
              value={filterValue}
              onChange={(e) => onFilterValueChange(e.target.value)}
              className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-xs placeholder:text-neutral-400 text-xs"
            />
          </div>
        ))}
    </>
  );
}

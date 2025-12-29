import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RELATIVE_DATE_TYPE_OPTIONS } from "@/lib/constants";
import {
  FilterOperator,
  RelativeDateType,
  RelativeDateUnit,
} from "@/types/common";
import { CalendarX2, Check, ChevronDown } from "lucide-react";
import { isSameDay } from "date-fns";
import {
  getUnitLabel,
  formatRelativeDateString,
} from "@/lib/filter-item-utils";

interface FilterValueInputProps {
  label: string;
  selectedOperator: FilterOperator;
  filterValue: string;
  onFilterValueChange: (value: string) => void;
  logic: ReturnType<
    typeof import("@/hooks/use-filter-item-logic").useFilterItemLogic
  >;
}

export function FilterValueInput({
  label,
  selectedOperator,
  filterValue,
  onFilterValueChange,
  logic,
}: FilterValueInputProps) {
  const {
    isArrayFieldWithIsOperator,
    isDateFieldWithDateOperator,
    isRelativeDateOperator,
    searchTerm,
    setSearchTerm,
    relativeDateType,
    setRelativeDateType,
    relativeDateUnit,
    setRelativeDateUnit,
    relativeDateValue,
    setRelativeDateValue,
    inputRef,
    date,
    timeInputValue,
    calendarMonth,
    setMonth,
    highlightedDates,
    selectedValues,
    filteredArrayFieldValues,
    handleCheckboxChange,
    handleDateSelect,
    handleTimeInputChange,
    handleClearDate,
  } = logic;

  // Don't render input for operators that don't need values
  if (
    selectedOperator === FilterOperator.IS_EMPTY ||
    selectedOperator === FilterOperator.IS_NOT_EMPTY ||
    selectedOperator === FilterOperator.IS_IN_PAST ||
    selectedOperator === FilterOperator.IS_IN_FUTURE ||
    selectedOperator === FilterOperator.IS_TODAY
  ) {
    return null;
  }

  if (isArrayFieldWithIsOperator) {
    return (
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
                    handleCheckboxChange(value, !selectedValues.includes(value))
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
              {filteredArrayFieldValues.length > 0
                ? "No results found"
                : "No options available"}
            </div>
          )}
        </div>
      </>
    );
  }

  if (isDateFieldWithDateOperator) {
    return (
      <>
        <div>
          <Input
            ref={inputRef}
            placeholder="dd/mm/yyyy HH:mm"
            value={timeInputValue}
            onChange={handleTimeInputChange}
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-xs placeholder:text-neutral-400 text-xs"
          />
        </div>
        <Separator />
        <div className="p-1">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            captionLayout="dropdown"
            month={calendarMonth}
            onMonthChange={setMonth}
            className="[--cell-size:--spacing(9)] md:[--cell-size:--spacing(10)]"
          />
        </div>
        <Separator />
        <Button
          variant={"ghost"}
          size={"sm"}
          className="w-full justify-start"
          onClick={handleClearDate}
        >
          <CalendarX2 /> Clear
        </Button>
      </>
    );
  }

  if (isRelativeDateOperator) {
    return (
      <>
        <div className="w-full flex items-center justify-between gap-2 p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size={"sm"}
                className="h-9 flex-2  text-neutral-500 text-xs justify-between rounded-sm"
              >
                {RELATIVE_DATE_TYPE_OPTIONS[relativeDateType]}
                <ChevronDown className="text-neutral-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              {Object.values(RelativeDateType).map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => setRelativeDateType(type)}
                  className="justify-between text-neutral-500 text-xs"
                >
                  <span>{RELATIVE_DATE_TYPE_OPTIONS[type]}</span>
                  {relativeDateType === type && <Check />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            type="number"
            min="1"
            placeholder="Number"
            value={
              relativeDateType === RelativeDateType.THIS
                ? "-"
                : relativeDateValue
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") {
                setRelativeDateValue("");
                return;
              }
              const numValue = parseInt(value, 10);
              if (!isNaN(numValue) && numValue >= 1) {
                setRelativeDateValue(value);
              }
            }}
            onKeyDown={(e) => {
              if (
                e.key === "-" ||
                e.key === "+" ||
                e.key === "e" ||
                e.key === "E" ||
                e.key === "."
              ) {
                e.preventDefault();
                return;
              }
              const input = e.currentTarget;
              const selectionStart = input.selectionStart || 0;
              const selectionEnd = input.selectionEnd || 0;
              const currentValue = input.value;

              if (
                e.key === "0" &&
                (currentValue === "" ||
                  (selectionStart === 0 &&
                    selectionEnd === currentValue.length))
              ) {
                e.preventDefault();
                return;
              }
            }}
            disabled={relativeDateType === RelativeDateType.THIS}
            className="flex-1 text-xs"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size={"sm"}
                className="h-9 flex-2 text-neutral-500 text-xs justify-between rounded-sm"
              >
                {getUnitLabel(relativeDateUnit, relativeDateValue)}
                <ChevronDown className="text-neutral-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              {Object.values(RelativeDateUnit).map((unit) => (
                <DropdownMenuItem
                  key={unit}
                  onClick={() => setRelativeDateUnit(unit)}
                  className="justify-between text-neutral-500 text-xs"
                >
                  <span>{getUnitLabel(unit, relativeDateValue)}</span>
                  {relativeDateUnit === unit && <Check />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="p-1">
          <Calendar
            mode="single"
            components={{
              PreviousMonthButton: () => <></>,
              NextMonthButton: () => <></>,
              DayButton: ({ day, className, ...props }) => {
                const isHighlighted = highlightedDates.some((d) =>
                  isSameDay(d, day.date)
                );
                return (
                  <Button
                    {...props}
                    variant="ghost"
                    size="icon"
                    className={`${
                      isHighlighted
                        ? "bg-blue-500 text-white flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1"
                        : ""
                    } ${className || ""}`}
                  >
                    {day.date.getDate()}
                  </Button>
                );
              },
            }}
            className="w-full [--cell-size:--spacing(9)] md:[--cell-size:--spacing(10)]"
            disabled
          />
        </div>
        <Separator />
        <Button
          variant={"ghost"}
          size={"sm"}
          className="w-full justify-start"
          onClick={() => {
            const defaultType = RelativeDateType.THIS;
            const defaultUnit = RelativeDateUnit.DAY;
            const defaultValue = "1";
            setRelativeDateType(defaultType);
            setRelativeDateUnit(defaultUnit);
            setRelativeDateValue(defaultValue);
            // Immediately update filterValue
            const formatted = formatRelativeDateString(
              defaultType,
              defaultUnit,
              defaultValue
            );
            onFilterValueChange(formatted);
          }}
        >
          <CalendarX2 /> Clear
        </Button>
      </>
    );
  }

  // Default text input
  return (
    <div>
      <Input
        placeholder={label}
        value={filterValue}
        onChange={(e) => onFilterValueChange(e.target.value)}
        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-xs placeholder:text-neutral-400 text-xs"
      />
    </div>
  );
}

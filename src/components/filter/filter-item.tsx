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
import {
  FILTER_OPERATOR_OPTIONS,
  RELATIVE_DATE_TYPE_OPTIONS,
  RELATIVE_DATE_UNIT_OPTIONS,
} from "@/lib/constants";
import { FieldType } from "@/lib/field-config";
import { getAvailableOperators } from "@/lib/filter-operators";
import {
  FilterOperator,
  RelativeDateType,
  RelativeDateUnit,
} from "@/types/common";
import {
  format,
  isValid,
  parse,
  startOfDay,
  subDays,
  addDays,
  subMonths,
  addMonths,
  subYears,
  addYears,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { CalendarX2, Check, ChevronDown, ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

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

  const isDateFieldWithDateOperator =
    fieldType === FieldType.DATE &&
    (selectedOperator === FilterOperator.IS ||
      selectedOperator === FilterOperator.IS_BEFORE ||
      selectedOperator === FilterOperator.IS_AFTER);

  const isRelativeDateOperator =
    fieldType === FieldType.DATE &&
    selectedOperator === FilterOperator.IS_RELATIVE;

  // Search state for filtering array field values
  const [searchTerm, setSearchTerm] = useState("");
  const [relativeDateType, setRelativeDateType] = useState<RelativeDateType>(
    RelativeDateType.THIS
  );
  const [relativeDateUnit, setRelativeDateUnit] = useState<RelativeDateUnit>(
    RelativeDateUnit.DAY
  );
  const [relativeDateValue, setRelativeDateValue] = useState<string>("1");

  // Helper function to get unit label with plural/singular form
  const getUnitLabel = (unit: RelativeDateUnit, value: string): string => {
    const baseLabel = RELATIVE_DATE_UNIT_OPTIONS[unit];
    const numValue = parseInt(value) || 1;

    if (numValue > 1) {
      // Return plural form
      return `${baseLabel}s`;
    }
    return baseLabel;
  };

  // Date picker state - month for calendar navigation
  const [month, setMonth] = useState<Date>(new Date());

  // Ref for input to control cursor position
  const inputRef = useRef<HTMLInputElement>(null);

  // Derive date from filterValue using useMemo instead of useEffect
  const date = useMemo(() => {
    if (isDateFieldWithDateOperator && filterValue) {
      try {
        // Try to parse dd/mm/yyyy HH:mm format
        const parsed = parse(filterValue, "dd/MM/yyyy HH:mm", new Date());
        if (isValid(parsed)) {
          return parsed;
        }
        // Try to parse dd/mm/yyyy format
        const parsedDate = parse(filterValue, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
          return parsedDate;
        }
      } catch {
        // Invalid format
      }
    }
    return undefined;
  }, [filterValue, isDateFieldWithDateOperator]);

  // Set default value to current time when filterValue is empty and field is date
  useEffect(() => {
    if (isDateFieldWithDateOperator && !filterValue) {
      const now = new Date();
      const defaultValue = format(now, "dd/MM/yyyy HH:mm");
      onFilterValueChange(defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDateFieldWithDateOperator, filterValue]);

  // Format input with mask: __/__/____ __:__
  const formatWithMask = (digits: string): string => {
    const mask = "__/__/____ __:__";
    let formatted = "";
    let digitIndex = 0;

    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === "_") {
        if (digitIndex < digits.length) {
          formatted += digits[digitIndex];
          digitIndex++;
        } else {
          formatted += "_";
        }
      } else {
        formatted += mask[i];
      }
    }

    return formatted;
  };

  // Parse masked value to actual date string for validation
  const parseMaskedValue = (maskedValue: string): string | null => {
    const digits = maskedValue.replace(/\D/g, "");
    if (digits.length === 0) return null;

    // Need at least 8 digits for dd/MM/yyyy
    if (digits.length < 8) return null;

    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);
    let timePart = "";

    if (digits.length >= 12) {
      const hour = digits.slice(8, 10);
      const minute = digits.slice(10, 12);
      timePart = ` ${hour}:${minute}`;
    }

    return `${day}/${month}/${year}${timePart}`;
  };

  // Derive timeInput display value from filterValue with mask
  const timeInputValue = useMemo(() => {
    if (!isDateFieldWithDateOperator) return "";

    if (filterValue) {
      // If filterValue contains _, it's already in mask format
      if (filterValue.includes("_")) {
        return filterValue;
      }

      try {
        // Try to parse as dd/MM/yyyy HH:mm
        const parsed = parse(filterValue, "dd/MM/yyyy HH:mm", new Date());
        if (isValid(parsed)) {
          return format(parsed, "dd/MM/yyyy HH:mm");
        }
        // Try to parse as dd/MM/yyyy
        const parsedDate = parse(filterValue, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
          return format(parsedDate, "dd/MM/yyyy HH:mm");
        }
      } catch {
        // Invalid format, extract digits and format with mask
        const digits = filterValue.replace(/\D/g, "");
        if (digits.length > 0) {
          return formatWithMask(digits);
        }
      }
    }

    // If no filterValue, show mask
    return "__/__/____ __:__";
  }, [filterValue, isDateFieldWithDateOperator]);

  // Derive month from date for calendar display
  const calendarMonth = useMemo(() => {
    return date || month;
  }, [date, month]);

  // Calculate highlighted dates for relative date operator
  const highlightedDates = useMemo(() => {
    if (!isRelativeDateOperator) return [];

    const today = startOfDay(new Date());
    const value = parseInt(relativeDateValue) || 1;

    let startDate: Date;
    let endDate: Date;

    if (relativeDateType === RelativeDateType.THIS) {
      // THIS: current period
      switch (relativeDateUnit) {
        case RelativeDateUnit.DAY:
          startDate = today;
          endDate = today;
          break;
        case RelativeDateUnit.WEEK:
          startDate = startOfWeek(today);
          endDate = endOfWeek(today);
          break;
        case RelativeDateUnit.MONTH:
          startDate = startOfMonth(today);
          endDate = endOfMonth(today);
          break;
        case RelativeDateUnit.YEAR:
          startDate = startOfYear(today);
          endDate = endOfYear(today);
          break;
        default:
          return [];
      }
    } else if (relativeDateType === RelativeDateType.PAST) {
      // PAST: from today going back N units (inclusive of today)
      // Example: value=1, unit=day -> today and yesterday (2 days)
      // Example: value=1, unit=week -> from today back 1 week (7 days including today)
      switch (relativeDateUnit) {
        case RelativeDateUnit.DAY:
          endDate = today;
          startDate = subDays(today, value); // value=1 -> today - 1 day = yesterday
          break;
        case RelativeDateUnit.WEEK:
          endDate = today;
          startDate = subDays(today, value * 7 - 1); // value=1 -> today - 6 days = 7 days total
          break;
        case RelativeDateUnit.MONTH:
          endDate = today;
          startDate = subMonths(today, value);
          // Adjust to start of the month range
          startDate = startOfMonth(startDate);
          break;
        case RelativeDateUnit.YEAR:
          endDate = today;
          startDate = subYears(today, value);
          // Adjust to start of the year range
          startDate = startOfYear(startDate);
          break;
        default:
          return [];
      }
    } else {
      // NEXT: from today going forward N units (inclusive of today)
      // Example: value=1, unit=day -> today and tomorrow (2 days)
      // Example: value=1, unit=week -> from today forward 1 week (7 days including today)
      switch (relativeDateUnit) {
        case RelativeDateUnit.DAY:
          startDate = today;
          endDate = addDays(today, value); // value=1 -> today + 1 day = tomorrow
          break;
        case RelativeDateUnit.WEEK:
          startDate = today;
          endDate = addDays(today, value * 7 - 1); // value=1 -> today + 6 days = 7 days total
          break;
        case RelativeDateUnit.MONTH:
          startDate = today;
          endDate = addMonths(today, value);
          // Adjust to end of the month range
          endDate = endOfMonth(endDate);
          break;
        case RelativeDateUnit.YEAR:
          startDate = today;
          endDate = addYears(today, value);
          // Adjust to end of the year range
          endDate = endOfYear(endDate);
          break;
        default:
          return [];
      }
    }

    // Generate all dates in the range
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [
    isRelativeDateOperator,
    relativeDateType,
    relativeDateUnit,
    relativeDateValue,
  ]);

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

  // Handle date selection from calendar
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setMonth(selectedDate);
      // Preserve time from current input, or use current time if no time exists
      let timeStr = format(new Date(), "HH:mm");
      if (timeInputValue) {
        const timeMatch = timeInputValue.match(/(\d{2}:\d{2})$/);
        if (timeMatch) {
          timeStr = timeMatch[1];
        }
      }
      const formatted = format(selectedDate, `dd/MM/yyyy ${timeStr}`);
      onFilterValueChange(formatted);
    }
  };

  // Validate date/time parts
  const validateDateParts = (digits: string): string => {
    if (digits.length === 0) return digits;

    let validated = "";

    // Day (first 2 digits) - max 31
    if (digits.length >= 1) {
      const day1 = parseInt(digits[0]);
      if (day1 > 3) {
        // First digit of day can't be > 3, don't add it
        return validated;
      }
      validated += digits[0];
    }
    if (digits.length >= 2) {
      const day = parseInt(digits.slice(0, 2));
      if (day > 31) {
        // Day can't be > 31, cap at 31
        validated = "31";
      } else {
        validated = digits.slice(0, 2);
      }
    }

    // Month (next 2 digits) - max 12
    if (digits.length >= 3) {
      const month1 = parseInt(digits[2]);
      if (month1 > 1) {
        // First digit of month can't be > 1, don't add it
        return validated;
      }
      validated += digits[2];
    }
    if (digits.length >= 4) {
      const month = parseInt(digits.slice(2, 4));
      if (month > 12 || month === 0) {
        // Month can't be > 12 or 0, cap at 12
        validated = validated.slice(0, 2) + "12";
      } else {
        validated = digits.slice(0, 4);
      }
    }

    // Year (next 4 digits) - no validation needed, just take first 4
    if (digits.length >= 5) {
      validated = digits.slice(0, Math.min(8, digits.length));
    }

    // Hour (next 2 digits) - max 23
    if (digits.length >= 9) {
      const hour1 = parseInt(digits[8]);
      if (hour1 > 2) {
        // First digit of hour can't be > 2, don't add it
        return validated;
      }
      validated += digits[8];
    }
    if (digits.length >= 10) {
      const hour = parseInt(digits.slice(8, 10));
      if (hour > 23) {
        // Hour can't be > 23, cap at 23
        validated = validated.slice(0, 8) + "23";
      } else {
        validated = digits.slice(0, 10);
      }
    }

    // Minute (next 2 digits) - max 59
    if (digits.length >= 11) {
      const minute1 = parseInt(digits[10]);
      if (minute1 > 5) {
        // First digit of minute can't be > 5, don't add it
        return validated;
      }
      validated += digits[10];
    }
    if (digits.length >= 12) {
      const minute = parseInt(digits.slice(10, 12));
      if (minute > 59) {
        // Minute can't be > 59, cap at 59
        validated = validated.slice(0, 10) + "59";
      } else {
        validated = digits.slice(0, 12);
      }
    }

    return validated;
  };

  // Calculate new cursor position after formatting
  const calculateNewCursorPosition = (
    oldValue: string,
    newValue: string,
    oldCursorPos: number,
    isDeleting: boolean
  ): number => {
    if (isDeleting) {
      // When deleting, keep cursor at same relative position (logic already correct)
      let digitsBeforeCursor = 0;
      for (let i = 0; i < oldCursorPos && i < oldValue.length; i++) {
        if (/\d/.test(oldValue[i])) {
          digitsBeforeCursor++;
        }
      }

      // Find position in new value where we have the same number of digits
      let newPos = 0;
      let digitsCount = 0;
      for (let i = 0; i < newValue.length; i++) {
        if (/\d/.test(newValue[i])) {
          digitsCount++;
          if (digitsCount === digitsBeforeCursor) {
            newPos = i + 1;
            break;
          }
        } else if (digitsCount < digitsBeforeCursor) {
          newPos = i + 1;
        }
      }

      return newPos;
    } else {
      // When typing, move cursor to next position after the newly typed digit
      // Count digits before cursor in old value
      let digitsBeforeCursor = 0;
      for (let i = 0; i < oldCursorPos && i < oldValue.length; i++) {
        if (/\d/.test(oldValue[i])) {
          digitsBeforeCursor++;
        }
      }

      // Target is one more digit than before (the newly typed digit)
      const targetDigits = digitsBeforeCursor + 1;

      // Find position in new value where we have the target number of digits
      let newPos = 0;
      let digitsCount = 0;
      for (let i = 0; i < newValue.length; i++) {
        if (/\d/.test(newValue[i])) {
          digitsCount++;
          if (digitsCount === targetDigits) {
            // Found the target digit, position cursor after it
            newPos = i + 1;
            // If next char is separator, skip it
            if (
              i + 1 < newValue.length &&
              !/\d/.test(newValue[i + 1]) &&
              newValue[i + 1] !== "_"
            ) {
              newPos = i + 2;
            }
            break;
          }
        } else if (digitsCount < targetDigits) {
          // Haven't reached target yet, keep moving forward
          newPos = i + 1;
        }
      }

      // If we didn't find the exact position, find next _ position
      if (digitsCount < targetDigits) {
        for (let i = 0; i < newValue.length; i++) {
          if (newValue[i] === "_") {
            newPos = i;
            break;
          }
        }
        // If no _ found, put at end
        if (newPos === 0 && digitsCount > 0) {
          newPos = newValue.length;
        }
      }

      return Math.min(newPos, newValue.length);
    }
  };

  // Handle time input change with mask support
  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    const oldValue = timeInputValue;

    // Extract only digits from input
    let digits = value.replace(/\D/g, "");

    // Validate date/time parts
    digits = validateDateParts(digits);

    // Determine if user is deleting (value is shorter or same length but cursor moved back)
    const oldDigits = oldValue.replace(/\D/g, "");
    const isDeleting =
      digits.length < oldDigits.length ||
      (digits.length === oldDigits.length && value.length <= oldValue.length);

    // Format with mask (will show _ for missing digits)
    const processedValue = formatWithMask(digits);

    // Update filterValue with masked value
    onFilterValueChange(processedValue);

    // Calculate and set new cursor position
    setTimeout(() => {
      if (inputRef.current) {
        const newCursorPos = calculateNewCursorPosition(
          oldValue,
          processedValue,
          cursorPosition,
          isDeleting
        );
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);

    // Try to parse the input and update calendar if valid
    try {
      const parsedValue = parseMaskedValue(processedValue);
      if (parsedValue) {
        // Try dd/mm/yyyy HH:mm format
        const parsed = parse(parsedValue, "dd/MM/yyyy HH:mm", new Date());
        if (isValid(parsed)) {
          setMonth(parsed);
        } else {
          // Try dd/mm/yyyy format (without time)
          const dateOnly = parsedValue.split(" ")[0];
          if (dateOnly) {
            const parsedDate = parse(dateOnly, "dd/MM/yyyy", new Date());
            if (isValid(parsedDate)) {
              setMonth(parsedDate);
            }
          }
        }
      }
    } catch {
      // Invalid format, calendar will not update but input still works
    }
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
        selectedOperator === FilterOperator.IS_NOT_EMPTY ||
        selectedOperator === FilterOperator.IS_IN_PAST ||
        selectedOperator === FilterOperator.IS_IN_FUTURE ||
        selectedOperator === FilterOperator.IS_TODAY
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
        ) : isDateFieldWithDateOperator ? (
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
          </>
        ) : isRelativeDateOperator ? (
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
                  // Allow empty string for deletion
                  if (value === "") {
                    setRelativeDateValue("");
                    return;
                  }
                  // Parse as number
                  const numValue = parseInt(value, 10);
                  // Only allow positive integers >= 1
                  if (!isNaN(numValue) && numValue >= 1) {
                    setRelativeDateValue(value);
                  }
                  // Ignore 0, negative numbers, and non-numeric input
                }}
                onKeyDown={(e) => {
                  // Prevent typing negative sign, plus sign, scientific notation, or decimal point
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
                  // Prevent typing 0 as the first character (but allow in numbers like 10, 20, etc.)
                  const input = e.currentTarget;
                  const selectionStart = input.selectionStart || 0;
                  const selectionEnd = input.selectionEnd || 0;
                  const currentValue = input.value;

                  // If typing 0 and it would be the first character (or replacing all text)
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
                setRelativeDateType(RelativeDateType.THIS);
                setRelativeDateUnit(RelativeDateUnit.DAY);
                setRelativeDateValue("1");
              }}
            >
              <CalendarX2 /> Clear
            </Button>
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

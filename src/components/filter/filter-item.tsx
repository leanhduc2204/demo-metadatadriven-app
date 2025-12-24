/* eslint-disable react-hooks/exhaustive-deps */
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
      return `${baseLabel}s`;
    }
    return baseLabel;
  };

  // Format relative date to string: "This day", "Past 1 day", "Past 2 days", "Next 1 week", etc.
  const formatRelativeDateString = (
    type: RelativeDateType,
    unit: RelativeDateUnit,
    value: string
  ): string => {
    const typeLabel = RELATIVE_DATE_TYPE_OPTIONS[type];
    const unitLabel = getUnitLabel(unit, value);

    if (type === RelativeDateType.THIS) {
      return `${typeLabel} ${unitLabel.toLowerCase()}`;
    }

    const numValue = parseInt(value) || 1;
    return `${typeLabel} ${numValue} ${unitLabel.toLowerCase()}`;
  };

  // Parse relative date string: "This day", "Past 1 day", "Next 2 weeks", etc.
  const parseRelativeDateString = (
    value: string
  ): {
    type: RelativeDateType;
    unit: RelativeDateUnit;
    value: string;
  } | null => {
    if (!value || !value.trim()) return null;

    const lowerValue = value.toLowerCase().trim();

    // Check for "This" type
    if (lowerValue.startsWith("this")) {
      const unitStr = lowerValue.replace("this", "").trim();
      for (const [unit, label] of Object.entries(RELATIVE_DATE_UNIT_OPTIONS)) {
        if (
          unitStr === label.toLowerCase() ||
          unitStr === `${label.toLowerCase()}s`
        ) {
          return {
            type: RelativeDateType.THIS,
            unit: unit as RelativeDateUnit,
            value: "1",
          };
        }
      }
    }

    // Check for "Past" or "Next" type
    const pastMatch = lowerValue.match(
      /^past\s+(\d+)\s+(day|week|month|year)s?$/
    );
    const nextMatch = lowerValue.match(
      /^next\s+(\d+)\s+(day|week|month|year)s?$/
    );

    if (pastMatch) {
      const [, numStr, unitStr] = pastMatch;
      const unitMap: Record<string, RelativeDateUnit> = {
        day: RelativeDateUnit.DAY,
        week: RelativeDateUnit.WEEK,
        month: RelativeDateUnit.MONTH,
        year: RelativeDateUnit.YEAR,
      };
      const unit = unitMap[unitStr];
      if (unit) {
        return {
          type: RelativeDateType.PAST,
          unit,
          value: numStr,
        };
      }
    }

    if (nextMatch) {
      const [, numStr, unitStr] = nextMatch;
      const unitMap: Record<string, RelativeDateUnit> = {
        day: RelativeDateUnit.DAY,
        week: RelativeDateUnit.WEEK,
        month: RelativeDateUnit.MONTH,
        year: RelativeDateUnit.YEAR,
      };
      const unit = unitMap[unitStr];
      if (unit) {
        return {
          type: RelativeDateType.NEXT,
          unit,
          value: numStr,
        };
      }
    }

    return null;
  };

  // Date picker state - month for calendar navigation
  const [month, setMonth] = useState<Date>(new Date());

  // Ref for input to control cursor position
  const inputRef = useRef<HTMLInputElement>(null);

  // Ref to track if filterValue update is from internal state change
  const isInternalUpdateRef = useRef(false);

  // Derive date from filterValue using useMemo instead of useEffect
  const date = useMemo(() => {
    if (isDateFieldWithDateOperator && filterValue) {
      try {
        const parsed = parse(filterValue, "dd/MM/yyyy HH:mm", new Date());
        if (isValid(parsed)) {
          return parsed;
        }
        const parsedDate = parse(filterValue, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
          return parsedDate;
        }
      } catch {}
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
  }, [isDateFieldWithDateOperator, filterValue]);

  // Parse filterValue to relative date states when component mounts or filterValue changes from outside
  useEffect(() => {
    if (isRelativeDateOperator) {
      // Skip parsing if the update is from internal state change
      if (isInternalUpdateRef.current) {
        isInternalUpdateRef.current = false;
        return;
      }

      if (filterValue) {
        const parsed = parseRelativeDateString(filterValue);
        if (parsed) {
          // Check if parsed values are different from current state to avoid unnecessary updates
          if (
            parsed.type !== relativeDateType ||
            parsed.unit !== relativeDateUnit ||
            parsed.value !== relativeDateValue
          ) {
            setRelativeDateType(parsed.type);
            setRelativeDateUnit(parsed.unit);
            setRelativeDateValue(parsed.value);
          }
        }
      } else {
        // Set default values when filterValue is empty
        const defaultType = RelativeDateType.THIS;
        const defaultUnit = RelativeDateUnit.DAY;
        const defaultValue = "1";
        if (
          relativeDateType !== defaultType ||
          relativeDateUnit !== defaultUnit ||
          relativeDateValue !== defaultValue
        ) {
          setRelativeDateType(defaultType);
          setRelativeDateUnit(defaultUnit);
          setRelativeDateValue(defaultValue);
        }
      }
    }
  }, [isRelativeDateOperator, filterValue]);

  // Save relative date to filterValue when states change
  useEffect(() => {
    if (isRelativeDateOperator) {
      const formatted = formatRelativeDateString(
        relativeDateType,
        relativeDateUnit,
        relativeDateValue
      );
      // Only update if the formatted value is different from current filterValue
      if (formatted !== filterValue) {
        isInternalUpdateRef.current = true;
        onFilterValueChange(formatted);
      }
    }
  }, [
    isRelativeDateOperator,
    relativeDateType,
    relativeDateUnit,
    relativeDateValue,
  ]);

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
      if (filterValue.includes("_")) {
        return filterValue;
      }

      try {
        const parsed = parse(filterValue, "dd/MM/yyyy HH:mm", new Date());
        if (isValid(parsed)) {
          return format(parsed, "dd/MM/yyyy HH:mm");
        }
        const parsedDate = parse(filterValue, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
          return format(parsedDate, "dd/MM/yyyy HH:mm");
        }
      } catch {
        const digits = filterValue.replace(/\D/g, "");
        if (digits.length > 0) {
          return formatWithMask(digits);
        }
      }
    }

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
      switch (relativeDateUnit) {
        case RelativeDateUnit.DAY:
          endDate = today;
          startDate = subDays(today, value);
          break;
        case RelativeDateUnit.WEEK:
          endDate = today;
          startDate = subDays(today, value * 7 - 1);
          break;
        case RelativeDateUnit.MONTH:
          endDate = today;
          startDate = subMonths(today, value);
          startDate = startOfMonth(startDate);
          break;
        case RelativeDateUnit.YEAR:
          endDate = today;
          startDate = subYears(today, value);
          startDate = startOfYear(startDate);
          break;
        default:
          return [];
      }
    } else {
      switch (relativeDateUnit) {
        case RelativeDateUnit.DAY:
          startDate = today;
          endDate = addDays(today, value);
          break;
        case RelativeDateUnit.WEEK:
          startDate = today;
          endDate = addDays(today, value * 7 - 1);
          break;
        case RelativeDateUnit.MONTH:
          startDate = today;
          endDate = addMonths(today, value);
          endDate = endOfMonth(endDate);
          break;
        case RelativeDateUnit.YEAR:
          startDate = today;
          endDate = addYears(today, value);
          endDate = endOfYear(endDate);
          break;
        default:
          return [];
      }
    }

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

    if (digits.length >= 1) {
      const day1 = parseInt(digits[0]);
      if (day1 > 3) {
        return validated;
      }
      validated += digits[0];
    }
    if (digits.length >= 2) {
      const day = parseInt(digits.slice(0, 2));
      if (day > 31) {
        validated = "31";
      } else {
        validated = digits.slice(0, 2);
      }
    }

    if (digits.length >= 3) {
      const month1 = parseInt(digits[2]);
      if (month1 > 1) {
        return validated;
      }
      validated += digits[2];
    }
    if (digits.length >= 4) {
      const month = parseInt(digits.slice(2, 4));
      if (month > 12 || month === 0) {
        validated = validated.slice(0, 2) + "12";
      } else {
        validated = digits.slice(0, 4);
      }
    }

    if (digits.length >= 5) {
      validated = digits.slice(0, Math.min(8, digits.length));
    }

    if (digits.length >= 9) {
      const hour1 = parseInt(digits[8]);
      if (hour1 > 2) {
        return validated;
      }
      validated += digits[8];
    }
    if (digits.length >= 10) {
      const hour = parseInt(digits.slice(8, 10));
      if (hour > 23) {
        validated = validated.slice(0, 8) + "23";
      } else {
        validated = digits.slice(0, 10);
      }
    }

    if (digits.length >= 11) {
      const minute1 = parseInt(digits[10]);
      if (minute1 > 5) {
        return validated;
      }
      validated += digits[10];
    }
    if (digits.length >= 12) {
      const minute = parseInt(digits.slice(10, 12));
      if (minute > 59) {
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
      let digitsBeforeCursor = 0;
      for (let i = 0; i < oldCursorPos && i < oldValue.length; i++) {
        if (/\d/.test(oldValue[i])) {
          digitsBeforeCursor++;
        }
      }

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
      let digitsBeforeCursor = 0;
      for (let i = 0; i < oldCursorPos && i < oldValue.length; i++) {
        if (/\d/.test(oldValue[i])) {
          digitsBeforeCursor++;
        }
      }

      const targetDigits = digitsBeforeCursor + 1;

      let newPos = 0;
      let digitsCount = 0;
      for (let i = 0; i < newValue.length; i++) {
        if (/\d/.test(newValue[i])) {
          digitsCount++;
          if (digitsCount === targetDigits) {
            newPos = i + 1;
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
          newPos = i + 1;
        }
      }

      if (digitsCount < targetDigits) {
        for (let i = 0; i < newValue.length; i++) {
          if (newValue[i] === "_") {
            newPos = i;
            break;
          }
        }
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

    let digits = value.replace(/\D/g, "");

    digits = validateDateParts(digits);

    const oldDigits = oldValue.replace(/\D/g, "");
    const isDeleting =
      digits.length < oldDigits.length ||
      (digits.length === oldDigits.length && value.length <= oldValue.length);

    const processedValue = formatWithMask(digits);

    onFilterValueChange(processedValue);

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

    try {
      const parsedValue = parseMaskedValue(processedValue);
      if (parsedValue) {
        const parsed = parse(parsedValue, "dd/MM/yyyy HH:mm", new Date());
        if (isValid(parsed)) {
          setMonth(parsed);
        } else {
          const dateOnly = parsedValue.split(" ")[0];
          if (dateOnly) {
            const parsedDate = parse(dateOnly, "dd/MM/yyyy", new Date());
            if (isValid(parsedDate)) {
              setMonth(parsedDate);
            }
          }
        }
      }
    } catch {}
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

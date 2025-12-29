/* eslint-disable react-hooks/exhaustive-deps */
import { FieldType } from "@/lib/field-config";
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
} from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  formatRelativeDateString,
  formatWithMask,
  parseMaskedValue,
  parseRelativeDateString,
  validateDateParts,
  calculateNewCursorPosition,
} from "@/lib/filter-item-utils";

interface UseFilterItemLogicProps {
  fieldType?: FieldType;
  selectedOperator: FilterOperator;
  filterValue: string;
  arrayFieldValues: string[];
  onFilterValueChange: (value: string) => void;
}

export function useFilterItemLogic({
  fieldType,
  selectedOperator,
  filterValue,
  arrayFieldValues,
  onFilterValueChange,
}: UseFilterItemLogicProps) {
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

  const handleClearDate = () => {
    const now = new Date();
    const defaultValue = format(now, "dd/MM/yyyy HH:mm");
    onFilterValueChange(defaultValue);
  };

  return {
    // Flags
    isArrayFieldWithIsOperator,
    isDateFieldWithDateOperator,
    isRelativeDateOperator,
    // State
    searchTerm,
    setSearchTerm,
    relativeDateType,
    setRelativeDateType,
    relativeDateUnit,
    setRelativeDateUnit,
    relativeDateValue,
    setRelativeDateValue,
    month,
    setMonth,
    // Refs
    inputRef,
    // Computed values
    date,
    timeInputValue,
    calendarMonth,
    highlightedDates,
    selectedValues,
    filteredArrayFieldValues,
    // Handlers
    handleCheckboxChange,
    handleDateSelect,
    handleTimeInputChange,
    handleClearDate,
  };
}

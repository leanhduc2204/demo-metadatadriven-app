import {
  RELATIVE_DATE_TYPE_OPTIONS,
  RELATIVE_DATE_UNIT_OPTIONS,
} from "@/lib/constants";
import { RelativeDateType, RelativeDateUnit } from "@/types/common";

// Helper function to get unit label with plural/singular form
export function getUnitLabel(unit: RelativeDateUnit, value: string): string {
  const baseLabel = RELATIVE_DATE_UNIT_OPTIONS[unit];
  const numValue = parseInt(value) || 1;

  if (numValue > 1) {
    return `${baseLabel}s`;
  }
  return baseLabel;
}

// Format relative date to string: "This day", "Past 1 day", "Past 2 days", "Next 1 week", etc.
export function formatRelativeDateString(
  type: RelativeDateType,
  unit: RelativeDateUnit,
  value: string
): string {
  const typeLabel = RELATIVE_DATE_TYPE_OPTIONS[type];
  const unitLabel = getUnitLabel(unit, value);

  if (type === RelativeDateType.THIS) {
    return `${typeLabel} ${unitLabel.toLowerCase()}`;
  }

  const numValue = parseInt(value) || 1;
  return `${typeLabel} ${numValue} ${unitLabel.toLowerCase()}`;
}

// Parse relative date string: "This day", "Past 1 day", "Next 2 weeks", etc.
export function parseRelativeDateString(value: string): {
  type: RelativeDateType;
  unit: RelativeDateUnit;
  value: string;
} | null {
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
}

// Format input with mask: __/__/____ __:__
export function formatWithMask(digits: string): string {
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
}

// Parse masked value to actual date string for validation
export function parseMaskedValue(maskedValue: string): string | null {
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
}

// Validate date/time parts
export function validateDateParts(digits: string): string {
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
}

// Calculate new cursor position after formatting
export function calculateNewCursorPosition(
  oldValue: string,
  newValue: string,
  oldCursorPos: number,
  isDeleting: boolean
): number {
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
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useEffect, useState } from "react";
import {
  FieldConfigItem,
  FieldType,
  getArrayFieldValues,
} from "@/lib/field-config";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface InlineFieldEditorProps {
  fieldKey: string;
  fieldConfig: FieldConfigItem;
  value: any;
  onChange: (value: any) => void;
  className?: string;
}

export function InlineFieldEditor({
  fieldKey,
  fieldConfig,
  value,
  onChange,
  className,
}: InlineFieldEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const Icon = fieldConfig.icon;

  useEffect(() => {
    if (isEditing && inputRef.current && fieldConfig.type !== FieldType.ARRAY) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing, fieldConfig.type]);

  // Remove unnecessary effect: setTempValue(value || "") each value change can cause cascading renders.
  // Instead, sync tempValue directly when entering edit mode.
  const handleClick = () => {
    setIsEditing(true);
    setTempValue(value || "");
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(tempValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.currentTarget as HTMLInputElement).blur();
    } else if (e.key === "Escape") {
      setTempValue(value || "");
      setIsEditing(false);
    }
  };

  const formatDisplayValue = (val: any): string => {
    if (val === null || val === undefined || val === "") {
      return "Empty";
    }

    if (fieldConfig.type === FieldType.DATE && val) {
      try {
        const date = new Date(val);
        return format(date, "MMM dd, yyyy");
      } catch {
        return String(val);
      }
    }

    if (fieldConfig.type === FieldType.ARRAY) {
      if (typeof val === "object" && val !== null) {
        return val.name || String(val);
      }
      return String(val);
    }

    if (fieldConfig.type === FieldType.NUMBER) {
      return String(val);
    }

    return String(val);
  };

  // Render cho ARRAY field (Select dropdown)
  if (fieldConfig.type === FieldType.ARRAY) {
    const options = getArrayFieldValues(fieldKey);
    const displayValue = formatDisplayValue(value);

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-2 flex-1">
          <Icon className="size-4 text-neutral-400 shrink-0" />
          <p className="text-sm font-normal text-neutral-400">
            {fieldConfig.label}
          </p>
        </div>
        <div className="flex items-center flex-2">
          <Select value={value || ""} onValueChange={(val) => onChange(val)}>
            <SelectTrigger className="h-7 border-none shadow-none focus:ring-0 focus:ring-offset-0 px-0 w-auto min-w-[120px]">
              <SelectValue placeholder="Select...">
                <span
                  className={cn(
                    "text-sm",
                    value ? "text-neutral-900" : "text-neutral-400"
                  )}
                >
                  {displayValue}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  // Render cho DATE field (Popover + Calendar)
  if (fieldConfig.type === FieldType.DATE) {
    const dateValue = value ? new Date(value) : undefined;
    const displayValue = formatDisplayValue(value);

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-2 flex-1">
          <Icon className="size-4 text-neutral-400 shrink-0" />
          <p className="text-sm font-normal text-neutral-400">
            {fieldConfig.label}
          </p>
        </div>
        <div className="flex items-center flex-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-7 px-0 justify-start text-sm font-normal",
                  value ? "text-neutral-900" : "text-neutral-400"
                )}
              >
                {displayValue}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date) => {
                  if (date) {
                    onChange(date.toISOString());
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  }

  // Render cho TEXT và NUMBER fields (Input inline)
  if (isEditing) {
    return (
      <div className={cn("flex items-center gap-2 flex-1", className)}>
        <div className="flex items-center gap-2 flex-1">
          <Icon className="size-4 text-neutral-400 shrink-0" />
          <p className="text-sm font-normal text-neutral-400">
            {fieldConfig.label}
          </p>
        </div>
        <div className="flex items-center flex-2">
          <Input
            ref={inputRef}
            type={fieldConfig.type === FieldType.NUMBER ? "number" : "text"}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="h-7 px-0 border-none shadow-none focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-neutral-900 rounded-none text-sm"
            placeholder={`Enter ${fieldConfig.label.toLowerCase()}...`}
          />
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        "h-7 px-0 justify-start text-sm font-normal hover:bg-transparent",
        value ? "text-neutral-900" : "text-neutral-400",
        className
      )}
    >
      <div className="flex items-center gap-2 flex-1">
        <Icon className="size-4 text-neutral-400 shrink-0" />
        <p className="text-sm font-normal text-neutral-400">
          {fieldConfig.label}
        </p>
      </div>
      <div className="flex flex-2 items-center">
        <span className="truncate">{formatDisplayValue(value)}</span>
      </div>
    </Button>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";

interface EventCalendarProps<T> {
  data: T[];
  dateField: keyof T;
  titleField: keyof T;
  subtitleField?: keyof T;
}

export function EventCalendar<T extends { id: number }>({
  data,
  dateField,
  titleField,
  subtitleField,
}: EventCalendarProps<T>) {
  const [date, setDate] = useState<Date>(new Date());

  // Generate days for the grid
  const days = React.useMemo(() => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(monthStart);

    const startDate = startOfWeek(monthStart);

    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({
      start: startDate,
      end: endDate,
    });
  }, [date]);

  const [month, setMonth] = useState<Date>(date);

  useEffect(() => {
    setMonth(date);
  }, [date]);

  const handleMonthChange = (newMonth: Date) => {
    setMonth(newMonth);
    setDate(newMonth);
  };

  // Navigation handlers
  const handlePrevMonth = () => setDate(subMonths(date, 1));
  const handleNextMonth = () => setDate(addMonths(date, 1));
  const handleToday = () => setDate(new Date());

  // Format functions
  const formatMonthYear = (d: Date) => format(d, "MMMM yyyy");

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return data.filter((item) => {
      const itemDate = item[dateField];
      if (!itemDate) return false;
      const parsedDate = parseISO(String(itemDate));
      return isSameDay(parsedDate, day);
    });
  };

  // Get display values
  const getTitle = (item: T) => String(item[titleField] || "");
  const getSubtitle = (item: T) =>
    subtitleField ? String(item[subtitleField] || "") : "";

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between p-2 px-3">
        {/* Left: Date Picker Popover */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-auto justify-between text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? formatMonthYear(date) : <span>Pick a date</span>}
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                captionLayout="dropdown"
                month={month}
                onMonthChange={handleMonthChange}
                className="rounded-lg border [--cell-size:--spacing(9)] md:[--cell-size:--spacing(10)]"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Right: Navigation Controls */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            title="Previous Month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToday}
            className="mx-1"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            title="Next Month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content: Grid Day of Month */}
      <div className="px-3">
        <div className="border rounded-md bg-background flex flex-col flex-1 min-h-[700px]">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-4 text-right text-sm font-medium text-muted-foreground border-r last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 flex-1 auto-rows-fr">
            {days.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isSelected = isSameDay(day, date);
              const isCurrentMonth = isSameMonth(day, date);

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "min-h-[100px] p-2 border-b border-r last:border-r-0 relative transition-colors hover:bg-muted/20",
                    !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                    isSelected && "bg-accent/10"
                  )}
                  onClick={() => setDate(day)}
                >
                  <div className="flex justify-end items-start mb-2">
                    <span
                      className={cn(
                        "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                        isSameDay(day, new Date())
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground",
                        isSelected &&
                          !isSameDay(day, new Date()) &&
                          "bg-accent text-accent-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>

                  {/* Events List */}
                  <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px]">
                    {dayEvents.map((event) => {
                      const title = getTitle(event);
                      const subtitle = getSubtitle(event);
                      return (
                        <Badge
                          key={event.id}
                          variant="secondary"
                          className="text-xs truncate justify-start cursor-pointer px-1 py-0.5 font-normal h-auto"
                          title={subtitle ? `${title} (${subtitle})` : title}
                        >
                          <span className="truncate w-full">{title}</span>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

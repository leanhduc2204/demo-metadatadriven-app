"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldConfigItem } from "@/lib/field-config";
import { EntityConfig } from "@/lib/entity-config";
import { cn } from "@/lib/utils";
import { CalendarViewType } from "@/types/common";
import {
  addMonths,
  addWeeks,
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
  subWeeks,
} from "date-fns";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EventCard } from "./event-card";

interface EventCalendarProps<T> {
  data: T[];
  dateField: keyof T;
  primaryField: keyof T;
  visibleFields: string[];
  fieldConfig: Record<string, FieldConfigItem>;
  config: EntityConfig<T>;
  compactView?: boolean;
  calendarViewType?: CalendarViewType;
}

export function EventCalendar<T extends { id: number }>({
  data,
  dateField,
  primaryField,
  visibleFields,
  fieldConfig,
  config,
  compactView = false,
  calendarViewType = CalendarViewType.MONTH,
}: EventCalendarProps<T>) {
  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(date);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Toggle selection for an item
  const toggleSelection = (id: number, selected: boolean) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  useEffect(() => {
    setMonth(date);
  }, [date]);

  // Generate days based on view type
  const days = useMemo(() => {
    switch (calendarViewType) {
      case CalendarViewType.WEEK: {
        const weekStart = startOfWeek(date);
        const weekEnd = endOfWeek(date);
        return eachDayOfInterval({ start: weekStart, end: weekEnd });
      }
      case CalendarViewType.TIMELINE: {
        // Timeline shows current month days in a horizontal layout
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(monthStart);
        return eachDayOfInterval({ start: monthStart, end: monthEnd });
      }
      case CalendarViewType.MONTH:
      default: {
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        return eachDayOfInterval({ start: startDate, end: endDate });
      }
    }
  }, [date, calendarViewType]);

  const handleMonthChange = (newMonth: Date) => {
    setMonth(newMonth);
    setDate(newMonth);
  };

  // Navigation handlers based on view type
  const handlePrev = () => {
    switch (calendarViewType) {
      case CalendarViewType.WEEK:
        setDate(subWeeks(date, 1));
        break;
      case CalendarViewType.TIMELINE:
        setDate(subMonths(date, 1));
        break;
      default:
        setDate(subMonths(date, 1));
    }
  };

  const handleNext = () => {
    switch (calendarViewType) {
      case CalendarViewType.WEEK:
        setDate(addWeeks(date, 1));
        break;
      case CalendarViewType.TIMELINE:
        setDate(addMonths(date, 1));
        break;
      default:
        setDate(addMonths(date, 1));
    }
  };

  const handleToday = () => setDate(new Date());

  // Format header based on view type
  const formatHeader = (d: Date) => {
    switch (calendarViewType) {
      case CalendarViewType.WEEK: {
        const weekStart = startOfWeek(d);
        const weekEnd = endOfWeek(d);
        return `${format(weekStart, "MMM d")} - ${format(
          weekEnd,
          "MMM d, yyyy"
        )}`;
      }
      case CalendarViewType.TIMELINE:
        return format(d, "MMMM yyyy");
      default:
        return format(d, "MMMM yyyy");
    }
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return data.filter((item) => {
      const itemDate = item[dateField];
      if (!itemDate) return false;
      const parsedDate = parseISO(String(itemDate));
      return isSameDay(parsedDate, day);
    });
  };

  // Get all events sorted by date for timeline
  const sortedEvents = useMemo(() => {
    return [...data].sort((a, b) => {
      const dateA = a[dateField] ? parseISO(String(a[dateField])) : new Date(0);
      const dateB = b[dateField] ? parseISO(String(b[dateField])) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    });
  }, [data, dateField]);

  // Filter events for current month (timeline view)
  const monthEvents = useMemo(() => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    return sortedEvents.filter((item) => {
      const itemDate = item[dateField];
      if (!itemDate) return false;
      const parsedDate = parseISO(String(itemDate));
      return parsedDate >= monthStart && parsedDate <= monthEnd;
    });
  }, [sortedEvents, date, dateField]);

  // Render different views
  const renderMonthView = () => (
    <div className="border rounded-md bg-background flex flex-col">
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
      <div className="grid grid-cols-7 auto-rows-[minmax(100px,auto)]">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isSelected = isSameDay(day, date);
          const isCurrentMonth = isSameMonth(day, date);

          return (
            <div
              key={day.toString()}
              className={cn(
                "p-2 border-b border-r last:border-r-0 relative transition-colors hover:bg-muted/20",
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
              <div className="flex flex-col gap-1">
                {dayEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    item={event}
                    primaryField={primaryField}
                    visibleFields={visibleFields}
                    fieldConfig={fieldConfig}
                    config={config}
                    context="calendar"
                    compact={compactView}
                    selected={selectedIds.has(event.id)}
                    onSelectChange={(selected) =>
                      toggleSelection(event.id, selected)
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderWeekView = () => (
    <div className="border rounded-md bg-background flex flex-col flex-1 min-h-[600px]">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b">
        {days.map((day) => (
          <div
            key={day.toString()}
            className={cn(
              "p-4 text-center border-r last:border-r-0",
              isSameDay(day, new Date()) && "bg-primary/5"
            )}
          >
            <div className="text-sm font-medium text-muted-foreground">
              {format(day, "EEE")}
            </div>
            <div
              className={cn(
                "text-lg font-semibold mt-1",
                isSameDay(day, new Date()) && "text-primary"
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-7 flex-1">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);

          return (
            <div
              key={day.toString()}
              className={cn(
                "p-2 border-r last:border-r-0 overflow-y-auto",
                isSameDay(day, new Date()) && "bg-primary/5"
              )}
            >
              <div className="flex flex-col gap-1">
                {dayEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    item={event}
                    primaryField={primaryField}
                    visibleFields={visibleFields}
                    fieldConfig={fieldConfig}
                    config={config}
                    context="calendar"
                    compact={compactView}
                    selected={selectedIds.has(event.id)}
                    onSelectChange={(selected) =>
                      toggleSelection(event.id, selected)
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTimelineView = () => {
    return (
      <div className="border rounded-md bg-background flex flex-col flex-1 min-h-[600px]">
        {/* Timeline Header - Days of month */}
        <div className="flex border-b overflow-x-auto">
          <div className="w-48 shrink-0 p-3 border-r bg-muted/30 font-medium text-sm">
            Events
          </div>
          <div className="flex">
            {days.map((day) => (
              <div
                key={day.toString()}
                className={cn(
                  "w-10 shrink-0 p-2 text-center border-r text-xs",
                  isSameDay(day, new Date()) && "bg-primary/10"
                )}
              >
                <div className="text-muted-foreground">
                  {format(day, "EEE")}
                </div>
                <div
                  className={cn(
                    "font-semibold mt-0.5",
                    isSameDay(day, new Date()) && "text-primary"
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Rows */}
        <div className="flex-1 overflow-y-auto">
          {monthEvents.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No events this month
            </div>
          ) : (
            monthEvents.map((event) => {
              const eventDate = parseISO(String(event[dateField]));
              const dayIndex = eventDate.getDate() - 1;

              return (
                <div key={event.id} className="flex border-b hover:bg-muted/20">
                  <div className="w-48 shrink-0 p-2 border-r">
                    <EventCard
                      item={event}
                      primaryField={primaryField as keyof T}
                      visibleFields={visibleFields}
                      fieldConfig={fieldConfig}
                      config={config}
                      compact={compactView}
                      selected={selectedIds.has(event.id)}
                      onSelectChange={(selected) =>
                        toggleSelection(event.id, selected)
                      }
                    />
                  </div>
                  <div className="flex flex-1">
                    {days.map((day, index) => (
                      <div
                        key={day.toString()}
                        className={cn(
                          "w-10 shrink-0 border-r relative",
                          isSameDay(day, new Date()) && "bg-primary/5"
                        )}
                      >
                        {index === dayIndex && (
                          <div className="absolute inset-y-1 left-1 right-1 bg-primary/20 rounded-sm" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderView = () => {
    switch (calendarViewType) {
      case CalendarViewType.WEEK:
        return renderWeekView();
      case CalendarViewType.TIMELINE:
        return renderTimelineView();
      default:
        return renderMonthView();
    }
  };

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
                {date ? formatHeader(date) : <span>Pick a date</span>}
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

          {/* Selection indicator */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-600">
                {selectedIds.size} selected
              </span>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-primary hover:underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Right: Navigation Controls */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            title={`Previous ${calendarViewType}`}
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
            onClick={handleNext}
            title={`Next ${calendarViewType}`}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3">{renderView()}</div>
    </div>
  );
}

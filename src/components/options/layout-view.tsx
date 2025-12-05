import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { CalendarViewType, OpenInMode, ViewLayout } from "@/types/common";
import {
  Calendar,
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  StretchHorizontal,
  TextAlignJustify,
} from "lucide-react";
import { LayoutIcon } from "../layout-icon";

interface LayoutViewProps {
  currentLayout: ViewLayout;
  onLayoutChange: (layout: ViewLayout) => void;
  onBack: () => void;
  // Calendar specific options
  currentDateFieldLabel?: string;
  currentCalendarViewType?: CalendarViewType;
  currentOpenIn?: OpenInMode;
  compactView?: boolean;
  onOpenDateField?: () => void;
  onOpenCalendarView?: () => void;
  onOpenOpenIn?: () => void;
  onCompactViewChange?: (compact: boolean) => void;
  // Kanban specific options
  currentGroupByLabel?: string;
  onOpenGroup?: () => void;
}

const layoutOptions: {
  label: string;
  value: ViewLayout;
  icon: React.ReactNode;
}[] = [
  {
    label: "Table",
    value: ViewLayout.TABLE,
    icon: <LayoutIcon layout={ViewLayout.TABLE} />,
  },
  {
    label: "Calendar",
    value: ViewLayout.CALENDAR,
    icon: <LayoutIcon layout={ViewLayout.CALENDAR} />,
  },
  {
    label: "Kanban",
    value: ViewLayout.KANBAN,
    icon: <LayoutIcon layout={ViewLayout.KANBAN} />,
  },
];

const calendarViewTypeLabels: Record<CalendarViewType, string> = {
  [CalendarViewType.WEEK]: "Week",
  [CalendarViewType.MONTH]: "Month",
  [CalendarViewType.TIMELINE]: "Timeline",
};

const openInLabels: Record<OpenInMode, string> = {
  [OpenInMode.SIDE_PANEL]: "Side panel",
  [OpenInMode.RECORD_PAGE]: "Record page",
};

export function LayoutView({
  currentLayout,
  onLayoutChange,
  onBack,
  currentDateFieldLabel,
  currentCalendarViewType,
  currentOpenIn,
  compactView,
  onOpenDateField,
  onOpenCalendarView,
  onOpenOpenIn,
  onCompactViewChange,
  // Kanban props
  currentGroupByLabel,
  onOpenGroup,
}: LayoutViewProps) {
  const isCalendarSelected = currentLayout === ViewLayout.CALENDAR;
  const isKanbanSelected = currentLayout === ViewLayout.KANBAN;

  return (
    <>
      <div className="flex items-center">
        <Button variant={"ghost"} size={"icon-sm"} onClick={onBack}>
          <ChevronLeft className="text-neutral-400" />
        </Button>
        <span className="text-neutral-900 font-semibold text-sm">Layout</span>
      </div>
      <Separator />
      <div className="py-1 px-0.5 flex flex-col gap-1">
        {layoutOptions.map((option) => (
          <Button
            key={option.value}
            variant={"ghost"}
            className="justify-between w-full text-neutral-500"
            size={"sm"}
            onClick={() => onLayoutChange(option.value)}
          >
            <div className="flex flex-1 items-center gap-2">
              {option.icon}
              <span>{option.label}</span>
            </div>
            <Check
              size={16}
              className={`${
                currentLayout === option.value ? "opacity-100" : "opacity-0"
              }`}
            />
          </Button>
        ))}
      </div>

      {/* Calendar specific options - only show when Calendar is selected */}
      {isCalendarSelected && (
        <>
          <Separator />
          <div className="py-1 px-0.5 flex flex-col gap-1">
            <Button
              variant={"ghost"}
              className="justify-between w-full text-neutral-500"
              size={"sm"}
              onClick={onOpenDateField}
            >
              <div className="flex flex-1 items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                <span>Date field</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <span>{currentDateFieldLabel}</span>
                <ChevronRight size={16} />
              </div>
            </Button>

            <Button
              variant={"ghost"}
              className="justify-between w-full text-neutral-500"
              size={"sm"}
              onClick={onOpenCalendarView}
            >
              <div className="flex flex-1 items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Calendar view</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <span>
                  {currentCalendarViewType
                    ? calendarViewTypeLabels[currentCalendarViewType]
                    : "Month"}
                </span>
                <ChevronRight size={16} />
              </div>
            </Button>

            <Button
              variant={"ghost"}
              className="justify-between w-full text-neutral-500"
              size={"sm"}
              onClick={onOpenOpenIn}
            >
              <div className="flex flex-1 items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>Open in</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <span>
                  {currentOpenIn ? openInLabels[currentOpenIn] : "Side panel"}
                </span>
                <ChevronRight size={16} />
              </div>
            </Button>

            <div className="flex items-center justify-between w-full text-neutral-500 px-3 py-1.5">
              <div className="flex flex-1 items-center gap-2">
                <TextAlignJustify className="h-4 w-4" />
                <span className="text-sm font-medium">Compact view</span>
              </div>
              <Switch
                checked={compactView}
                onCheckedChange={onCompactViewChange}
              />
            </div>
          </div>
        </>
      )}

      {/* Kanban specific options - only show when Kanban is selected */}
      {isKanbanSelected && (
        <>
          <Separator />
          <div className="py-1 px-0.5 flex flex-col gap-1">
            <Button
              variant={"ghost"}
              className="justify-between w-full text-neutral-500"
              size={"sm"}
              onClick={onOpenGroup}
            >
              <div className="flex flex-1 items-center gap-2">
                <StretchHorizontal className="h-4 w-4" />
                <span>Group</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <span>{currentGroupByLabel}</span>
                <ChevronRight size={16} />
              </div>
            </Button>

            <Button
              variant={"ghost"}
              className="justify-between w-full text-neutral-500"
              size={"sm"}
              onClick={onOpenOpenIn}
            >
              <div className="flex flex-1 items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>Open in</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <span>
                  {currentOpenIn ? openInLabels[currentOpenIn] : "Side panel"}
                </span>
                <ChevronRight size={16} />
              </div>
            </Button>

            <div className="flex items-center justify-between w-full text-neutral-500 px-3 py-1.5">
              <div className="flex flex-1 items-center gap-2">
                <TextAlignJustify className="h-4 w-4" />
                <span className="text-sm font-medium">Compact view</span>
              </div>
              <Switch
                checked={compactView}
                onCheckedChange={onCompactViewChange}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  CalendarClock,
  ChevronRight,
  Copy,
  LayoutList,
  StretchHorizontal,
  Trash2,
} from "lucide-react";
import { LayoutIcon } from "../layout-icon";
import { ViewLayout } from "@/types/common";

interface GroupedMainMenuProps {
  visibleFieldsCount: number;
  onOpenFields: () => void;
  onOpenLayout: () => void;
  onOpenGroup: () => void;
  currentLayout: ViewLayout;
  currentLayoutLabel: string;
  currentGroupByLabel: string;
  // Calendar specific props
  isCalendarLayout?: boolean;
  currentDateFieldLabel?: string;
  currentCalendarViewLabel?: string;
  onOpenDateField?: () => void;
  onOpenCalendarView?: () => void;
}

export function GroupedMainMenu({
  visibleFieldsCount,
  onOpenFields,
  onOpenLayout,
  onOpenGroup,
  currentLayout,
  currentLayoutLabel,
  currentGroupByLabel,
  isCalendarLayout = false,
  currentDateFieldLabel,
  currentCalendarViewLabel,
  onOpenDateField,
  onOpenCalendarView,
}: GroupedMainMenuProps) {
  return (
    <>
      <Button
        variant={"ghost"}
        className="justify-between w-full text-neutral-500"
        size={"sm"}
        onClick={onOpenLayout}
      >
        <div className="flex flex-1 items-center gap-2">
          <LayoutIcon layout={currentLayout} />
          <span>Layout</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <span>{currentLayoutLabel}</span>
          <ChevronRight />
        </div>
      </Button>

      <Separator />

      <Button
        variant={"ghost"}
        className="justify-between w-full text-neutral-500"
        size={"sm"}
        onClick={onOpenFields}
      >
        <div className="flex flex-1 items-center gap-2">
          <LayoutList />
          <span>Fields</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <span>{visibleFieldsCount} shown</span>
          <ChevronRight />
        </div>
      </Button>

      {/* Show Group option only when NOT in calendar layout */}
      {!isCalendarLayout && (
        <Button
          variant={"ghost"}
          className="justify-between w-full text-neutral-500"
          size={"sm"}
          onClick={onOpenGroup}
        >
          <div className="flex flex-1 items-center gap-2">
            <StretchHorizontal />
            <span>Group</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <span>{currentGroupByLabel}</span>
            <ChevronRight />
          </div>
        </Button>
      )}

      {/* Show Calendar specific options when in calendar layout */}
      {isCalendarLayout && (
        <>
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
              <ChevronRight />
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
              <span>{currentCalendarViewLabel}</span>
              <ChevronRight />
            </div>
          </Button>
        </>
      )}

      <Separator />

      <Button
        variant={"ghost"}
        className="justify-between w-full text-neutral-500"
        size={"sm"}
      >
        <div className="flex flex-1 items-center gap-2">
          <Copy />
          <span>Copy link to view</span>
        </div>
      </Button>

      <Button
        variant={"ghost"}
        className="justify-between w-full text-neutral-500"
        size={"sm"}
      >
        <div className="flex flex-1 items-center gap-2">
          <Trash2 />
          <span>Delete view</span>
        </div>
      </Button>
    </>
  );
}

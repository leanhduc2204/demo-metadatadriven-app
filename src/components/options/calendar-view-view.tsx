import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarViewType } from "@/types/common";
import {
  Calendar,
  CalendarRange,
  Check,
  ChevronLeft,
  GanttChart,
} from "lucide-react";

interface CalendarViewViewProps {
  currentViewType: CalendarViewType;
  onViewTypeChange: (viewType: CalendarViewType) => void;
  onBack: () => void;
}

const viewTypeOptions: {
  label: string;
  value: CalendarViewType;
  icon: React.ReactNode;
}[] = [
  {
    label: "Week",
    value: CalendarViewType.WEEK,
    icon: <CalendarRange className="h-4 w-4" />,
  },
  {
    label: "Month",
    value: CalendarViewType.MONTH,
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    label: "Timeline",
    value: CalendarViewType.TIMELINE,
    icon: <GanttChart className="h-4 w-4" />,
  },
];

export function CalendarViewView({
  currentViewType,
  onViewTypeChange,
  onBack,
}: CalendarViewViewProps) {
  return (
    <>
      <div className="flex items-center">
        <Button variant={"ghost"} size={"icon-sm"} onClick={onBack}>
          <ChevronLeft className="text-neutral-400" />
        </Button>
        <span className="text-neutral-900 font-semibold text-sm">
          Calendar view
        </span>
      </div>
      <Separator />
      <div className="py-1 px-0.5 flex flex-col gap-1">
        {viewTypeOptions.map((option) => (
          <Button
            key={option.value}
            variant={"ghost"}
            className="justify-between w-full text-neutral-500"
            size={"sm"}
            onClick={() => onViewTypeChange(option.value)}
          >
            <div className="flex flex-1 items-center gap-2">
              {option.icon}
              <span>{option.label}</span>
            </div>
            <Check
              size={16}
              className={`${
                currentViewType === option.value ? "opacity-100" : "opacity-0"
              }`}
            />
          </Button>
        ))}
      </div>
    </>
  );
}

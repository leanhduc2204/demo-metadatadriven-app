import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ViewLayout } from "@/types/common";
import { Check, ChevronLeft } from "lucide-react";
import { LayoutIcon } from "../layout-icon";

interface LayoutViewProps {
  currentLayout: ViewLayout;
  onLayoutChange: (layout: ViewLayout) => void;
  onBack: () => void;
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

export function LayoutView({
  currentLayout,
  onLayoutChange,
  onBack,
}: LayoutViewProps) {
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
    </>
  );
}

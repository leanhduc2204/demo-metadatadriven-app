import {
  List,
  LockKeyhole,
  LayoutList,
  ChevronRight,
  Copy,
  Grid2x2Plus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ViewLayout } from "../options-popover";

interface MainMenuProps {
  visibleFieldsCount: number;
  onOpenFields: () => void;
  viewLayout?: ViewLayout;
  onViewLayoutChange?: (layout: ViewLayout) => void;
}

const viewLayoutOptions: { label: string; value: ViewLayout }[] = [
  { label: "Table", value: "table" },
  { label: "Calendar", value: "calendar" },
  { label: "Kanban", value: "kanban" },
];

export function MainMenu({
  visibleFieldsCount,
  onOpenFields,
  viewLayout,
  onViewLayoutChange,
}: MainMenuProps) {
  return (
    <>
      <Button
        variant={"ghost"}
        className="justify-between w-full text-neutral-500"
        disabled
        size={"sm"}
      >
        <div className="flex flex-1 items-center gap-2">
          <List />
          <span className=" text-sm">Default View</span>
        </div>

        <LockKeyhole />
      </Button>
      <Separator />
      <Button
        variant={"ghost"}
        className="justify-between w-full text-neutral-500"
        size={"sm"}
        onClick={onOpenFields}
      >
        <div className="flex flex-1 items-center gap-2">
          <LayoutList className="text-neutral-500" />
          <span className=" text-sm">Fields</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <span>{visibleFieldsCount} shown</span>
          <ChevronRight />
        </div>
      </Button>
      {viewLayout && onViewLayoutChange && (
        <>
          <Separator />
          <div className="px-2 py-1.5 text-xs font-medium text-neutral-500">
            Layout
          </div>
          {viewLayoutOptions.map((option) => (
            <Button
              key={option.value}
              variant={"ghost"}
              className="justify-between w-full text-neutral-500"
              size={"sm"}
              onClick={() => onViewLayoutChange(option.value)}
            >
              <span className="text-sm pl-6">{option.label}</span>
              {viewLayout === option.value && <Check size={16} />}
            </Button>
          ))}
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
          <span className=" text-sm">Copy link to view</span>
        </div>
      </Button>
      <Button
        variant={"ghost"}
        className="justify-between w-full text-neutral-500"
        size={"sm"}
      >
        <div className="flex flex-1 items-center gap-2">
          <Grid2x2Plus />
          <span className=" text-sm">Create custom view</span>
        </div>
      </Button>
    </>
  );
}

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight,
  Copy,
  LayoutList,
  StretchHorizontal,
  Table2,
  Trash2,
} from "lucide-react";

interface GroupedMainMenuProps {
  visibleFieldsCount: number;
  onOpenFields: () => void;
  onOpenLayout: () => void;
  onOpenGroup: () => void;
  currentLayoutLabel: string;
  currentGroupByLabel: string;
}

export function GroupedMainMenu({
  visibleFieldsCount,
  onOpenFields,
  onOpenLayout,
  onOpenGroup,
  currentLayoutLabel,
  currentGroupByLabel,
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
          <Table2 />
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

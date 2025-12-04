import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ArrowDownWideNarrow,
  Ban,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  StretchHorizontal,
} from "lucide-react";
import { SortableGroupItem } from "./sortable-group-item";
import { Switch } from "../ui/switch";
import { FieldConfigItem } from "@/lib/field-config";
import { SORT_ORDER_OPTIONS } from "@/lib/constants";
import { SortOrder } from "@/types/common";

interface GroupViewProps {
  onBack: () => void;
  groupBy: string;
  sortBy: SortOrder;
  hideEmptyGroups: boolean;
  onHideEmptyGroupsChange: (value: boolean) => void;
  visibleGroups: string[];
  onReorderGroups: (groups: string[]) => void;
  onHideGroup: (group: string) => void;
  onOpenHiddenGroups: () => void;
  onOpenGroupBy: () => void;
  onOpenSort: () => void;
  fieldConfig: Record<string, FieldConfigItem>;
  hiddenGroups: string[];
}

export function GroupView({
  onBack,
  groupBy,
  sortBy,
  hideEmptyGroups,
  onHideEmptyGroupsChange,
  visibleGroups,
  onReorderGroups,
  onHideGroup,
  onOpenHiddenGroups,
  onOpenGroupBy,
  onOpenSort,
  fieldConfig,
  hiddenGroups,
}: GroupViewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = visibleGroups.indexOf(String(active.id));
      const newIndex = visibleGroups.indexOf(String(over.id));
      onReorderGroups(arrayMove(visibleGroups, oldIndex, newIndex));
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <Button variant={"ghost"} size={"icon-sm"} onClick={onBack}>
          <ChevronLeft className="text-neutral-400" />
        </Button>
        <span className="text-neutral-900 font-semibold text-sm">Group</span>
      </div>

      <Separator />

      <div className="py-1 px-0.5 flex flex-col gap-1">
        <Button
          variant={"ghost"}
          className="justify-between w-full text-neutral-500"
          size={"sm"}
          onClick={onOpenGroupBy}
        >
          <div className="flex flex-1 items-center gap-2">
            <StretchHorizontal />
            <span>Group by</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <span>{fieldConfig[groupBy]?.label || groupBy}</span>
            <ChevronRight />
          </div>
        </Button>

        <Button
          variant={"ghost"}
          className="justify-between w-full text-neutral-500"
          size={"sm"}
          onClick={onOpenSort}
        >
          <div className="flex flex-1 items-center gap-2">
            <ArrowDownWideNarrow />
            <span>Sort</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-400 overflow-hidden">
            <span className="truncate">{SORT_ORDER_OPTIONS[sortBy]}</span>
            <ChevronRight className="shrink-0" />
          </div>
        </Button>

        <div
          className="flex items-center justify-between w-full h-9 px-3 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer text-neutral-500"
          onClick={() => onHideEmptyGroupsChange(!hideEmptyGroups)}
        >
          <div className="flex flex-1 items-center gap-2 text-sm font-medium">
            <Ban size={16} />
            <span>Hide empty groups</span>
          </div>
          <Switch
            checked={hideEmptyGroups}
            onCheckedChange={onHideEmptyGroupsChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      <Separator />

      <div className="flex flex-col">
        <div className="bg-neutral-100 px-1 py-0.5">
          <span className="text-[10px] font-light text-neutral-500">
            Visible groups
          </span>
        </div>

        <div className="py-1 px-0.5 flex flex-col gap-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visibleGroups}
              strategy={verticalListSortingStrategy}
            >
              {visibleGroups.map((group) => (
                <SortableGroupItem
                  key={group}
                  id={group}
                  onHide={() => onHideGroup(group)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        {hiddenGroups.length > 0 && (
          <>
            <Separator />
            <Button
              variant={"ghost"}
              size={"sm"}
              className="w-full justify-between text-neutral-500"
              onClick={onOpenHiddenGroups}
            >
              <div className="flex flex-1 items-center gap-3">
                <EyeOff />
                <span>Hidden Stage</span>
              </div>
              <ChevronRight />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChevronLeft, ChevronRight, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FieldConfigItem } from "@/lib/field-config";
import { SortableItem } from "./sortable-item";

interface FieldsViewProps {
  fieldConfig: Record<string, FieldConfigItem>;
  visibleFields: string[];
  onHideField: (field: string) => void;
  onReorderFields: (fields: string[]) => void;
  onBack: () => void;
  onOpenHiddenFields: () => void;
  lockedColumns: string[];
}

export function FieldsView({
  fieldConfig,
  visibleFields,
  onHideField,
  onReorderFields,
  onBack,
  onOpenHiddenFields,
  lockedColumns,
}: FieldsViewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = visibleFields.indexOf(active.id as string);
      const newIndex = visibleFields.indexOf(over.id as string);
      onReorderFields(arrayMove(visibleFields, oldIndex, newIndex));
    }
  };

  return (
    <>
      <div className="flex items-center">
        <Button variant={"ghost"} size={"icon-sm"} onClick={onBack}>
          <ChevronLeft className="text-neutral-400" />
        </Button>

        <span className="text-neutral-900 text-semibold text-sm">Fields</span>
      </div>
      <Separator />
      <div className="py-1 px-0.5 flex flex-col gap-1">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={visibleFields}
            strategy={verticalListSortingStrategy}
          >
            {visibleFields.map((field) => (
              <SortableItem
                key={field}
                id={field}
                config={fieldConfig[field]}
                onHideField={onHideField}
                isLocked={lockedColumns.includes(field)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <Separator />
      <Button
        variant={"ghost"}
        size={"sm"}
        className="w-full justify-between text-neutral-500"
        onClick={onOpenHiddenFields}
      >
        <div className="flex flex-1 items-center gap-3">
          <EyeOff />
          <span>Hidden Fields</span>
        </div>
        <ChevronRight />
      </Button>
    </>
  );
}

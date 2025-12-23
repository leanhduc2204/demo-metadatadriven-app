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
      const activeId = active.id as string;
      const targetId = over.id as string;

      // Kiểm tra xem item đang được drag có bị lock không
      if (lockedColumns.includes(activeId)) {
        // Không cho phép drag item bị lock
        return;
      }

      // Kiểm tra xem item đích có bị lock không
      if (lockedColumns.includes(targetId)) {
        // Không cho phép di chuyển item vào vị trí của item bị lock
        return;
      }

      // Tách các item không bị lock và item bị lock
      const unlockedFields: string[] = [];
      const lockedFields: string[] = [];
      const lockedIndices: number[] = [];

      visibleFields.forEach((field, index) => {
        if (lockedColumns.includes(field)) {
          lockedFields.push(field);
          lockedIndices.push(index);
        } else {
          unlockedFields.push(field);
        }
      });

      // Di chuyển item trong danh sách không bị lock
      const oldUnlockedIndex = unlockedFields.indexOf(activeId);
      const targetUnlockedIndex = unlockedFields.indexOf(targetId);

      if (oldUnlockedIndex !== -1 && targetUnlockedIndex !== -1) {
        const reorderedUnlocked = arrayMove(
          unlockedFields,
          oldUnlockedIndex,
          targetUnlockedIndex
        );

        // Chèn lại các item bị lock vào vị trí ban đầu
        const result: string[] = [];
        let unlockedIdx = 0;
        let lockedIdx = 0;

        for (let i = 0; i < visibleFields.length; i++) {
          if (lockedIndices.includes(i)) {
            result.push(lockedFields[lockedIdx]);
            lockedIdx++;
          } else {
            result.push(reorderedUnlocked[unlockedIdx]);
            unlockedIdx++;
          }
        }

        onReorderFields(result);
      }
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

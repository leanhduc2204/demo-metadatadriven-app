import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldConfigItem } from "@/lib/field-config";

interface SortableItemProps {
  id: string;
  config: FieldConfigItem;
  onHideField: (field: string) => void;
  isLocked?: boolean;
}

export function SortableItem({
  id,
  config,
  onHideField,
  isLocked = false,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isLocked });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: "relative" as const,
  };

  const Icon = config?.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between w-full hover:bg-neutral-100 rounded-md pr-1 pl-1 ${
        isDragging ? "bg-neutral-100 opacity-80" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className={`p-1 ${
          isLocked
            ? "opacity-50 cursor-not-allowed"
            : "cursor-grab active:cursor-grabbing text-neutral-500 hover:text-neutral-700"
        }`}
      >
        <GripVertical
          size={16}
          className={isLocked ? "text-neutral-300" : ""}
        />
      </div>
      <Button
        variant={"ghost"}
        size={"sm"}
        className={`justify-start text-neutral-500 text-sm font-light gap-3 flex-1 hover:bg-transparent ${
          isLocked ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Icon />
        <span>{config?.label || id}</span>
      </Button>
      {!isLocked && (
        <Button
          variant={"ghost"}
          size={"icon-sm"}
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500"
          onClick={(e) => {
            e.stopPropagation();
            onHideField(id);
          }}
        >
          <EyeOff />
        </Button>
      )}
    </div>
  );
}

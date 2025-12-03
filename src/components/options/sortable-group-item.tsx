import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { Stage } from "@/lib/data";

const stageColorMap: Record<string, string> = {
  [Stage.NEW]: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  [Stage.SCREENING]: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  [Stage.MEETING]: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  [Stage.PROPOSAL]: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  [Stage.CUSTOMER]: "bg-green-100 text-green-700 hover:bg-green-100",
};

interface SortableGroupItemProps {
  id: string;
  onHide: () => void;
}

export function SortableGroupItem({ id, onHide }: SortableGroupItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    position: "relative" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-1 w-full rounded-md hover:bg-neutral-100 ${
        isDragging ? "bg-neutral-100 opacity-80" : ""
      }`}
    >
      <div className="flex items-center gap-2 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-neutral-500 hover:text-neutral-700 p-1"
        >
          <GripVertical size={16} />
        </div>
        <Badge
          variant="secondary"
          className={`text-xs font-normal rounded-md px-2 py-0.5 ${
            stageColorMap[id] || "bg-neutral-100 text-neutral-700"
          }`}
        >
          <span className="text-nowrap">{id}</span>
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500"
        onClick={(e) => {
          e.stopPropagation();
          onHide();
        }}
      >
        <EyeOff />
      </Button>
    </div>
  );
}

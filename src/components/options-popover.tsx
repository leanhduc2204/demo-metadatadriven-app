"use client";

import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  Grid2x2Plus,
  GripVertical,
  LayoutList,
  List,
  LockKeyhole,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FieldConfigItem } from "@/lib/field-config";

interface OptionsPopoverProps {
  fieldConfig: Record<string, FieldConfigItem>;
  visibleFields: string[];
  onHideField: (field: string) => void;
  onShowField: (field: string) => void;
  onReorderFields: (fields: string[]) => void;
}

interface SortableItemProps {
  id: string;
  config: FieldConfigItem;
  onHideField: (field: string) => void;
}

function SortableItem({ id, config, onHideField }: SortableItemProps) {
  const isNameField = id === "fullName";
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isNameField });

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
          isNameField
            ? "opacity-50 cursor-not-allowed"
            : "cursor-grab active:cursor-grabbing text-neutral-500 hover:text-neutral-700"
        }`}
      >
        <GripVertical
          size={16}
          className={isNameField ? "text-neutral-300" : ""}
        />
      </div>
      <Button
        variant={"ghost"}
        size={"sm"}
        className={`justify-start text-neutral-500 text-sm font-light gap-3 flex-1 hover:bg-transparent ${
          isNameField ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Icon />
        <span>{config?.label || id}</span>
      </Button>
      {!isNameField && (
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

interface MainMenuProps {
  visibleFieldsCount: number;
  onOpenFields: () => void;
}

function MainMenu({ visibleFieldsCount, onOpenFields }: MainMenuProps) {
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

interface HiddenFieldsViewProps {
  fieldConfig: Record<string, FieldConfigItem>;
  visibleFields: string[];
  onShowField: (field: string) => void;
  onBack: () => void;
}

function HiddenFieldsView({
  fieldConfig,
  visibleFields,
  onShowField,
  onBack,
}: HiddenFieldsViewProps) {
  return (
    <>
      <div className="flex items-center">
        <Button variant={"ghost"} size={"icon-sm"} onClick={onBack}>
          <ChevronLeft className="text-neutral-400" />
        </Button>

        <span className="text-neutral-900 text-semibold text-sm">
          Hidden Fields
        </span>
      </div>
      <Separator />
      <div className="py-1 px-0.5 flex flex-col gap-1">
        {Object.keys(fieldConfig)
          .filter((field) => !visibleFields.includes(field) && field !== "id")
          .map((field) => {
            const config = fieldConfig[field];
            const Icon = config?.icon;
            return (
              <div
                key={field}
                className="group flex items-center justify-between w-full hover:bg-neutral-100 rounded-md pr-1"
              >
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="justify-start text-neutral-500 text-sm font-light gap-3 flex-1 hover:bg-transparent"
                >
                  <Icon />
                  <span>{config?.label || field}</span>
                </Button>
                <Button
                  variant={"ghost"}
                  size={"icon-sm"}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowField(field);
                  }}
                >
                  <Eye />
                </Button>
              </div>
            );
          })}
      </div>
    </>
  );
}

interface FieldsViewProps {
  fieldConfig: Record<string, FieldConfigItem>;
  visibleFields: string[];
  onHideField: (field: string) => void;
  onReorderFields: (fields: string[]) => void;
  onBack: () => void;
  onOpenHiddenFields: () => void;
}

function FieldsView({
  fieldConfig,
  visibleFields,
  onHideField,
  onReorderFields,
  onBack,
  onOpenHiddenFields,
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

export function OptionsPopover({
  fieldConfig,
  visibleFields,
  onHideField,
  onShowField,
  onReorderFields,
}: OptionsPopoverProps) {
  const [open, setOpen] = useState(false);
  const [showFields, setShowFields] = useState(false);
  const [showHiddenFields, setShowHiddenFields] = useState(false);

  const renderContent = () => {
    if (showFields) {
      return (
        <FieldsView
          fieldConfig={fieldConfig}
          visibleFields={visibleFields}
          onHideField={onHideField}
          onReorderFields={onReorderFields}
          onBack={() => setShowFields(false)}
          onOpenHiddenFields={() => {
            setShowFields(false);
            setShowHiddenFields(true);
          }}
        />
      );
    }

    if (showHiddenFields) {
      return (
        <HiddenFieldsView
          fieldConfig={fieldConfig}
          visibleFields={visibleFields}
          onShowField={onShowField}
          onBack={() => {
            setShowHiddenFields(false);
            setShowFields(true);
          }}
        />
      );
    }

    return (
      <MainMenu
        visibleFieldsCount={visibleFields.length}
        onOpenFields={() => setShowFields(true)}
      />
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} size={"sm"} className="text-neutral-500 px-2">
          Options
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 py-1 flex flex-col gap-1" align="end">
        {renderContent()}
      </PopoverContent>
    </Popover>
  );
}

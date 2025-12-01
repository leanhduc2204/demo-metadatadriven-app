"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldConfigItem } from "@/lib/field-config";
import { FieldsView } from "./options/fields-view";
import { HiddenFieldsView } from "./options/hidden-fields-view";
import { MainMenu } from "./options/main-menu";

export type ViewLayout = "table" | "kanban" | "calendar";

interface OptionsPopoverProps {
  fieldConfig: Record<string, FieldConfigItem>;
  visibleFields: string[];
  onHideField: (field: string) => void;
  onShowField: (field: string) => void;
  onReorderFields: (fields: string[]) => void;
  viewLayout?: ViewLayout;
  onViewLayoutChange?: (layout: ViewLayout) => void;
  lockedColumns?: string[];
}

export function OptionsPopover({
  fieldConfig,
  visibleFields,
  onHideField,
  onShowField,
  onReorderFields,
  viewLayout,
  onViewLayoutChange,
  lockedColumns = ["fullName"],
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
          lockedColumns={lockedColumns}
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
        viewLayout={viewLayout}
        onViewLayoutChange={onViewLayoutChange}
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

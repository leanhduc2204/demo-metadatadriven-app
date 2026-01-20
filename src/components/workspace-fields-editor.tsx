"use client";

import { useMemo } from "react";
import {
  fieldConfig,
  peopleFields,
  opportunityFields,
  taskFields,
} from "@/lib/field-config";
import { InlineFieldEditor } from "./inline-field-editor";

interface WorkspaceFieldsEditorProps {
  workspaceKey: string;
  formData: Record<string, unknown>;
  onFieldChange: (fieldKey: string, value: unknown) => void;
  visibleFields?: string[]; // Optional: chỉ hiển thị các fields này
}

export function WorkspaceFieldsEditor({
  workspaceKey,
  formData,
  onFieldChange,
  visibleFields,
}: WorkspaceFieldsEditorProps) {
  // Lấy fields theo workspace
  const fields = useMemo(() => {
    switch (workspaceKey) {
      case "people":
        return visibleFields || peopleFields.filter((f) => f !== "id");
      case "opportunities":
        return visibleFields || opportunityFields.filter((f) => f !== "id");
      case "tasks":
        return visibleFields || taskFields.filter((f) => f !== "id");
      default:
        return [];
    }
  }, [workspaceKey, visibleFields]);

  // Lọc bỏ các fields không cần hiển thị trong form (như createdBy, creationDate)
  const formFields = useMemo(() => {
    return fields.filter(
      (field) => !["createdBy", "creationDate", "lastUpdate"].includes(field)
    );
  }, [fields]);

  return (
    <div className="space-y-4">
      {formFields.map((fieldKey) => {
        const config = fieldConfig[fieldKey];
        if (!config) return null;

        return (
          <div key={fieldKey} className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <InlineFieldEditor
                fieldKey={fieldKey}
                fieldConfig={config}
                value={formData[fieldKey]}
                onChange={(value) => onFieldChange(fieldKey, value)}
                className="w-full"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

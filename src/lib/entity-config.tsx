/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { CalendarViewType, OpenInMode, ViewLayout } from "@/types/common";
import { Opportunity, Stage, Task, TaskStatus, User } from "./data";
import { opportunityFields, peopleFields, taskFields } from "./field-config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatDate,
  pickColorBySeed,
  timeFromNow,
} from "./format";

export type EntityViewPreset<T> = {
  view?: "all" | "grouped";
  layout?: ViewLayout;
  groupBy?: keyof T & string;
  calendarDateField?: keyof T;
  calendarViewType?: CalendarViewType;
  openIn?: OpenInMode;
  compactView?: boolean;
};

export interface EntityConfig<T> {
  name: string; // Display name: "Tasks"
  entityKey: string; // Unique key: "tasks"
  fields: string[]; // All fields
  defaultVisibleFields: string[]; // Default visible fields
  pinnedColumns: string[]; // Pinned columns on the left
  primaryField: string; // Primary field (replaces "name"/"fullName")

  // Grouping (optional) - if not present = simple entity like People
  grouping?: {
    groupableFields: string[]; // Fields that can be grouped
    defaultGroupBy: string; // Default group by field
    getGroupValues: (field: string) => string[]; // Get group values for a field
  };

  // Calendar view config (optional)
  calendar?: {
    dateField: keyof T; // Field to use for calendar date
    subtitleField?: keyof T; // Optional field for subtitle/badge info
  };

  // Predefined view presets that can be activated via query params
  viewPresets?: Record<string, EntityViewPreset<T>>;

  // Custom formatters for specific fields
  // Formatter can accept just value (backward compatible) or both value and row
  formatters?: Partial<
    Record<
      keyof T,
      ((value: any) => ReactNode) | ((value: any, row?: T) => ReactNode)
    >
  >;

  // Custom cell renderers for complex rendering with full row context
  // Takes precedence over formatters
  customCellRenderers?: Partial<
    Record<keyof T, (row: T, field: keyof T) => ReactNode>
  >;
}

// Opportunity Config
export const opportunityConfig: EntityConfig<Opportunity> = {
  name: "Opportunities",
  entityKey: "opportunities",
  fields: opportunityFields,
  defaultVisibleFields: ["name", "amount", "stage", "closeDate", "company"],
  pinnedColumns: ["select", "name"],
  primaryField: "name",

  grouping: {
    groupableFields: ["stage"],
    defaultGroupBy: "stage",
    getGroupValues: (field: string) => {
      if (field === "stage") {
        return Object.values(Stage);
      }
      return [];
    },
  },

  calendar: {
    dateField: "closeDate",
    subtitleField: "stage",
  },

  viewPresets: {
    stage: {
      view: "grouped",
      layout: ViewLayout.TABLE,
      groupBy: "stage",
    },
  },

  formatters: {
    amount: formatCurrency,
    closeDate: formatDate,
    creationDate: timeFromNow,
    lastUpdate: timeFromNow,
  },

  customCellRenderers: {
    name: (row: Opportunity) => {
      const avt = row.name.charAt(0);
      const bgClass = pickColorBySeed(row.name);
      return (
        <Badge variant={"secondary"} className="rounded-sm px-1">
          <Avatar className="size-[14px]">
            <AvatarFallback className={`text-[10px] ${bgClass}`}>
              {avt}
            </AvatarFallback>
          </Avatar>
          <span className="text-[13px] font-normal">{row.name}</span>
        </Badge>
      );
    },
  },
};

// Task Config
export const taskConfig: EntityConfig<Task> = {
  name: "Tasks",
  entityKey: "tasks",
  fields: taskFields,
  defaultVisibleFields: ["title", "status", "dueDate", "assignee"],
  pinnedColumns: ["select", "title"],
  primaryField: "title",

  grouping: {
    groupableFields: ["status"],
    defaultGroupBy: "status",
    getGroupValues: (field: string) => {
      if (field === "status") {
        return Object.values(TaskStatus);
      }
      return [];
    },
  },

  calendar: {
    dateField: "dueDate",
    subtitleField: "status",
  },

  viewPresets: {
    status: {
      view: "grouped",
      layout: ViewLayout.TABLE,
      groupBy: "status",
    },
  },

  formatters: {
    dueDate: formatDate,
    creationDate: timeFromNow,
    lastUpdate: timeFromNow,
  },
};

// People Config (no grouping - simple entity)
export const peopleConfig: EntityConfig<User> = {
  name: "People",
  entityKey: "people",
  fields: peopleFields,
  defaultVisibleFields: [
    "fullName",
    "emails",
    "company",
    "phones",
    "city",
    "jobTitle",
  ],
  pinnedColumns: ["select", "fullName"],
  primaryField: "fullName",
  // No grouping - simple table view only

  formatters: {
    creationDate: timeFromNow,
  },

  customCellRenderers: {
    fullName: (row: User) => {
      const value = row.fullName;
      const avatar = row.avatar;
      return (
        <Badge variant={"secondary"} className="rounded-sm px-1">
          <Avatar className="size-[14px]">
            {avatar ? (
              <AvatarImage src={avatar} alt={String(value || "")} />
            ) : null}
            <AvatarFallback className="bg-gray-200">
              <UserIcon className="size-[14px] text-neutral-500" />
            </AvatarFallback>
          </Avatar>
          <span className="text-[13px] font-normal">{String(value || "")}</span>
        </Badge>
      );
    },
    emails: (row: User) => {
      return (
        <Badge variant={"outline"}>
          <span>{row.emails.join(", ")}</span>
        </Badge>
      );
    },
    company: (row: User) => {
      return (
        <Badge variant={"secondary"} className="rounded-sm px-1">
          <span>{row.company}</span>
        </Badge>
      );
    },
    phones: (row: User) => {
      return (
        <Badge variant={"outline"}>
          <span>{row.phones.join(", ")}</span>
        </Badge>
      );
    },
    createdBy: (row: User) => {
      const avatar = row.createdBy.charAt(0);
      return (
        <div className="flex items-center gap-1">
          <Avatar className="size-[14px]">
            <AvatarFallback className="bg-green-300 text-[10px]">
              {avatar}
            </AvatarFallback>
          </Avatar>
          <span className="text-[13px] font-normal">{row.createdBy}</span>
        </div>
      );
    },
  },
};

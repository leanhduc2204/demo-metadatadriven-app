/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarViewType, OpenInMode, ViewLayout } from "@/types/common";
import { ReactNode } from "react";
import { Opportunity, Stage, Task, TaskStatus, User } from "./data";
import { opportunityFields, peopleFields, taskFields } from "./field-config";
import {
  formatCurrency,
  formatDate,
  pickColorBySeed,
  timeFromNow,
} from "./format";
import { COLUMN_IDS, VIEW_TYPES } from "./constants";

export type EntityViewPreset<T> = {
  view?: typeof VIEW_TYPES.ALL | typeof VIEW_TYPES.GROUPED;
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

  // Map group values to tailwind color classes
  groupColorMap?: Record<string, string>;

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

  // Context-specific formatters for primary field in EventCard
  // Allows different formatting for kanban/calendar/table views
  primaryFieldFormatters?: {
    kanban?: (value: any, row: T) => ReactNode;
    calendar?: (value: any, row: T) => ReactNode;
    table?: (value: any, row: T) => ReactNode;
  };
}

// Opportunity Config
export const opportunityConfig: EntityConfig<Opportunity> = {
  name: "Opportunities",
  entityKey: "opportunities",
  fields: opportunityFields,
  defaultVisibleFields: ["name", "amount", "stage", "closeDate", "company"],
  pinnedColumns: [COLUMN_IDS.SELECT, "name"],
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

  groupColorMap: {
    [Stage.NEW]: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    [Stage.SCREENING]: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    [Stage.MEETING]: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    [Stage.PROPOSAL]: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    [Stage.CUSTOMER]: "bg-green-100 text-green-700 hover:bg-green-100",
  },

  calendar: {
    dateField: "closeDate",
    subtitleField: "stage",
  },

  viewPresets: {
    stage: {
      view: VIEW_TYPES.GROUPED,
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

  primaryFieldFormatters: {
    // Kanban: Avatar + text format for better visual in cards
    kanban: (value: string) => {
      const avt = value ? value.charAt(0) : "?";
      const bgClass = pickColorBySeed(value || "");
      return (
        <div className="flex items-center gap-1.5">
          <Avatar className="size-[16px]">
            <AvatarFallback className={`text-[10px] ${bgClass}`}>
              {avt}
            </AvatarFallback>
          </Avatar>
          <span className="text-[13px] font-medium text-[#171717]">
            {String(value || "")}
          </span>
        </div>
      );
    },
    // Calendar: Can use same simple format or customize
    calendar: (value: string) => {
      return String(value || "");
    },
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
    createdBy: (row: Opportunity) => {
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
    company: (row: Opportunity) => {
      return (
        <Badge variant={"secondary"} className="rounded-sm px-1">
          <span>{row.company}</span>
        </Badge>
      );
    },
    pointOfContact: (row: Opportunity) => {
      const avatar = row.avatarPointOfContact;
      const value = row.pointOfContact;
      return (
        <Badge variant={"secondary"} className="rounded-sm px-1">
          <Avatar className="size-[14px]">
            {avatar ? (
              <AvatarImage src={avatar} alt={String(value || "")} />
            ) : null}
            <AvatarFallback className="bg-green-300 text-[10px]">
              {value ? value.charAt(0) : "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-[13px] font-normal">{String(value || "")}</span>
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
  defaultVisibleFields: ["title", "status"],
  pinnedColumns: [COLUMN_IDS.SELECT, "title"],
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

  groupColorMap: {
    [TaskStatus.TODO]: "bg-neutral-100 text-neutral-700 hover:bg-neutral-100",
    [TaskStatus.IN_PROGRESS]: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    [TaskStatus.DONE]: "bg-green-100 text-green-700 hover:bg-green-100",
  },

  calendar: {
    dateField: "dueDate",
    subtitleField: "status",
  },

  viewPresets: {
    status: {
      view: VIEW_TYPES.GROUPED,
      layout: ViewLayout.TABLE,
      groupBy: "status",
    },
  },

  formatters: {
    dueDate: formatDate,
    creationDate: timeFromNow,
    lastUpdate: timeFromNow,
  },

  customCellRenderers: {
    title: (row: Task) => {
      const avatar = row.title.charAt(0);
      const bgClass = pickColorBySeed(row.title);

      return (
        <Badge variant={"secondary"} className="rounded-sm px-1">
          <Avatar className="size-[14px]">
            <AvatarFallback className={`text-[10px] ${bgClass}`}>
              {avatar}
            </AvatarFallback>
          </Avatar>
          <span className="text-[13px] font-normal">{row.title}</span>
        </Badge>
      );
    },
  },

  primaryFieldFormatters: {
    // Kanban: Avatar + text format for better visual in cards
    kanban: (value: string) => {
      const avt = value ? value.charAt(0) : "?";
      const bgClass = pickColorBySeed(value || "");
      return (
        <div className="flex items-center gap-1.5">
          <Avatar className="size-[16px]">
            <AvatarFallback className={`text-[10px] ${bgClass}`}>
              {avt}
            </AvatarFallback>
          </Avatar>
          <span className="text-[13px] font-medium text-[#171717]">
            {String(value || "")}
          </span>
        </div>
      );
    },
    // Calendar: Can use same simple format or customize
    calendar: (value: string) => {
      return String(value || "");
    },
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
  pinnedColumns: [COLUMN_IDS.SELECT, "fullName"],
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
            <AvatarFallback className="bg-green-300 text-[10px]">
              {value ? value.charAt(0) : "?"}
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

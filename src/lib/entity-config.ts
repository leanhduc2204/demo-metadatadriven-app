/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { Opportunity, Stage, Task, TaskStatus, User } from "./data";
import { opportunityFields, peopleFields, taskFields } from "./field-config";

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

  // Custom formatters for specific fields
  formatters?: Partial<Record<keyof T, (value: any) => ReactNode>>;
}

// Currency formatter
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

// Date formatter
const formatDate = (value: string) =>
  value ? new Date(value).toLocaleDateString() : "";

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

  formatters: {
    amount: formatCurrency,
    closeDate: formatDate,
    creationDate: formatDate,
    lastUpdate: formatDate,
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

  formatters: {
    dueDate: formatDate,
    creationDate: formatDate,
    lastUpdate: formatDate,
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
    creationDate: formatDate,
    emails: (value: string[]) => value?.join(", ") || "",
    phones: (value: string[]) => value?.join(", ") || "",
  },
};

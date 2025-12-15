import {
  ArrowDown01,
  BriefcaseBusiness,
  Building,
  Calendar1,
  CalendarClock,
  CircleDollarSign,
  Clock,
  Contact,
  History,
  Mail,
  Map,
  Phone,
  Target,
  User as UserIcon,
  LucideIcon,
  FileText,
  ListTodo,
  CalendarDays,
  UserCheck,
} from "lucide-react";
import { companies, Stage, TaskStatus } from "./data";

export enum FieldType {
  TEXT = "text",
  NUMBER = "number",
  DATE = "date",
  ARRAY = "array",
}

export interface FieldConfigItem {
  label: string;
  icon: LucideIcon;
  type?: FieldType;
}

export const fieldConfig: Record<string, FieldConfigItem> = {
  id: { label: "Id", icon: ArrowDown01, type: FieldType.TEXT },
  fullName: { label: "Name", icon: UserIcon, type: FieldType.TEXT },
  emails: { label: "Emails", icon: Mail, type: FieldType.TEXT },
  company: { label: "Company", icon: Building, type: FieldType.ARRAY },
  phones: { label: "Phones", icon: Phone, type: FieldType.TEXT },
  createdBy: { label: "Created by", icon: History, type: FieldType.TEXT },
  creationDate: {
    label: "Creation date",
    icon: Calendar1,
    type: FieldType.DATE,
  },
  city: { label: "City", icon: Map, type: FieldType.TEXT },
  jobTitle: {
    label: "Job Title",
    icon: BriefcaseBusiness,
    type: FieldType.TEXT,
  },
  // Opportunity specific fields
  name: { label: "Name", icon: UserIcon, type: FieldType.TEXT },
  amount: { label: "Amount", icon: CircleDollarSign, type: FieldType.NUMBER },
  closeDate: {
    label: "Close Date",
    icon: CalendarClock,
    type: FieldType.DATE,
  },
  stage: { label: "Stage", icon: Target, type: FieldType.ARRAY },
  pointOfContact: {
    label: "Point of Contact",
    icon: Contact,
    type: FieldType.TEXT,
  },
  lastUpdate: {
    label: "Last Update",
    icon: Clock,
    type: FieldType.DATE,
  },
  // Task specific fields
  title: { label: "Title", icon: FileText, type: FieldType.TEXT },
  status: { label: "Status", icon: ListTodo, type: FieldType.ARRAY },
  dueDate: {
    label: "Due Date",
    icon: CalendarDays,
    type: FieldType.DATE,
  },
  assignee: { label: "Assignee", icon: UserCheck, type: FieldType.TEXT },
};

export const peopleFields = [
  "id",
  "fullName",
  "emails",
  "company",
  "phones",
  "createdBy",
  "creationDate",
  "city",
  "jobTitle",
];

export const opportunityFields = [
  "id",
  "name",
  "amount",
  "stage",
  "closeDate",
  "company",
  "pointOfContact",
  "createdBy",
  "creationDate",
  "lastUpdate",
];

export const taskFields = [
  "id",
  "title",
  "status",
  "dueDate",
  "assignee",
  "createdBy",
  "creationDate",
  "lastUpdate",
];

export function getFieldConfig(fields: string[]) {
  const config: Record<string, FieldConfigItem> = {};
  fields.forEach((field) => {
    if (fieldConfig[field]) {
      config[field] = fieldConfig[field];
    }
  });
  return config;
}

export function getDateFields(fields: string[]): string[] {
  return fields.filter((field) => {
    const config = fieldConfig[field];
    // Priority 1: Use field type if available
    if (config?.type === FieldType.DATE) {
      return true;
    }
    // Priority 2: Fallback to name-based detection (backward compatibility)
    const lowerField = field.toLowerCase();
    return (
      lowerField.includes("date") ||
      lowerField === "closedate" ||
      lowerField === "duedate" ||
      lowerField === "creationdate" ||
      lowerField === "lastupdate"
    );
  });
}

export function getArrayFieldValues(field: string): string[] {
  if (field === "company") {
    // For company field, return company names
    return companies.map((c) => c.name);
  }
  if (field === "stage") {
    return Object.values(Stage);
  }
  if (field === "status") {
    return Object.values(TaskStatus);
  }
  return [];
}

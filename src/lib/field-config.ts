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

export interface FieldConfigItem {
  label: string;
  icon: LucideIcon;
}

export const fieldConfig: Record<string, FieldConfigItem> = {
  id: { label: "Id", icon: ArrowDown01 },
  fullName: { label: "Name", icon: UserIcon },
  emails: { label: "Emails", icon: Mail },
  company: { label: "Company", icon: Building },
  phones: { label: "Phones", icon: Phone },
  createdBy: { label: "Created by", icon: History },
  creationDate: { label: "Creation date", icon: Calendar1 },
  city: { label: "City", icon: Map },
  jobTitle: { label: "Job Title", icon: BriefcaseBusiness },
  // Opportunity specific fields
  name: { label: "Name", icon: UserIcon },
  amount: { label: "Amount", icon: CircleDollarSign },
  closeDate: { label: "Close Date", icon: CalendarClock },
  stage: { label: "Stage", icon: Target },
  pointOfContact: { label: "Point of Contact", icon: Contact },
  lastUpdate: { label: "Last Update", icon: Clock },
  // Task specific fields
  title: { label: "Title", icon: FileText },
  status: { label: "Status", icon: ListTodo },
  dueDate: { label: "Due Date", icon: CalendarDays },
  assignee: { label: "Assignee", icon: UserCheck },
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

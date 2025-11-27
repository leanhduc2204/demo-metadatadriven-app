import {
  ArrowDown01,
  BriefcaseBusiness,
  Building,
  Calendar1,
  History,
  Mail,
  Map,
  Phone,
  User as UserIcon,
  LucideIcon,
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
};

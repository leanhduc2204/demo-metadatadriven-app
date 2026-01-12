import {
  Calendar,
  FileText,
  House,
  Mail,
  Paperclip,
  SquareCheckBig,
} from "lucide-react";
import { WorkspaceTabConfig } from "./entity-config";

const defaultTabs = [
  { id: "home", label: "Home", icon: House },
  { id: "tasks", label: "Tasks", icon: SquareCheckBig },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "files", label: "Files", icon: Paperclip },
  { id: "emails", label: "Emails", icon: Mail },
  { id: "calendar", label: "Calendar", icon: Calendar },
];

export const workspaceTabsConfig: WorkspaceTabConfig = {
  people: defaultTabs,
  opportunities: defaultTabs,
  tasks: defaultTabs.filter((tab) => tab.id === "home" || tab.id === "files"),
};

import { Calendar1, Kanban, Table2 } from "lucide-react";
import { ViewLayout } from "@/types/common";

interface LayoutIconProps {
  layout: ViewLayout;
}

const layoutIcons: Record<ViewLayout, React.ReactNode> = {
  table: <Table2 />,
  calendar: <Calendar1 />,
  kanban: <Kanban />,
};

export function LayoutIcon({ layout }: LayoutIconProps) {
  return layoutIcons[layout] ?? <Table2 />;
}

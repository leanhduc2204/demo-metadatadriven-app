"use client";

import { EntityPage } from "@/components/entity-page";
import { taskConfig } from "@/lib/entity-config";
import { tasks } from "@/lib/data";

export default function TasksPage() {
  return <EntityPage config={taskConfig} data={tasks} />;
}

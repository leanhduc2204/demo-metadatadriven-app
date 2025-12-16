"use client";

import { Suspense } from "react";
import { EntityPage } from "@/components/entity-page";
import { taskConfig } from "@/lib/entity-config";
import { tasks } from "@/lib/data";

export default function TasksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EntityPage config={taskConfig} data={tasks} />
    </Suspense>
  );
}

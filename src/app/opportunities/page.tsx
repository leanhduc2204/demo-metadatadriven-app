"use client";

import { Suspense } from "react";
import { EntityPage } from "@/components/entity-page";
import { opportunityConfig } from "@/lib/entity-config";
import { opportunities } from "@/lib/data";

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EntityPage config={opportunityConfig} data={opportunities} />
    </Suspense>
  );
}

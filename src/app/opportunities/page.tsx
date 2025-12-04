"use client";

import { EntityPage } from "@/components/entity-page";
import { opportunityConfig } from "@/lib/entity-config";
import { opportunities } from "@/lib/data";

export default function OpportunitiesPage() {
  return <EntityPage config={opportunityConfig} data={opportunities} />;
}

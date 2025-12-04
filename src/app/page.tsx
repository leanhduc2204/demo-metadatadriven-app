"use client";

import { EntityPage } from "@/components/entity-page";
import { peopleConfig } from "@/lib/entity-config";
import { data } from "@/lib/data";

export default function Home() {
  return <EntityPage config={peopleConfig} data={data} />;
}

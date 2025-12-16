"use client";

import { Suspense } from "react";
import { EntityPage } from "@/components/entity-page";
import { peopleConfig } from "@/lib/entity-config";
import { data } from "@/lib/data";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EntityPage config={peopleConfig} data={data} />
    </Suspense>
  );
}

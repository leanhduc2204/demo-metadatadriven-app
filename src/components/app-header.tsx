"use client";

import { items } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function AppHeader() {
  const pathname = usePathname();
  const item = items.find((item) => item.url === pathname) || items[0];
  const Icon = item.icon;

  return (
    <header className="flex shrink-0 items-center gap-2 bg-neutral-100 px-4 pt-3">
      <SidebarTrigger className="-ml-1 size-5" />
      <div className="flex items-center gap-1">
        <Icon size={16} className="text-neutral-900" />
        <p className="text-[13px] font-medium text-neutral-900">{item.title}</p>
      </div>
    </header>
  );
}

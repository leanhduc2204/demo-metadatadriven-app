"use client";

import { items } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronLeft, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader } from "./ui/sheet";
import { workspaceTabsConfig } from "@/lib/workspace-tabs-config";
import { WorkspaceTabBar } from "./workspace-tabbar";

export function AppHeader() {
  const pathname = usePathname();
  const item = items.find((item) => item.url === pathname) || items[0];
  const Icon = item.icon;
  const [isOpen, setIsOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState("home");

  const newTitle = useMemo(() => {
    switch (item.title) {
      case "People":
        return "People";
      case "Opportunities":
        return "Opportunity";
      case "Tasks":
        return "Task";
      default:
        return "Record";
    }
  }, [item.title]);

  const workspaceKey = useMemo(() => {
    return item.title.toLowerCase().replace(/\s+/g, "");
  }, [item.title]);

  const tabs = useMemo(() => {
    return workspaceTabsConfig[workspaceKey] || workspaceTabsConfig.people;
  }, [workspaceKey]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setActiveTabId("home");
    }
  };

  return (
    <>
      <header className="flex shrink-0 items-center justify-between gap-2 bg-neutral-100 px-2 pt-3">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1 size-5" />
          <div className="flex items-center gap-1">
            <Icon className="text-neutral-900 size-4" />
            <p className="text-[13px] font-medium text-neutral-900">
              {item.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={"outline"}
            size={"sm"}
            className="bg-transparent text-neutral-500 hover:text-neutral-500 hover:bg-neutral-200 h-6 text-sm"
            onClick={() => setIsOpen(true)}
          >
            <Plus />
            New record
          </Button>
        </div>
      </header>

      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg p-0 flex flex-col gap-2"
        >
          <SheetHeader className="bg-neutral-100 border-b flex-row px-4 py-3">
            <div className="flex items-center gap-2">
              <Button
                variant={"outline"}
                className="bg-neutral-200 size-7 text-neutral-900 hover:bg-neutral-300"
                onClick={() => setIsOpen(false)}
              >
                <ChevronLeft />
              </Button>
              <Button
                value={"outline"}
                className="bg-neutral-200 text-neutral-900 h-7 disabled:opacity-100"
                disabled
              >
                <Icon className="text-neutral-900 size-3.5" />
                <p className="text-xs font-medium text-neutral-900">
                  New {newTitle}
                </p>
              </Button>
            </div>
          </SheetHeader>

          <WorkspaceTabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onTabChange={setActiveTabId}
          />

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-4">
              {/* Render content dựa trên activeTabId */}
              <p className="text-sm text-neutral-500">
                Active tab: {activeTabId}
              </p>
              {/* Form fields sẽ được render ở đây dựa trên activeTabId */}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

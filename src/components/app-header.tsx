"use client";

import { items } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader } from "./ui/sheet";
import { workspaceTabsConfig } from "@/lib/workspace-tabs-config";
import { WorkspaceTabBar } from "./workspace-tabbar";
import { formatDistanceToNow } from "date-fns";
import { Input } from "./ui/input";
import { WorkspaceFieldsEditor } from "./workspace-fields-editor";

export function AppHeader() {
  const pathname = usePathname();
  const item = items.find((item) => item.url === pathname) || items[0];
  const Icon = item.icon;
  const [isOpen, setIsOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState("home");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("Untitled");
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const inputRef = useRef<HTMLInputElement>(null);

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
      setIsEditingTitle(false);
      setTitle("Untitled");
      setFormData({});
    }
  };

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    // Có thể thêm validation hoặc save logic ở đây
    if (title.trim() === "") {
      setTitle("Untitled");
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setTitle("Untitled");
      setIsEditingTitle(false);
    }
  };

  const handleFieldChange = (fieldKey: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
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

          <div className="flex-1 overflow-y-auto p-3 py-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-10 bg-neutral-100 rounded-full flex items-center justify-center">
                <Minus className="size-2" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                {isEditingTitle ? (
                  <Input
                    ref={inputRef}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleTitleKeyDown}
                    className="text-xl font-semibold h-7 px-0 border-none shadow-none focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-neutral-900 rounded-none"
                    placeholder="Enter title..."
                  />
                ) : (
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="justify-start px-0 self-start py-1 h-7 text-xl rounded-sm text-neutral-500 cursor-pointer font-semibold hover:text-neutral-900 hover:bg-transparent"
                    onClick={handleTitleClick}
                  >
                    {title || "Untitled"}
                  </Button>
                )}
                <p className="text-sm font-normal text-neutral-400">
                  Added {formatDistanceToNow(new Date())} ago
                </p>
              </div>
            </div>

            <WorkspaceFieldsEditor
              workspaceKey={workspaceKey}
              formData={formData}
              onFieldChange={handleFieldChange}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

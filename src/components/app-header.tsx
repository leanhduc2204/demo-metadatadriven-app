"use client";

import { items } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronLeft, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader } from "./ui/sheet";

export function AppHeader() {
  const pathname = usePathname();
  const item = items.find((item) => item.url === pathname) || items[0];
  const Icon = item.icon;
  const [isOpen, setIsOpen] = useState(false);

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

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader className="bg-neutral-100 border-b flex-row">
            <div className="flex items-center gap-2">
              <Button
                className="bg-neutral-200 size-7 text-neutral-900 hover:bg-neutral-300"
                onClick={() => setIsOpen(false)}
              >
                <ChevronLeft />
              </Button>
              <Button
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
          <div className="mt-6 space-y-4">
            {/* Nội dung form sẽ được thêm vào đây */}
            <p className="text-sm text-neutral-500">
              Form tạo bản ghi mới sẽ được thêm vào đây...
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

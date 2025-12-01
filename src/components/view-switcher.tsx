"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ListIcon, LockKeyhole, Plus } from "lucide-react";
import { ReactNode } from "react";

interface ViewSwitcherProps {
  itemCount: number;
  tableName: string;
  children?: ReactNode;
  currentView?: string;
  onDefaultViewClick?: () => void;
}

export function ViewSwitcher({
  itemCount,
  tableName,
  children,
  currentView,
  onDefaultViewClick,
}: ViewSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="text-neutral-600 text-sm gap-2"
        >
          <ListIcon />
          <span>
            {currentView || `All ${tableName}`}
            <span className="text-neutral-400 ml-1">• {itemCount}</span>
          </span>
          <ChevronDown className="text-neutral-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-neutral-500 w-full justify-between"
            onClick={onDefaultViewClick}
            disabled={!onDefaultViewClick}
          >
            <div className="flex flex-1 items-center gap-2">
              <ListIcon />
              All {tableName}
            </div>
            <LockKeyhole />
          </DropdownMenuItem>
          {children}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-neutral-500">
            <Plus />
            Add View
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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

interface ViewSwitcherProps {
  itemCount: number;
}

export function ViewSwitcher({ itemCount }: ViewSwitcherProps) {
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
            All People <span className="text-neutral-400">• {itemCount}</span>
          </span>
          <ChevronDown className="text-neutral-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-neutral-500 w-full justify-between"
            disabled
          >
            <div className="flex flex-1 items-center gap-2">
              <ListIcon />
              All People
            </div>
            <LockKeyhole />
          </DropdownMenuItem>
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

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
import { ChevronDown, ListIcon, Plus } from "lucide-react";

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
          <ListIcon size={16} />
          <span className="font-normal">
            All People <span className="text-neutral-400">• {itemCount}</span>
          </span>
          <ChevronDown size={16} className="text-neutral-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-neutral-500 font-normal">
            <ListIcon size={16} />
            All People
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-neutral-500 font-normal">
            <Plus size={16} />
            Add View
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SORT_BY_OPTIONS } from "@/lib/constants";
import { SortBy } from "@/types/common";
import { Check, ChevronDown } from "lucide-react";

interface SortDirectionSelectProps {
  value: SortBy;
  onChange: (value: SortBy) => void;
}

export function SortDirectionSelect({
  value,
  onChange,
}: SortDirectionSelectProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={"sm"}
          className="text-neutral-500 text-xs w-full justify-between"
        >
          {SORT_BY_OPTIONS[value]}
          <ChevronDown className="text-neutral-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuItem
          onClick={() => onChange(SortBy.ASC)}
          className="justify-between text-neutral-500 text-xs"
        >
          <span>{SORT_BY_OPTIONS[SortBy.ASC]}</span>
          {value === SortBy.ASC && <Check />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onChange(SortBy.DESC)}
          className="justify-between text-neutral-500 text-xs"
        >
          <span>{SORT_BY_OPTIONS[SortBy.DESC]}</span>
          {value !== SortBy.ASC && <Check />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

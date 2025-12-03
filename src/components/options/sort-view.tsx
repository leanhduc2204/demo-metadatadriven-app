import {
  ArrowDownAZ,
  ArrowDownZA,
  ArrowDownZa,
  Check,
  ChevronLeft,
  Hand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SortOrder } from "@/types/common";
import { SORT_ORDER_OPTIONS } from "@/lib/constants";

interface SortViewProps {
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
  onBack: () => void;
}

const sortOrderOptions: {
  label: string;
  value: SortOrder;
  icon: React.ReactNode;
}[] = [
  { label: "Manual", value: SortOrder.MANUAL, icon: <Hand /> },
  {
    label: "Alphabetical",
    value: SortOrder.ALPHABETICAL,
    icon: <ArrowDownAZ />,
  },
  {
    label: "Reverse alphabetical",
    value: SortOrder.REVERSE_ALPHABETICAL,
    icon: <ArrowDownZA />,
  },
];

export function SortView({
  sortOrder,
  onSortOrderChange,
  onBack,
}: SortViewProps) {
  return (
    <>
      <div className="flex items-center">
        <Button variant={"ghost"} size={"icon-sm"} onClick={onBack}>
          <ChevronLeft className="text-neutral-400" />
        </Button>
        <span className="text-neutral-900 font-semibold text-sm">Sort</span>
      </div>
      <Separator />
      <div className="py-1 px-0.5 flex flex-col gap-1">
        {sortOrderOptions.map((option) => (
          <Button
            key={option.value}
            variant={"ghost"}
            className="justify-between w-full text-neutral-500"
            size={"sm"}
            onClick={() => {
              onSortOrderChange(option.value);
              onBack();
            }}
          >
            <div className="flex flex-1 items-center gap-2">
              {option.icon}
              <span>{option.label}</span>
            </div>
            <Check
              size={16}
              className={`${
                sortOrder === option.value ? "opacity-100" : "opacity-0"
              }`}
            />
          </Button>
        ))}
      </div>
    </>
  );
}

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OpenInMode } from "@/types/common";
import { Check, ChevronLeft, PanelRight, FileText } from "lucide-react";

interface OpenInViewProps {
  currentOpenIn: OpenInMode;
  onOpenInChange: (openIn: OpenInMode) => void;
  onBack: () => void;
}

const openInOptions: {
  label: string;
  value: OpenInMode;
  icon: React.ReactNode;
}[] = [
  {
    label: "Side panel",
    value: OpenInMode.SIDE_PANEL,
    icon: <PanelRight className="h-4 w-4" />,
  },
  {
    label: "Record page",
    value: OpenInMode.RECORD_PAGE,
    icon: <FileText className="h-4 w-4" />,
  },
];

export function OpenInView({
  currentOpenIn,
  onOpenInChange,
  onBack,
}: OpenInViewProps) {
  return (
    <>
      <div className="flex items-center">
        <Button variant={"ghost"} size={"icon-sm"} onClick={onBack}>
          <ChevronLeft className="text-neutral-400" />
        </Button>
        <span className="text-neutral-900 font-semibold text-sm">Open in</span>
      </div>
      <Separator />
      <div className="py-1 px-0.5 flex flex-col gap-1">
        {openInOptions.map((option) => (
          <Button
            key={option.value}
            variant={"ghost"}
            className="justify-between w-full text-neutral-500"
            size={"sm"}
            onClick={() => onOpenInChange(option.value)}
          >
            <div className="flex flex-1 items-center gap-2">
              {option.icon}
              <span>{option.label}</span>
            </div>
            <Check
              size={16}
              className={`${
                currentOpenIn === option.value ? "opacity-100" : "opacity-0"
              }`}
            />
          </Button>
        ))}
      </div>
    </>
  );
}

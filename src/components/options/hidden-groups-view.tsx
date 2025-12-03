import { ChevronLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "../ui/badge";
import { Stage } from "@/lib/data";

const stageColorMap: Record<string, string> = {
  [Stage.NEW]: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  [Stage.SCREENING]: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  [Stage.MEETING]: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  [Stage.PROPOSAL]: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  [Stage.CUSTOMER]: "bg-green-100 text-green-700 hover:bg-green-100",
};

interface HiddenGroupsViewProps {
  hiddenGroups: string[];
  onShowGroup: (group: string) => void;
  onBack: () => void;
}

export function HiddenGroupsView({
  hiddenGroups,
  onShowGroup,
  onBack,
}: HiddenGroupsViewProps) {
  return (
    <>
      <div className="flex items-center">
        <Button variant={"ghost"} size={"icon-sm"} onClick={onBack}>
          <ChevronLeft className="text-neutral-400" />
        </Button>
        <span className="text-neutral-900 font-semibold text-sm">
          Hidden Groups
        </span>
      </div>
      <Separator />
      <div className="py-1 px-0.5 flex flex-col gap-1">
        {hiddenGroups.length === 0 ? (
          <div className="px-2 py-1.5 text-sm text-neutral-500 italic">
            No hidden groups
          </div>
        ) : (
          hiddenGroups.map((group) => (
            <div
              key={group}
              className="group flex items-center justify-between p-1 w-full rounded-md hover:bg-neutral-100"
            >
              <div className="flex items-center gap-2 flex-1 pl-1">
                <Badge
                  variant="secondary"
                  className={`text-xs font-normal rounded-md px-2 py-0.5 ${
                    stageColorMap[group] || "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  <span className="text-nowrap">{group}</span>
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-6 w-6 text-neutral-400 hover:text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onShowGroup(group)}
              >
                <Eye size={14} />
              </Button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

import { TabConfig } from "@/lib/entity-config";
import { cn } from "@/lib/utils";

interface WorkspaceTabBarProps {
  tabs: TabConfig[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
}

export function WorkspaceTabBar({
  tabs,
  activeTabId,
  onTabChange,
}: WorkspaceTabBarProps) {
  return (
    <div className="flex items-center gap-1 border-b border-neutral-200 bg-white px-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTabId === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors",
              "hover:text-neutral-900",
              isActive
                ? "text-neutral-900 border-b border-neutral-900"
                : "text-neutral-500"
            )}
          >
            <Icon className="size-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

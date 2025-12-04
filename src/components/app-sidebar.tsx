"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  type LucideIcon,
  User,
  Target,
  SquareCheckBig,
  List,
  Layers,
  ListFilter,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SidebarSubItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

type SidebarItemConfig = {
  title: string;
  url: string;
  icon: LucideIcon;
  subItems?: SidebarSubItem[];
};

// Menu items.
export const items: SidebarItemConfig[] = [
  {
    title: "People",
    url: "/",
    icon: User,
  },
  {
    title: "Opportunities",
    url: "/opportunities",
    icon: Target,
    subItems: [
      {
        title: "All Opportunities",
        url: "/opportunities?view=all",
        icon: List,
      },
      {
        title: "By Stage",
        url: "/opportunities?view=stage",
        icon: Layers,
      },
    ],
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: SquareCheckBig,
    subItems: [
      {
        title: "All Tasks",
        url: "/tasks?view=all",
        icon: List,
      },
      {
        title: "By Status",
        url: "/tasks?view=status",
        icon: ListFilter,
      },
    ],
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";
  const [expandedParents, setExpandedParents] = useState<
    Record<string, boolean>
  >({});

  const matchesSubRoute = useCallback(
    (subUrl: string) => {
      const [targetPath, queryString] = subUrl.split("?");
      if (targetPath !== pathname) {
        return false;
      }

      if (!queryString) {
        // No query means base route
        return !searchParams.toString();
      }

      const targetParams = new URLSearchParams(queryString);
      for (const [key, value] of targetParams.entries()) {
        if (searchParams.get(key) !== value) {
          return false;
        }
      }
      return true;
    },
    [pathname, searchParams]
  );

  const autoExpandedParents = useMemo(() => {
    const expanded: Record<string, boolean> = {};
    items.forEach((item) => {
      if (!item.subItems?.length) return;
      if (item.subItems.some((sub) => matchesSubRoute(sub.url))) {
        expanded[item.title] = true;
      }
    });
    return expanded;
  }, [matchesSubRoute]);

  const handleParentClick = (item: SidebarItemConfig) => {
    if (item.subItems?.length) {
      setExpandedParents((prev) => {
        if (prev[item.title]) {
          return prev;
        }
        return {
          ...prev,
          [item.title]: true,
        };
      });
      router.push(item.subItems[0].url);
      return;
    }

    router.push(item.url);
  };

  const handleSubItemClick = (url: string) => {
    router.push(url);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const hasSubItems = Boolean(item.subItems?.length);
                const isExpanded =
                  !!expandedParents[item.title] ||
                  !!autoExpandedParents[item.title];

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      type="button"
                      tooltip={item.title}
                      onClick={() => handleParentClick(item)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>

                    {hasSubItems &&
                      isExpanded &&
                      (isCollapsed ? (
                        <div className="mt-1 flex flex-col items-center gap-1">
                          {item.subItems?.map((subItem) => (
                            <Tooltip key={subItem.title}>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  aria-label={subItem.title}
                                  className="text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent border border-transparent hover:border-sidebar-border flex size-7 items-center justify-center rounded-md transition-colors opacity-50"
                                  onClick={() =>
                                    handleSubItemClick(subItem.url)
                                  }
                                >
                                  <subItem.icon className="size-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                {subItem.title}
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      ) : (
                        <SidebarMenuSub>
                          {item.subItems?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild size="sm">
                                <a href={subItem.url}>
                                  <subItem.icon className="size-4" />
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      ))}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

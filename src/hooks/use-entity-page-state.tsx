import { useState, useMemo, useCallback, ReactNode } from "react";
import {
  CalendarViewType,
  OpenInMode,
  SortOrder,
  ViewLayout,
} from "@/types/common";
import { EntityConfig } from "@/lib/entity-config";
import { getFieldConfig } from "@/lib/field-config";
import { ListIcon } from "lucide-react";

export function useEntityPageState<T>(config: EntityConfig<T>) {
  // Basic state
  const [visibleFields, setVisibleFields] = useState<string[]>(
    config.defaultVisibleFields
  );
  const [searchFields, setSearchFields] = useState("");
  const [sortFields, setSortFields] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewLayout, setViewLayout] = useState<ViewLayout>(ViewLayout.TABLE);
  const [currentView, setCurrentView] = useState<"all" | "grouped">("all");
  const [currentIcon, setCurrentIcon] = useState<ReactNode>(<ListIcon />);

  // Grouping
  const supportsGrouping = !!config.grouping;
  const defaultGroups = supportsGrouping
    ? config.grouping!.getGroupValues(config.grouping!.defaultGroupBy)
    : [];

  const [groupBy, setGroupBy] = useState(config.grouping?.defaultGroupBy || "");
  const [sortByGroup, setSortByGroup] = useState<SortOrder>(SortOrder.MANUAL);
  const [hideEmptyGroups, setHideEmptyGroups] = useState(false);
  const [visibleGroups, setVisibleGroups] = useState<string[]>(defaultGroups);
  const [hiddenGroups, setHiddenGroups] = useState<string[]>([]);

  // Calendar state
  const [calendarDateField, setCalendarDateField] = useState<string>(
    config.calendar?.dateField ? String(config.calendar.dateField) : ""
  );
  const [calendarViewType, setCalendarViewType] = useState<CalendarViewType>(
    CalendarViewType.MONTH
  );
  const [openIn, setOpenIn] = useState<OpenInMode>(OpenInMode.SIDE_PANEL);
  const [compactView, setCompactView] = useState(false);

  // Memoized values
  const fieldConfigData = useMemo(
    () => getFieldConfig(config.fields),
    [config.fields]
  );

  const groupViewLabel = useMemo(() => {
    if (!config.grouping) return "";
    return `By ${
      fieldConfigData[config.grouping.defaultGroupBy]?.label || groupBy
    }`;
  }, [config.grouping, fieldConfigData, groupBy]);

  // Get allowed date fields (fields that are date type)
  const allowedDateFields = useMemo(() => {
    // Filter fields that have "date" in their name or are explicitly date fields
    return config.fields.filter((field) => {
      const lowerField = field.toLowerCase();
      return (
        lowerField.includes("date") ||
        lowerField === "closedate" ||
        lowerField === "duedate" ||
        lowerField === "creationdate" ||
        lowerField === "lastupdate"
      );
    });
  }, [config.fields]);

  // Field handlers
  const fieldHandlers = useMemo(
    () => ({
      onHideField: (field: string) =>
        setVisibleFields((prev) => prev.filter((f) => f !== field)),
      onShowField: (field: string) =>
        setVisibleFields((prev) => [...prev, field]),
      onReorderFields: setVisibleFields,
    }),
    []
  );

  // Group handlers
  const groupHandlers = useMemo(
    () => ({
      onHideGroup: (group: string) => {
        setVisibleGroups((prev) => prev.filter((g) => g !== group));
        setHiddenGroups((prev) => [...prev, group]);
      },
      onShowGroup: (group: string) => {
        setHiddenGroups((prev) => prev.filter((g) => g !== group));
        setVisibleGroups((prev) => [...prev, group]);
      },
      onReorderGroups: setVisibleGroups,
      onSortByChange: (val: SortOrder) => {
        setSortByGroup(val);
        setVisibleGroups((prev) =>
          [...prev].sort((a, b) => {
            if (val === SortOrder.ALPHABETICAL) return a.localeCompare(b);
            if (val === SortOrder.REVERSE_ALPHABETICAL)
              return b.localeCompare(a);
            return 0;
          })
        );
      },
    }),
    []
  );

  // Calendar handlers
  const calendarHandlers = useMemo(
    () => ({
      onCalendarDateFieldChange: setCalendarDateField,
      onCalendarViewTypeChange: setCalendarViewType,
      onOpenInChange: setOpenIn,
      onCompactViewChange: setCompactView,
    }),
    []
  );

  // View handlers
  const resetToDefaultView = useCallback(() => {
    setCurrentView("all");
    setViewLayout(ViewLayout.TABLE);
    setCurrentIcon(<ListIcon />);
  }, []);

  const switchToGroupedView = useCallback((icon: ReactNode) => {
    setCurrentView("grouped");
    setViewLayout(ViewLayout.TABLE);
    setCurrentIcon(icon);
  }, []);

  const changeViewLayout = useCallback(
    (layout: ViewLayout, icon: ReactNode) => {
      setViewLayout(layout);
      setCurrentIcon(icon);
    },
    []
  );

  return {
    // State
    visibleFields,
    setVisibleFields,
    searchFields,
    setSearchFields,
    sortFields,
    setSortFields,
    isFilterOpen,
    setIsFilterOpen,
    viewLayout,
    currentView,
    currentIcon,
    groupBy,
    setGroupBy,
    sortByGroup,
    hideEmptyGroups,
    setHideEmptyGroups,
    visibleGroups,
    hiddenGroups,

    // Calendar state
    calendarDateField,
    calendarViewType,
    openIn,
    compactView,
    allowedDateFields,

    // Computed
    supportsGrouping,
    fieldConfigData,
    groupViewLabel,
    groupableFields: config.grouping?.groupableFields || [],
    lockedColumns: [config.primaryField],

    // Handlers
    fieldHandlers,
    groupHandlers,
    calendarHandlers,
    resetToDefaultView,
    switchToGroupedView,
    changeViewLayout,
    openFilter: () => setIsFilterOpen(true),
  };
}

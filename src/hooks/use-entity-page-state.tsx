import { useState, useMemo, useCallback, ReactNode } from "react";
import {
  CalendarViewType,
  OpenInMode,
  SortOrder,
  ViewLayout,
} from "@/types/common";
import { EntityConfig, EntityViewPreset } from "@/lib/entity-config";
import { getDateFields, getFieldConfig } from "@/lib/field-config";
import { ListIcon } from "lucide-react";
import { LABELS, VIEW_TYPES } from "@/lib/constants";

export function useEntityPageState<T>(config: EntityConfig<T>) {
  // Basic state
  const [visibleFields, setVisibleFields] = useState<string[]>(
    config.defaultVisibleFields
  );
  const [searchFields, setSearchFields] = useState("");
  const [sortFields, setSortFields] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewLayout, setViewLayout] = useState<ViewLayout>(ViewLayout.TABLE);
  const [currentView, setCurrentView] = useState<
    typeof VIEW_TYPES.ALL | typeof VIEW_TYPES.GROUPED
  >(VIEW_TYPES.ALL);
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
    return `${LABELS.GROUP_VIEW_PREFIX}${
      fieldConfigData[config.grouping.defaultGroupBy]?.label || groupBy
    }`;
  }, [config.grouping, fieldConfigData, groupBy]);

  // Get allowed date fields (fields that are date type)
  const allowedDateFields = useMemo(() => {
    return getDateFields(config.fields);
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
    setCurrentView(VIEW_TYPES.ALL);
    setViewLayout(ViewLayout.TABLE);
    setCurrentIcon(<ListIcon />);
  }, []);

  const applyViewPreset = useCallback(
    (presetKey?: string | null) => {
      if (!presetKey || !config.viewPresets?.[presetKey]) {
        return false;
      }

      const preset: EntityViewPreset<T> = config.viewPresets[presetKey];
      let applied = false;

      if ((preset.view === VIEW_TYPES.ALL || !preset.view) && presetKey) {
        resetToDefaultView();
        applied = true;
      }

      if (preset.view === VIEW_TYPES.GROUPED && supportsGrouping) {
        setCurrentView(VIEW_TYPES.GROUPED);
        setViewLayout(preset.layout ?? ViewLayout.TABLE);
        setCurrentIcon(<ListIcon />);
        applied = true;

        // ... existing group logic ...
      } else if (preset.layout) {
        setViewLayout(preset.layout);
        applied = true;
      }

      // ... rest of preset logic ...

      return applied;
    },
    [
      // config.grouping,
      config.viewPresets,
      // groupBy,
      resetToDefaultView,
      supportsGrouping,
    ]
  );

  const switchToGroupedView = useCallback((icon: ReactNode) => {
    setCurrentView(VIEW_TYPES.GROUPED);
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
    applyViewPreset,
  };
}

export enum SortBy {
  ASC = "asc",
  DESC = "desc",
}

export enum FilterOperator {
  CONTAINS = "contains",
  DOES_NOT_CONTAIN = "does_not_contain",
  IS_EMPTY = "is_empty",
  IS_NOT_EMPTY = "is_not_empty",
}

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string;
}

export interface SortCondition {
  id: string;
  field: string;
  sortBy: SortBy;
}

export enum SortOrder {
  MANUAL = "manual",
  ALPHABETICAL = "alphabetical",
  REVERSE_ALPHABETICAL = "reverse_alphabetical",
}

export enum ViewLayout {
  TABLE = "table",
  KANBAN = "kanban",
  CALENDAR = "calendar",
}

export enum CalendarViewType {
  WEEK = "week",
  MONTH = "month",
  TIMELINE = "timeline",
}

export enum OpenInMode {
  SIDE_PANEL = "side_panel",
  RECORD_PAGE = "record_page",
}

export enum SortBy {
  ASC = "asc",
  DESC = "desc",
}

export enum FilterOperator {
  CONTAINS = "contains",
  DOES_NOT_CONTAIN = "does_not_contain",
  IS = "is",
  IS_NOT = "is_not",
  IS_EMPTY = "is_empty",
  IS_NOT_EMPTY = "is_not_empty",

  GREATER_THAN_OR_EQUAL = "greater_than_or_equal",
  LESS_THAN_OR_EQUAL = "less_than_or_equal",

  IS_RELATIVE = "is_relative",
  IS_IN_PAST = "is_in_past",
  IS_IN_FUTURE = "is_in_future",
  IS_TODAY = "is_today",
  IS_BEFORE = "IS_BEFORE",
  IS_AFTER = "IS_AFTER",
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

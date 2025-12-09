import { FilterOperator, SortBy, SortOrder } from "@/types/common";

export const SORT_BY_OPTIONS = {
  [SortBy.ASC]: "Ascending",
  [SortBy.DESC]: "Descending",
} as const;

export const FILTER_OPERATOR_OPTIONS = {
  [FilterOperator.CONTAINS]: "Contains",
  [FilterOperator.DOES_NOT_CONTAIN]: "Does not contain",
  [FilterOperator.IS_EMPTY]: "Is empty",
  [FilterOperator.IS_NOT_EMPTY]: "Is not empty",
} as const;

export const SORT_ORDER_OPTIONS = {
  [SortOrder.MANUAL]: "Manual",
  [SortOrder.ALPHABETICAL]: "Alphabetical",
  [SortOrder.REVERSE_ALPHABETICAL]: "Reverse alphabetical",
} as const;

export const COLUMN_IDS = {
  SELECT: "select",
  ADD_COLUMN: "add-column",
} as const;

export const RESERVED_FIELDS = {
  ID: "id",
} as const;

export const VIEW_TYPES = {
  ALL: "all",
  GROUPED: "grouped",
} as const;

export const DATE_FIELD_NAMES = {
  CLOSE_DATE: "closeDate",
  DUE_DATE: "dueDate",
  CREATION_DATE: "creationDate",
  LAST_UPDATE: "lastUpdate",
} as const;

export const DATE_FIELD_NAMES_LOWER = Object.values(DATE_FIELD_NAMES).map(
  (name) => name.toLowerCase()
);

export const LABELS = {
  GROUP_VIEW_PREFIX: "By ",
} as const;

export const DEFAULTS = {
  COLUMN_MIN_SIZE: 200,
  SELECT_COLUMN_SIZE: 48,
  ADD_COLUMN_SIZE: 1000,
} as const;

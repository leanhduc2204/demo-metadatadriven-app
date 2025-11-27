import { FilterOperator, SortBy } from "@/types/common";

export const SORT_BY_OPTIONS = {
  [SortBy.ASC]: "Ascending",
  [SortBy.DESC]: "Descending",
};

export const FILTER_OPERATOR_OPTIONS = {
  [FilterOperator.CONTAINS]: "Contains",
  [FilterOperator.DOES_NOT_CONTAIN]: "Does not contain",
  [FilterOperator.IS_EMPTY]: "Is empty",
  [FilterOperator.IS_NOT_EMPTY]: "Is not empty",
};

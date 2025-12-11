import { FilterOperator } from "@/types/common";
import { FieldType } from "./field-config";

export const FIELD_TYPE_OPERATORS = {
  [FieldType.TEXT]: [
    FilterOperator.CONTAINS,
    FilterOperator.DOES_NOT_CONTAIN,
    FilterOperator.IS_EMPTY,
    FilterOperator.IS_NOT_EMPTY,
  ],
  [FieldType.NUMBER]: [
    FilterOperator.GREATER_THAN_OR_EQUAL,
    FilterOperator.LESS_THAN_OR_EQUAL,
    FilterOperator.IS_EMPTY,
    FilterOperator.IS_NOT_EMPTY,
  ],
  [FieldType.ARRAY]: [
    FilterOperator.IS,
    FilterOperator.IS_NOT,
    FilterOperator.IS_EMPTY,
    FilterOperator.IS_NOT_EMPTY,
  ],
  [FieldType.DATE]: [
    FilterOperator.IS,
    FilterOperator.IS_RELATIVE,
    FilterOperator.IS_IN_PAST,
    FilterOperator.IS_IN_FUTURE,
    FilterOperator.IS_TODAY,
    FilterOperator.IS_BEFORE,
    FilterOperator.IS_AFTER,
    FilterOperator.IS_EMPTY,
    FilterOperator.IS_NOT_EMPTY,
  ],
};

export function getAvailableOperators(fieldType: FieldType): FilterOperator[] {
  return (
    FIELD_TYPE_OPERATORS[fieldType] || FIELD_TYPE_OPERATORS[FieldType.TEXT]
  );
}

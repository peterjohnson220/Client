import { Field, generateMockField, FieldDataType } from './field.model';
import { FilterOperator, Between, Equals, Contains } from './filter-operators.model';

export interface Filter {
  Field: Field;
  Operator: FilterOperator;
  Options: string[];
  SelectedOptions: string[];
  IsValid: boolean;
}

export function getDefaultOperatorByDataType(field: Field): FilterOperator {
  switch (field.DataType) {
    case FieldDataType.Date:
      return Between;
    case FieldDataType.LongString:
      return Contains;
    default:
      return Equals;
  }
}

export function generateMockFilter(): Filter {
  return {
    Field: generateMockField(),
    Operator: Equals,
    Options: [],
    SelectedOptions: [],
    IsValid: false
  };
}

export function validateFilter(filter: Filter): boolean {
  switch (filter.Operator) {
    case Between:
      return !!filter.SelectedOptions.length && filter.SelectedOptions.length === 2;
    default:
      return !!filter.SelectedOptions.length;
  }
}

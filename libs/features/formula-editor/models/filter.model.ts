import { Field, generateMockField, FieldDataType } from './field.model';

import { FilterOperator, Between, Equals, Contains, IsTrueFalse, IsNullOrEmpty, IsNotNullOrEmpty } from './filter-operators.model';

export interface Filter {
  Field: Field;
  Operator: FilterOperator;
  Options: string[];
  SelectedOptions: string[];
  IsValid: boolean;
  IsLocked: boolean;
}

export function generateDefaultFilter(field: Field): Filter {
  return {
    Field: field,
    Operator: getDefaultOperatorByDataType(field),
    Options: [],
    SelectedOptions: [],
    IsValid: false,
    IsLocked: false
  };
}

export function getDefaultOperatorByDataType(field: Field): FilterOperator {
  switch (field.DataType) {
    case FieldDataType.Date:
      return Between;
    case FieldDataType.LongString:
      return Contains;
    case FieldDataType.Bit:
      return IsTrueFalse;
    default:
      return Equals;
  }
}

export function getDefaultSelectedOptions(dataType: FieldDataType): string[] {
  return dataType === FieldDataType.Bit ? ['true'] : [];
}

export function getDefaultIsValid(dataType: FieldDataType): boolean {
  return dataType === FieldDataType.Bit;
}

export function generateMockFilter(): Filter {
  return {
    Field: generateMockField(),
    Operator: Equals,
    Options: [],
    SelectedOptions: [],
    IsValid: false,
    IsLocked: false
  };
}

export function validateFilter(filter: Filter): boolean {
  switch (filter.Operator) {
    case Between:
      return !!filter.SelectedOptions.length && filter.SelectedOptions.length === 2;
    case IsNullOrEmpty:
      return true;
    case IsNotNullOrEmpty:
      return true;
    default:
      return !!filter.SelectedOptions.length;
  }
}

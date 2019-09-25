import { Field } from './field.model';
import { FilterOperator, BetweenOperator, EqualsOperator } from './filter-operators.model';
import { DataViewFieldDataType } from 'libs/models/payfactors-api';

export interface Filter {
  Field: Field;
  Operator: FilterOperator;
  Options: string[];
  SelectedOptions: string[];
}

export function getDefaultOperatorByDataType(field: Field): FilterOperator {
  switch (field.DataType) {
    case DataViewFieldDataType.DateTime:
      return BetweenOperator;
    default:
      return EqualsOperator;
  }
}

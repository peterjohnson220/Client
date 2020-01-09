import { ViewField } from 'libs/models/payfactors-api';

export interface FilterOperator {
  display: string;
  value: string;
  requiresValue: boolean; // used for operators like is empty, is not empty, etc.
  defaultOperatorForType: boolean;
}

const dateFilterOperators: FilterOperator[] = [
  { display: 'Is equal to', value: '=', requiresValue: true, defaultOperatorForType: false },
  { display: 'Is not equal to', value: '<>', requiresValue: true, defaultOperatorForType: false },
  { display: 'Is after or equal to', value: '>=', requiresValue: true, defaultOperatorForType: true },
  { display: 'Is after', value: '>', requiresValue: true, defaultOperatorForType: false },
  { display: 'Is before or equal to', value: '<=', requiresValue: true, defaultOperatorForType: false },
  { display: 'Is before', value: '<', requiresValue: true, defaultOperatorForType: false },
  { display: 'Is empty', value: 'isempty', requiresValue: false, defaultOperatorForType: false },
  { display: 'Is not empty', value: 'isnotempty', requiresValue: false, defaultOperatorForType: false }
];

const textFilterOperators: FilterOperator[] = [
  { display: 'Is equal to', value: '=', requiresValue: true, defaultOperatorForType: false },
  { display: 'Is not equal to', value: '<>', requiresValue: true, defaultOperatorForType: false },
  { display: 'Contains', value: 'contains', requiresValue: true, defaultOperatorForType: true },
  { display: 'Does not contain', value: 'notcontains', requiresValue: true, defaultOperatorForType: false },
  { display: 'Starts with', value: 'startswith', requiresValue: true, defaultOperatorForType: false },
  { display: 'Ends with', value: 'endswith', requiresValue: true, defaultOperatorForType: false },
  { display: 'Is empty', value: 'isempty', requiresValue: false, defaultOperatorForType: false },
  { display: 'Is not empty', value: 'isnotempty', requiresValue: false, defaultOperatorForType: false }
];

const numericFilterOperators: FilterOperator[] = [
  { display: 'Is equal to', value: '=', requiresValue: true, defaultOperatorForType: true },
  { display: 'Is not equal to', value: '<>', requiresValue: true, defaultOperatorForType: false },
  { display: 'Is greater than or equal to', value: '>=', requiresValue: true, defaultOperatorForType: false },
  { display: 'Is greater than', value: '>', requiresValue: true, defaultOperatorForType: false },
  { display: 'Is less than or equal to', value: '<=', requiresValue: true, defaultOperatorForType: false },
  { display: 'Is less than', value: '<', requiresValue: true, defaultOperatorForType: false },
  { display: 'Is empty', value: 'isempty', requiresValue: false, defaultOperatorForType: false },
  { display: 'Is not empty', value: 'isnotempty', requiresValue: false, defaultOperatorForType: false }
];

const booleanFilterOperators: FilterOperator[] = [
  { display: 'Is equal to', value: '=', requiresValue: true, defaultOperatorForType: true }
]

export const FilterOperatorOptions = {
  dateTime: dateFilterOperators,
  string: textFilterOperators,
  int: numericFilterOperators,
  bit: booleanFilterOperators
};

export function isValueRequired(field: ViewField) {
  return field.DataType && FilterOperatorOptions[field.DataType] ?
  FilterOperatorOptions[field.DataType].filter(o => field.FilterOperator === o.value)[0].requiresValue
  : true;
}

export function getDefaultFilterOperator(field: ViewField) {
  return FilterOperatorOptions[field.DataType] ?
  FilterOperatorOptions[field.DataType].find(f => f.defaultOperatorForType).value :
  null;
}

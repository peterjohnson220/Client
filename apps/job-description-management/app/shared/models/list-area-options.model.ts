export const NumericOperatorOptions: FilterOperator[] = [
  { display: 'Is equal to', value: 'eq', checkValue: true},
  { display: 'Is not equal to', value: 'neq', checkValue: true},
  { display: 'Is greater than or equal to', value: 'gte', checkValue: true},
  { display: 'Is greater than', value: 'gt', checkValue: true},
  { display: 'Is less than or equal to', value: 'lte', checkValue: true},
  { display: 'Is less than', value: 'lt', checkValue: true},
  { display: 'Is empty', value: 'isempty', checkValue: false},
  { display: 'Is not empty', value: 'isnotempty', checkValue: false}
];

export const DateOperatorOptions: FilterOperator[] = [
  { display: 'Is equal to', value: 'eq', checkValue: true},
  { display: 'Is not equal to', value: 'neq', checkValue: true},
  { display: 'Is after or equal to', value: 'gte', checkValue: true},
  { display: 'Is after', value: 'gt', checkValue: true},
  { display: 'Is before or equal to', value: 'lte', checkValue: true},
  { display: 'Is before', value: 'lt', checkValue: true},
  { display: 'Is empty', value: 'isempty', checkValue: false},
  { display: 'Is not empty', value: 'isnotempty', checkValue: false}
];

export const TextOperatorOptions: FilterOperator[] = [
  { display: 'Is equal to', value: 'eq', checkValue: true},
  { display: 'Is not equal to', value: 'neq', checkValue: true},
  { display: 'Contains', value: 'contains', checkValue: true},
  { display: 'Does not contain', value: 'doesnotcontain', checkValue: true},
  { display: 'Starts With', value: 'startswith', checkValue: true},
  { display: 'Ends with', value: 'endswith', checkValue: true},
  { display: 'Is empty', value: 'isempty', checkValue: false},
  { display: 'Is not empty', value: 'isnotempty', checkValue: false}
];

export const BooleanOperatorOptions: FilterOperator[] = [
  { display: 'Is equal to', value: 'eq', checkValue: true}
];

export interface FilterOperator {
  display: string;
  value: string;
  checkValue: boolean;
}

export function generateMockFilterOperator(): FilterOperator {
  return {
    display: 'Test Display',
    value: 'Test Value',
    checkValue: false
  };
}

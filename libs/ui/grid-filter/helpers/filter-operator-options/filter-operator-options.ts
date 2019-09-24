export interface FilterOperator {
  display: string;
  value: string;
  requiresValue: boolean; // used for operators like is empty, is not empty, etc.
}

const dateFilterOperators: FilterOperator[] = [
  { display: 'Is equal to', value: 'eq', requiresValue: true},
  { display: 'Is not equal to', value: 'neq', requiresValue: true},
  { display: 'Is after or equal to', value: 'gte', requiresValue: true},
  { display: 'Is after', value: 'gt', requiresValue: true},
  { display: 'Is before or equal to', value: 'lte', requiresValue: true},
  { display: 'Is before', value: 'lt', requiresValue: true},
  { display: 'Is empty', value: 'isempty', requiresValue: false},
  { display: 'Is not empty', value: 'isnotempty', requiresValue: false}
];

const textFilterOperators: FilterOperator[] = [
  { display: 'Is equal to', value: 'eq', requiresValue: true},
  { display: 'Is not equal to', value: 'neq', requiresValue: true},
  { display: 'Contains', value: 'contains', requiresValue: true},
  { display: 'Does not contain', value: 'doesnotcontain', requiresValue: true},
  { display: 'Starts With', value: 'startswith', requiresValue: true},
  { display: 'Ends with', value: 'endswith', requiresValue: true},
  { display: 'Is empty', value: 'isempty', requiresValue: false},
  { display: 'Is not empty', value: 'isnotempty', requiresValue: false}
];
const numericFilterOperators: FilterOperator[] = [
  { display: 'Is equal to', value: 'eq', requiresValue: true},
  { display: 'Is not equal to', value: 'neq', requiresValue: true},
  { display: 'Is greater than or equal to', value: 'gte', requiresValue: true},
  { display: 'Is greater than', value: 'gt', requiresValue: true},
  { display: 'Is less than or equal to', value: 'lte', requiresValue: true},
  { display: 'Is less than', value: 'lt', requiresValue: true},
  { display: 'Is empty', value: 'isempty', requiresValue: false},
  { display: 'Is not empty', value: 'isnotempty', requiresValue: false}
];

export const FilterOperatorOptions = {
  date: dateFilterOperators,
  text: textFilterOperators,
  numeric: numericFilterOperators
};

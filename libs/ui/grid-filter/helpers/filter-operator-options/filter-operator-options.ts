export interface FilterOperator {
  display: string;
  value: string;
  requiresValue: boolean; // used for operators like is empty, is not empty, etc.
}

const dateFilterOperators: FilterOperator[] = [
  { display: 'Is equal to', value: '=', requiresValue: true},
  { display: 'Is not equal to', value: '<>', requiresValue: true},
  { display: 'Is after or equal to', value: '>=', requiresValue: true},
  { display: 'Is after', value: '>', requiresValue: true},
  { display: 'Is before or equal to', value: '<=', requiresValue: true},
  { display: 'Is before', value: '<', requiresValue: true}
];

const textFilterOperators: FilterOperator[] = [
  { display: 'Is equal to', value: '=', requiresValue: true},
  { display: 'Is not equal to', value: '<>', requiresValue: true}
];
const numericFilterOperators: FilterOperator[] = [
  { display: 'Is equal to', value: '=', requiresValue: true},
  { display: 'Is not equal to', value: '<>', requiresValue: true},
  { display: 'Is greater than or equal to', value: '>=', requiresValue: true},
  { display: 'Is greater than', value: '>', requiresValue: true},
  { display: 'Is less than or equal to', value: '<=', requiresValue: true},
  { display: 'Is less than', value: '<', requiresValue: true}
];

export const FilterOperatorOptions = {
  dateTime: dateFilterOperators,
  string: textFilterOperators,
  int: numericFilterOperators
};

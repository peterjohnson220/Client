export interface FilterOperator {
  display: string;
  value: string;
  requiresValue: boolean; // used for operators like is empty, is not empty, etc.
  defaultOperatorForType: boolean;
}

const dateFilterOperators: FilterOperator[] = [
  { display: 'Is equal to', value: '=', requiresValue: true, defaultOperatorForType: false},
  { display: 'Is not equal to', value: '<>', requiresValue: true, defaultOperatorForType: false},
  { display: 'Is after or equal to', value: '>=', requiresValue: true, defaultOperatorForType: true},
  { display: 'Is after', value: '>', requiresValue: true, defaultOperatorForType: false},
  { display: 'Is before or equal to', value: '<=', requiresValue: true, defaultOperatorForType: false},
  { display: 'Is before', value: '<', requiresValue: true, defaultOperatorForType: false}
];

const textFilterOperators: FilterOperator[] = [
  { display: 'Is equal to', value: '=', requiresValue: true, defaultOperatorForType: true},
  { display: 'Is not equal to', value: '<>', requiresValue: true, defaultOperatorForType: false},
];

const numericFilterOperators: FilterOperator[] = [
  { display: 'Is equal to', value: '=', requiresValue: true, defaultOperatorForType: true},
  { display: 'Is not equal to', value: '<>', requiresValue: true, defaultOperatorForType: false},
  { display: 'Is greater than or equal to', value: '>=', requiresValue: true, defaultOperatorForType: false},
  { display: 'Is greater than', value: '>', requiresValue: true, defaultOperatorForType: false},
  { display: 'Is less than or equal to', value: '<=', requiresValue: true, defaultOperatorForType: false},
  { display: 'Is less than', value: '<', requiresValue: true, defaultOperatorForType: false}
];

export const FilterOperatorOptions = {
  dateTime: dateFilterOperators,
  string: textFilterOperators,
  int: numericFilterOperators
};

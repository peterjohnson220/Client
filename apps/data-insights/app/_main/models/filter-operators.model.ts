export interface FilterOperator {
  Name: string;
  Value: string;
}

export const Equals: FilterOperator = {
  Name: 'equals',
  Value: 'in'
};

export const DoesNotEqual: FilterOperator = {
  Name: 'does not equal',
  Value: 'notin'
};

export const Between: FilterOperator = {
  Name: 'between',
  Value: 'between'
};

export const GreaterThan: FilterOperator = {
  Name: 'greater than',
  Value: '>'
};

export const GreaterThanOrEqual: FilterOperator = {
  Name: 'greater than or equal',
  Value: '>='
};

export const LessThan: FilterOperator = {
  Name: 'less than',
  Value: '<'
};

export const LessThanOrEqual: FilterOperator = {
  Name: 'less than or equal',
  Value: '<='
};

export const IsBefore: FilterOperator = {
  Name: 'is before',
  Value: '<'
};

export const IsAfter: FilterOperator = {
  Name: 'is after',
  Value: 'isafterdate'
};

export const Is: FilterOperator = {
  Name: 'is',
  Value: 'isdate'
};

export const Contains: FilterOperator = {
  Name: 'contains',
  Value: 'contains'
};

export const DoesNotContain: FilterOperator = {
  Name: 'does not contain',
  Value: 'notcontains'
};

export const IsTrueFalse: FilterOperator = {
  Name: 'is',
  Value: '='
};


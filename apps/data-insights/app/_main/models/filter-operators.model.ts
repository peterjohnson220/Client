export interface FilterOperator {
  Name: string;
  Value: string;
}

export const EqualsOperator: FilterOperator = {
  Name: 'equals',
  Value: 'in'
};

export const BetweenOperator: FilterOperator = {
  Name: 'between',
  Value: 'between'
};

export const GreaterThanOperator: FilterOperator = {
  Name: 'greater than',
  Value: '>'
};

export const GreaterThanOrEqualOperator: FilterOperator = {
  Name: 'greater than or equal',
  Value: '>='
};

export const LessThanOperator: FilterOperator = {
  Name: 'less than',
  Value: '<'
};

export const LessThanOrEqualOperator: FilterOperator = {
  Name: 'less than or equal',
  Value: '<='
};


export function getFilterOperatorByValue(value: string): FilterOperator {
  switch (value) {
    case 'in': {
      return EqualsOperator;
    }
    case 'between': {
      return BetweenOperator;
    }
    case '>': {
      return GreaterThanOperator;
    }
    case '<': {
      return LessThanOperator;
    }
    case '>=': {
      return GreaterThanOrEqualOperator;
    }
    case '<=': {
      return LessThanOrEqualOperator;
    }
    default: {
      return EqualsOperator;
    }
  }
}

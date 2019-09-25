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

export function getFilterOperatorByValue(value: string): FilterOperator {
  switch (value) {
    case 'in': {
      return EqualsOperator;
    }
    case 'between': {
      return BetweenOperator;
    }
    default: {
      return EqualsOperator;
    }
  }
}

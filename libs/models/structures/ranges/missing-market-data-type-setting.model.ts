import { MissingMarketDataTypes } from 'libs/constants/structures/missing-market-data-type';

export interface MissingMarketDataTypeSetting {
  Type: MissingMarketDataTypes;
  Percentage: number;
}

export function generateMockMissingMarketDataTypeSetting(): MissingMarketDataTypeSetting {
  return {
    Type: MissingMarketDataTypes.LeaveValuesBlank,
    Percentage: 0
  };
}

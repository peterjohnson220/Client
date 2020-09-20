import { MissingMarketDataTypes } from 'libs/constants/structures/missing-market-data-type';

export interface MissingMarketDataTypeSetting {
  Type: MissingMarketDataTypes;
  Percentage: number;
}

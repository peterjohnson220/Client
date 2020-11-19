import { MissingMarketDataTypes } from '../../constants/structures/missing-market-data-type';

export interface MissingMarketDataTypeSettingForm {
  Type: MissingMarketDataTypes;
  IncreaseMidpointByPercentage: number;
  DecreasePercentFromNextLevelPercentage: number;
  IncreasePercentFromPreviousLevelPercentage: number;
}

export function generateMissingMarketDataTypeSettingForm(): MissingMarketDataTypeSettingForm {
  return {
    Type: MissingMarketDataTypes.LeaveValuesBlank,
    IncreaseMidpointByPercentage: 0,
    DecreasePercentFromNextLevelPercentage: 0,
    IncreasePercentFromPreviousLevelPercentage: 0
  };
}

import { MissingMarketDataTypes } from 'libs/constants/structures/missing-market-data-type';

export class AdvancedModelingHelper {
  static setMissingMarketDataTypeValue(missingMarketDataType: string): number {
    switch (missingMarketDataType) {
      case 'LeaveValuesBlank': {
        return MissingMarketDataTypes.LeaveValuesBlank;
      }
      case 'UseRegressionCalculation': {
        return MissingMarketDataTypes.UseRegressionCalculation;
      }
      case 'IncreaseMidpointByPercent': {
        return MissingMarketDataTypes.IncreaseMidpointByPercent;
      }
      case 'DecreasePercentFromNextLevel': {
        return MissingMarketDataTypes.DecreasePercentFromNextLevel;
      }
      case 'IncreasePercentFromPreviousLevel': {
        return MissingMarketDataTypes.IncreasePercentFromPreviousLevel;
      }
      case 'UsePublishedRange': {
        return MissingMarketDataTypes.UsePublishedRange;
      }
    }
  }
}

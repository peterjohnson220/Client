import { RoundingSettingsDataObj } from '../../../structures/ranges';

export interface ConvertCurrencyAndRateRequestModel {
  OldCurrency: string;
  NewCurrency: string;
  OldRate: string;
  NewRate: string;
  Rounding: RoundingSettingsDataObj;
  RangeDistributionTypeId: number;
  JobRangeData: any[];
}

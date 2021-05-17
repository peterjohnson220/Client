export interface ConvertCurrencyAndRateRequestModel {
  OldCurrency: string;
  NewCurrency: string;
  OldRate: string;
  NewRate: string;
  RangeDistributionTypeId: number;
  JobRangeData: any[];
  RangeGroupId: number;
  RangeTypeId: number;
}

import { PercentageSetting, MissingMarketDataTypeSetting, RoundingSetting } from '../../../structures/ranges';


export interface AdvancedSettingsResponse {
  CompanyStructuresRangeGroupId: number;
  CompanyId: number;
  PreventMidsBelowCurrent: boolean;
  PreventMidsFromIncreasingMoreThanPercent: PercentageSetting;
  PreventMidsFromIncreasingWithinPercentOfNextLevel: PercentageSetting;
  MissingMarketDataType: MissingMarketDataTypeSetting;
  Min: RoundingSetting;
  Mid: RoundingSetting;
  MaxFirstTertile: RoundingSetting;
  SecondTertile: RoundingSetting;
  FirstQuartile: RoundingSetting;
  SecondQuartile: RoundingSetting;
  FirstQuintile: RoundingSetting;
  SecondQuintile: RoundingSetting;
  ThirdQuintile: RoundingSetting;
  FourthQuintile: RoundingSetting;
}

import {
  PercentageSetting,
  MissingMarketDataTypeSetting,
  RoundingSetting,
  generateMockPercentageSetting, generateMockMissingMarketDataTypeSetting, generateMockRoundingSetting
} from '../../../structures/ranges';


export interface AdvancedSettingResponse {
  CompanyStructuresRangeGroupId: number;
  CompanyId: number;
  PreventMidsBelowCurrent: boolean;
  PreventMidsFromIncreasingMoreThanPercent: PercentageSetting;
  PreventMidsFromIncreasingWithinPercentOfNextLevel: PercentageSetting;
  MissingMarketDataType: MissingMarketDataTypeSetting;
  Min: RoundingSetting;
  Mid: RoundingSetting;
  Max: RoundingSetting;
  FirstTertile: RoundingSetting;
  SecondTertile: RoundingSetting;
  FirstQuartile: RoundingSetting;
  SecondQuartile: RoundingSetting;
  FirstQuintile: RoundingSetting;
  SecondQuintile: RoundingSetting;
  ThirdQuintile: RoundingSetting;
  FourthQuintile: RoundingSetting;
}

export function generateMockRangeAdvancedSettingResponse(): AdvancedSettingResponse {
  return  {
    CompanyStructuresRangeGroupId: 0,
    CompanyId: 0,
    PreventMidsBelowCurrent: false,
    PreventMidsFromIncreasingMoreThanPercent: generateMockPercentageSetting(),
    PreventMidsFromIncreasingWithinPercentOfNextLevel: generateMockPercentageSetting(),
    MissingMarketDataType: generateMockMissingMarketDataTypeSetting(),
    Min: generateMockRoundingSetting(),
    Mid: generateMockRoundingSetting(),
    Max: generateMockRoundingSetting(),
    FirstTertile: generateMockRoundingSetting(),
    SecondTertile: generateMockRoundingSetting(),
    FirstQuartile: generateMockRoundingSetting(),
    SecondQuartile: generateMockRoundingSetting(),
    FirstQuintile: generateMockRoundingSetting(),
    SecondQuintile: generateMockRoundingSetting(),
    ThirdQuintile: generateMockRoundingSetting(),
    FourthQuintile: generateMockRoundingSetting()
  };
}

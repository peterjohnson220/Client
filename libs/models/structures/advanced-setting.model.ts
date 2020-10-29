import { generateMockRoundingSettingsDataObj, PercentageSetting, RoundingSettingsDataObj } from 'libs/models/structures/ranges';
import { MissingMarketDataTypeSetting } from 'libs/models/structures/ranges/missing-market-data-type-setting.model';
import { MissingMarketDataTypes } from 'libs/constants/structures/missing-market-data-type';


export interface AdvancedSetting {
  Rounding: RoundingSettingsDataObj;
  PreventMidsBelowCurrent: boolean;
  PreventMidsFromIncreasingMoreThanPercent: PercentageSetting;
  PreventMidsFromIncreasingWithinPercentOfNextLevel: PercentageSetting;
  MissingMarketDataType: MissingMarketDataTypeSetting;
}

export function generateMockRangeAdvancedSetting(): AdvancedSetting {
  return {
    Rounding: generateMockRoundingSettingsDataObj(),
    PreventMidsBelowCurrent: false,
    PreventMidsFromIncreasingMoreThanPercent: { Percentage: 0, Enabled: false }, // generateMockPercentageSetting(),
    PreventMidsFromIncreasingWithinPercentOfNextLevel: { Percentage: 0, Enabled: false }, // generateMockPercentageSetting(),
    MissingMarketDataType: { Percentage: 0, Type: MissingMarketDataTypes.LeaveValuesBlank},
  };
}

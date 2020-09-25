import {
  generateMockMissingMarketDataTypeSetting,
  generateMockPercentageSetting,
  generateMockRoundingSettingsDataObj,
  PercentageSetting,
  RoundingSettingsDataObj
} from 'libs/models/structures/ranges';
import { MissingMarketDataTypeSetting } from 'libs/models/structures/ranges/missing-market-data-type-setting.model';

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
    PreventMidsFromIncreasingMoreThanPercent: generateMockPercentageSetting(),
    PreventMidsFromIncreasingWithinPercentOfNextLevel: generateMockPercentageSetting(),
    MissingMarketDataType: generateMockMissingMarketDataTypeSetting(),
  };
}

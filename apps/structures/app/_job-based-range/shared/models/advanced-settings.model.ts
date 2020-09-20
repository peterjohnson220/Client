import { PercentageSetting, RoundingSettingsDataObj } from 'libs/models/structures/ranges';
import { MissingMarketDataTypeSetting } from 'libs/models/structures/ranges/missing-market-data-type-setting.model';

export interface AdvancedSettings {
  Rounding: RoundingSettingsDataObj;
  PreventMidsBelowCurrent: boolean;
  PreventMidsFromIncreasingMoreThanPercent: PercentageSetting;
  PreventMidsFromIncreasingWithinPercentOfNextLevel: PercentageSetting;
  MissingMarketDataType: MissingMarketDataTypeSetting;
}

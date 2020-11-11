import { generateMockRoundingSettingsDataObj, PercentageSetting, RoundingSettingsDataObj } from 'libs/models/structures/ranges';
import { MissingMarketDataTypes } from 'libs/constants/structures/missing-market-data-type';

import { MissingMarketDataTypeSettingForm } from './missing-market-data-type-setting-form.model';


export interface AdvancedModelSettingForm {
  Rounding: RoundingSettingsDataObj;
  PreventMidsBelowCurrent: boolean;
  PreventMidsFromIncreasingMoreThanPercent: PercentageSetting;
  PreventMidsFromIncreasingWithinPercentOfNextLevel: PercentageSetting;
  MissingMarketDataType: MissingMarketDataTypeSettingForm;
}

export function generateMockRangeAdvancedSetting(): AdvancedModelSettingForm {
  return {
    Rounding: generateMockRoundingSettingsDataObj(),
    PreventMidsBelowCurrent: false,
    PreventMidsFromIncreasingMoreThanPercent:
      {
        Percentage: 0,
        Enabled: false
      }, // generateMockPercentageSetting(),
    PreventMidsFromIncreasingWithinPercentOfNextLevel:
      {
        Percentage: 0,
        Enabled: false
      }, // generateMockPercentageSetting(),
    MissingMarketDataType: {
      Type: MissingMarketDataTypes.LeaveValuesBlank,
      IncreaseMidpointByPercentage: 0,
      DecreasePercentFromNextLevelPercentage: 0,
      IncreasePercentFromPreviousLevelPercentage: 0
    },
  };
}

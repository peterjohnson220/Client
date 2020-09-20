import { RoundRangesRequest } from './round-ranges-request.model';
import { PercentageSetting } from '../../../structures/ranges';
import { MissingMarketDataTypeSetting } from '../../../structures/ranges/missing-market-data-type-setting.model';

export interface AdvancedSettingsRequest {
  Rounding: RoundRangesRequest;
  PreventMidsBelowCurrent: boolean;
  PreventMidsFromIncreasingMoreThanPercent: PercentageSetting;
  PreventMidsFromIncreasingWithinPercentOfNextLevel: PercentageSetting;
  MissingMarketDataType: MissingMarketDataTypeSetting;
}


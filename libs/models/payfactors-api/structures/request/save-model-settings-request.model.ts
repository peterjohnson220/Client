import { RoundRangesRequest } from './round-ranges-request.model';
import { RangeDistributionSetting } from '..';
import { AdvancedSettingsRequest } from './advanced-settings-request.model';

export interface SaveModelSettingsRequest {
  RangeGroupId: number;
  StructureName: string;
  ModelName: string;
  PayType: string;
  ControlPoint: string;
  Rate: string;
  RangeSpreadMin: number;
  RangeSpreadMax: number;
  CurrencyCode: string;
  Rounding: RoundRangesRequest;
  AdvancedSettings: AdvancedSettingsRequest;
  RangeDistributionTypeId: number;
  RangeDistributionSetting: RangeDistributionSetting;
}

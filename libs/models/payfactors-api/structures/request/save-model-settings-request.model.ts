import { RoundRangesRequest } from './round-ranges-request.model';
import { AdvancedSettingRequest } from './advanced-setting-request.model';
import { RangeDistributionSettingRequest } from './range-distribution-setting-request.model';

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
  AdvancedSetting: AdvancedSettingRequest;
  RangeDistributionTypeId: number;
  RangeDistributionSetting: RangeDistributionSettingRequest;
}

import { AdvancedSettingRequest } from './advanced-setting-request.model';

export interface CreateGradeBasedModelSettingsRequest {
  RangeGroupId: number;
  ModelName: string;
  PayType: string;
  ControlPoint: string;
  Rate: string;
  GradeCount: number;
  RangeSpread: number;
  Midpoint: number;
  MidpointProgression: number;
  CurrencyCode: string;
  AdvancedSetting: AdvancedSettingRequest;
  RangeDistributionTypeId: number;
}
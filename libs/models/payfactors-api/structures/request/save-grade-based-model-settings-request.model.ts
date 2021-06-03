import { AdvancedSettingRequest } from './advanced-setting-request.model';

export interface SaveGradeBasedModelSettingsRequest {
  RangeGroupId: number;
  ModelName: string;
  PayType: string;
  ControlPoint: string;
  Rate: string;
  CurrencyCode: string;
  AdvancedSetting: AdvancedSettingRequest;
  RangeDistributionTypeId: number;
  GradeCount: number;
  RangeSpread: number;
  Midpoint: number;
  MidpointProgression: number;
  IsNewModel: boolean;
}

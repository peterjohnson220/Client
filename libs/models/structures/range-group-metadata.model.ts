import { RangeDistributionType } from '../payfactors-api';
import { AdvancedModelSettingForm } from './advanced-model-setting-form.model';
import { RangeDistributionSettingForm } from './range-distribution-setting-form.model';
import { AdjustMidpointSettingForm } from './adjust-midpoint-setting-form.model';

export interface RangeGroupMetadata {
  Paymarket: string;
  PaymarketId: number;
  StructureName: string;
  ModelName: string;
  Currency: string;
  Rate: string;
  PayType: string;
  ControlPoint: string;
  ControlPointDisplay: string;
  SpreadMin: number;
  SpreadMax: number;
  IsCurrent: boolean;
  RangeDistributionTypeId: number;
  RangeTypeId: number;
  ExchangeId: number;
  RangeDistributionTypes: RangeDistributionType[];
  RangeDistributionSetting: RangeDistributionSettingForm;
  RangeAdvancedSetting: AdvancedModelSettingForm;
  StartingMidpoint: number;
  MidpointProgression: number;
  AdjustMidpointSetting: AdjustMidpointSettingForm;
}

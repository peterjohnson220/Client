import { RangeDistributionType, RangeDistributionSetting } from '../payfactors-api';
import { AdvancedModelSettingForm } from './advanced-model-setting-form.model';

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
  RangeDistributionTypes: RangeDistributionType[];
  RangeDistributionSetting: RangeDistributionSetting;
  RangeAdvancedSetting: AdvancedModelSettingForm;
}

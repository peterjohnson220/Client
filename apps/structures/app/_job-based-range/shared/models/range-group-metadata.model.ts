import { RangeDistributionType, RangeDistributionSetting } from 'libs/models/payfactors-api';
import { AdvancedSetting } from './advanced-setting.model';

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
  RangeAdvancedSetting: AdvancedSetting;
}

import { RangeDistributionType, RangeDistributionTypeSetting } from 'libs/models/payfactors-api';

export interface RangeGroupMetadata {
  Paymarket: string;
  PaymarketId: number;
  StructureName: string;
  ModelName: string;
  Currency: string;
  Rate: string;
  ControlPoint: string;
  ControlPointDisplay: string;
  SpreadMin: number;
  SpreadMax: number;
  IsCurrent: boolean;
  RangeDistributionTypeId: number;
  RangeDistributionTypes: RangeDistributionType[];
  RangeDistributionTypeSetting: RangeDistributionTypeSetting;
}

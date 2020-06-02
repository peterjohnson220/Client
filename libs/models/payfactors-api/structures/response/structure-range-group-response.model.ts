import { RangeDistributionType, generateMockStructureRangeDistributionTypes} from './structure-range-distribution-type.model';
import {RangeDistributionTypeSetting, generateMockRangeDistributionTypeSetting } from './range-distribution-type-setting.model';

export interface StructureRangeGroupResponse {
  CompanyStructuresRangeGroupId: number;
  CompanyId: number;
  CompanyStructuresId: number;
  CompanyPayMarketId: number;
  PayMarket: string;
  RangeGroupName: string;
  Currency: string;
  Rate: string;
  ControlPoint: string;
  IsPublished: boolean;
  IsCurrent: boolean;
  EffectiveDate: Date;
  StructureName: string;
  RangeSpreadMin: number;
  RangeSpreadMax: number;
  RangeDistributionTypeId: number;
  RangeDistributionTypes: RangeDistributionType[];
  RangeDistributionTypeSetting: RangeDistributionTypeSetting;
}

export function generateMockCompanyStructureRangeGroup(): StructureRangeGroupResponse {
  return {
    RangeSpreadMax: 75,
    RangeSpreadMin: 50,
    StructureName: 'I am a structure',
    CompanyStructuresRangeGroupId: 1,
    CompanyId: 13,
    CompanyStructuresId: 1,
    CompanyPayMarketId: 1,
    PayMarket: 'TestPayMarket',
    RangeGroupName: 'TestRangeGroupName',
    Currency: 'USDollarTest',
    Rate: 'TestRate',
    ControlPoint: 'TestControlPoint',
    IsPublished: false,
    IsCurrent: true,
    EffectiveDate: new Date('1995-12-17T03:24:00'),
    RangeDistributionTypeId: 1,
    RangeDistributionTypes: generateMockStructureRangeDistributionTypes(),
    RangeDistributionTypeSetting: generateMockRangeDistributionTypeSetting()
  };
}

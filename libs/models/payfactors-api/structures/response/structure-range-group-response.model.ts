import { RangeDistributionType, generateMockStructureRangeDistributionTypes} from './structure-range-distribution-type.model';
import { RangeDistributionSettingResponse, generateMockRangeDistributionSettingResponse } from './range-distribution-setting-response.model';
import { AdvancedSettingResponse, generateMockRangeAdvancedSettingResponse } from './advanced-setting-response.model';

export interface StructureRangeGroupResponse {
  CompanyStructuresRangeGroupId: number;
  CompanyId: number;
  CompanyStructuresId: number;
  CompanyPayMarketId: number;
  PayMarket: string;
  RangeGroupName: string;
  Currency: string;
  Rate: string;
  PayType: string;
  ControlPoint: string;
  IsPublished: boolean;
  IsCurrent: boolean;
  EffectiveDate: Date;
  StructureName: string;
  RangeSpreadMin: number;
  RangeSpreadMax: number;
  RangeDistributionTypeId: number;
  RangeTypeId: number;
  ExchangeId: number;
  RangeDistributionTypes: RangeDistributionType[];
  RangeDistributionSetting: RangeDistributionSettingResponse;
  RangeAdvancedSetting: AdvancedSettingResponse;
  StartingMidpoint: number;
  MidpointProgression: number;
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
    PayType: 'TestPayType',
    ControlPoint: 'TestControlPoint',
    IsPublished: false,
    IsCurrent: true,
    EffectiveDate: new Date('1995-12-17T03:24:00'),
    RangeDistributionTypeId: 1,
    RangeTypeId: 1,
    ExchangeId: 14,
    RangeDistributionTypes: generateMockStructureRangeDistributionTypes(),
    RangeDistributionSetting: generateMockRangeDistributionSettingResponse(),
    RangeAdvancedSetting: generateMockRangeAdvancedSettingResponse(),
    StartingMidpoint: 55555,
    MidpointProgression: 5
  };
}

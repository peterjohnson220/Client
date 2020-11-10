import { FormulaFieldModalObj } from '../../../formula-editor';

export interface RangeDistributionSettingRequest {
  CompanyStructuresRangeGroupId: number;
  RangeDistributionTypeId: number;
  CompanyId: number;
  FirstTertile: string;
  SecondTertile: string;
  FirstQuartile: string;
  SecondQuartile: string;
  FirstQuintile: string;
  SecondQuintile: string;
  ThirdQuintile: string;
  FourthQuintile: string;
  MinPercentile: string;
  MaxPercentile: string;
  ControlPoint_Formula?: FormulaFieldModalObj;
}

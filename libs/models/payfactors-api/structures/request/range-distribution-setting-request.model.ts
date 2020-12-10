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
  Min_Formula?: FormulaFieldModalObj;
  Max_Formula?: FormulaFieldModalObj;
  FirstTertile_Formula?: FormulaFieldModalObj;
  SecondTertile_Formula?: FormulaFieldModalObj;
  FirstQuartile_Formula?: FormulaFieldModalObj;
  SecondQuartile_Formula?: FormulaFieldModalObj;
  FirstQuintile_Formula?: FormulaFieldModalObj;
  SecondQuintile_Formula?: FormulaFieldModalObj;
  ThirdQuintile_Formula?: FormulaFieldModalObj;
  FourthQuintile_Formula?: FormulaFieldModalObj;
}

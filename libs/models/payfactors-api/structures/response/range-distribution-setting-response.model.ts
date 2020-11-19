import { FormulaFieldModalObj, generateFormulaFieldModalObj } from 'libs/models/formula-editor';


export interface RangeDistributionSettingResponse {
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

export function generateMockRangeDistributionSettingResponse(): RangeDistributionSettingResponse {
  return  {
    CompanyStructuresRangeGroupId: 0,
    RangeDistributionTypeId: 0,
    CompanyId: 0,
    FirstTertile: '',
    SecondTertile: '',
    FirstQuartile: '',
    SecondQuartile: '',
    FirstQuintile: '',
    SecondQuintile: '',
    ThirdQuintile: '',
    FourthQuintile: '',
    MinPercentile: '',
    MaxPercentile: '',
    ControlPoint_Formula: generateFormulaFieldModalObj()
  };
}

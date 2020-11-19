import { FormulaFieldModalObj, generateFormulaFieldModalObj } from 'libs/models/formula-editor';

export interface RangeDistributionSettingForm {
    CompanyStructuresRangeGroupId: number;
    CompanyId: number;
    RangeDistributionTypeId: number;
    FirstTertile: string;
    SecondTertile: string;
    FirstQuartile: string;
    SecondQuartile: string;
    FirstQuintile: string;
    SecondQuintile: string;
    ThirdQuintile: string;
    FourthQuintile: string;
    Minimum: number;
    Maximum: number;
    PayType: string;
    ControlPoint: string;
    MinPercentile: string;
    MaxPercentile: string;
    ControlPoint_Formula: FormulaFieldModalObj;
}

export function generateMockRangeDistributionSettingForm(): RangeDistributionSettingForm {
  return  {
    CompanyStructuresRangeGroupId: 0,
    CompanyId: 0,
    RangeDistributionTypeId: 0,
    FirstTertile: '',
    SecondTertile: '',
    FirstQuartile: '',
    SecondQuartile: '',
    FirstQuintile: '',
    SecondQuintile: '',
    ThirdQuintile: '',
    FourthQuintile: '',
    Minimum: 0,
    Maximum: 0,
    PayType: '',
    ControlPoint: '',
    MinPercentile: '',
    MaxPercentile: '',
    ControlPoint_Formula: generateFormulaFieldModalObj()
  };
}

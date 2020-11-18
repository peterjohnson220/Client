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
    ControlPoint_Formula: generateFormulaFieldModalObj(),
    Min_Formula: generateFormulaFieldModalObj(),
    Max_Formula: generateFormulaFieldModalObj(),
    FirstTertile_Formula: generateFormulaFieldModalObj(),
    SecondTertile_Formula: generateFormulaFieldModalObj(),
    FirstQuartile_Formula: generateFormulaFieldModalObj(),
    SecondQuartile_Formula: generateFormulaFieldModalObj(),
    FirstQuintile_Formula: generateFormulaFieldModalObj(),
    SecondQuintile_Formula: generateFormulaFieldModalObj(),
    ThirdQuintile_Formula: generateFormulaFieldModalObj(),
    FourthQuintile_Formula: generateFormulaFieldModalObj()
  };
}

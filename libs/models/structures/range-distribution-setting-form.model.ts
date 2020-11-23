import { FormulaFieldModalObj, generateFormulaFieldModalObj } from 'libs/models/formula-editor';
import { CalculationType } from '../../constants/structures/calculation-type';
import { CalculationTypeDisplay } from './calculation-type-display.model';

export interface RangeDistributionSettingForm {
    CompanyStructuresRangeGroupId: number;
    CompanyId: number;
    RangeDistributionTypeId: number;
    FirstTertile_Percentile: string;
    SecondTertile_Percentile: string;
    FirstQuartile_Percentile: string;
    SecondQuartile_Percentile: string;
    FirstQuintile_Percentile: string;
    SecondQuintile_Percentile: string;
    ThirdQuintile_Percentile: string;
    FourthQuintile_Percentile: string;
    Min_Spread: number;
    Max_Spread: number;
    PayType: string;
    Mid_Percentile: string;
    Min_Percentile: string;
    Max_Percentile: string;
    Mid_Formula: FormulaFieldModalObj;
    Min_Formula: FormulaFieldModalObj;
    Max_Formula: FormulaFieldModalObj;
    FirstTertile_Formula: FormulaFieldModalObj;
    SecondTertile_Formula: FormulaFieldModalObj;
    FirstQuartile_Formula: FormulaFieldModalObj;
    SecondQuartile_Formula: FormulaFieldModalObj;
    FirstQuintile_Formula: FormulaFieldModalObj;
    SecondQuintile_Formula: FormulaFieldModalObj;
    ThirdQuintile_Formula: FormulaFieldModalObj;
    FourthQuintile_Formula: FormulaFieldModalObj;
    MinCalculationType: CalculationTypeDisplay;
    MaxCalculationType: CalculationTypeDisplay;
}

export function generateMockRangeDistributionSettingForm(): RangeDistributionSettingForm {
  return  {
    CompanyStructuresRangeGroupId: 0,
    CompanyId: 0,
    RangeDistributionTypeId: 0,
    FirstTertile_Percentile: '',
    SecondTertile_Percentile: '',
    FirstQuartile_Percentile: '',
    SecondQuartile_Percentile: '',
    FirstQuintile_Percentile: '',
    SecondQuintile_Percentile: '',
    ThirdQuintile_Percentile: '',
    FourthQuintile_Percentile: '',
    Min_Spread: 0,
    Max_Spread: 0,
    PayType: '',
    Mid_Percentile: '',
    Min_Percentile: '',
    Max_Percentile: '',
    Mid_Formula: generateFormulaFieldModalObj(),
    FirstTertile_Formula: generateFormulaFieldModalObj(),
    SecondTertile_Formula: generateFormulaFieldModalObj(),
    FirstQuartile_Formula: generateFormulaFieldModalObj(),
    SecondQuartile_Formula: generateFormulaFieldModalObj(),
    FirstQuintile_Formula: generateFormulaFieldModalObj(),
    SecondQuintile_Formula: generateFormulaFieldModalObj(),
    ThirdQuintile_Formula: generateFormulaFieldModalObj(),
    FourthQuintile_Formula: generateFormulaFieldModalObj(),
    Min_Formula: generateFormulaFieldModalObj(),
    Max_Formula: generateFormulaFieldModalObj(),
    MinCalculationType: { TypeDisplay: 'Min', Type: CalculationType.Spread },
    MaxCalculationType: { TypeDisplay: 'Max', Type: CalculationType.Spread }
  };
}

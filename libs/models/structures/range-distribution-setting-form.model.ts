import { FormulaFieldModalObj } from 'libs/models/formula-editor';

export interface RangeDistributionSettingForm {
    CompanyStructuresRangeGroupId: number;
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

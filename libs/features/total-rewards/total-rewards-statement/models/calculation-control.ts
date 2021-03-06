import { BaseControl } from './base-control';
import { CompensationField } from './compensation-field';
import { LabelWithOverride } from './label-with-override';
import { TotalRewardsColorEnum, FieldLayout } from './settings';
import { TotalRewardsControlEnum } from './total-rewards-control-enum';

export interface CalculationControl extends BaseControl {
  Category: string;
  DataFields: CompensationField[];
  Summary: LabelWithOverride;
  SummaryTextColor: TotalRewardsColorEnum;
  ShowTitle: boolean;
  RowSpacing: FieldLayout;
}

export function generateMockCalculationControl(): CalculationControl {
  return {
    Id: '105',
    $type: 'TotalRewardsCalculationControlDto',
    Title: {Default: 'Cash Compensation', Override: ''},
    ControlType: TotalRewardsControlEnum.Calculation,
    Layout: { Width: 12 },
    Category: 'Compensation',
    DataFields: [
      { Id: '1', DatabaseField: 'EmployeeBase', Name: {Default: 'Base Salary', Override: ''}, IsVisible: true, CanHaveEmployeeContribution: false},
      { Id: '2', DatabaseField: 'EmployeeBonus', Name: {Default: 'Bonus', Override: ''}, IsVisible: true, CanHaveEmployeeContribution: false},
      { Id: '3', DatabaseField: 'EmployeeSTI', Name: {Default: 'Short Term Incentive', Override: ''}, IsVisible: true, CanHaveEmployeeContribution: false}
    ],
    Summary: {Default: '', Override: ''},
    SummaryTextColor: TotalRewardsColorEnum.Undefined,
    ShowTitle: true,
    RowSpacing: FieldLayout.Normal
  };
}

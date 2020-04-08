import { BaseControl } from './base-control';
import { CompensationField } from './compensation-field';
import { LabelWithOverride } from './label-with-override';
import { TotalRewardsControlEnum } from './total-rewards-control-enum';

export interface CalculationControl extends BaseControl {
  Category: string;
  DataFields: CompensationField[];
  Summary: LabelWithOverride;
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
      { Id: '1', DatabaseField: 'Base', Name: {Default: 'Base Salary', Override: ''}, IsVisible: true},
      { Id: '2', DatabaseField: 'Bonus', Name: {Default: 'Bonus', Override: ''}, IsVisible: true},
      { Id: '3', DatabaseField: 'STI', Name: {Default: 'Short Term Incentive', Override: ''}, IsVisible: true}
    ],
    Summary: {Default: '', Override: ''}
  };
}

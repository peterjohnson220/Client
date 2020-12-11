import { BaseControl } from './base-control';
import { TotalRewardsControlEnum } from './total-rewards-control-enum';
import { TotalRewardsColorEnum } from '../models/settings';

export interface EmployeeControl extends BaseControl {
  SummaryTextColor: TotalRewardsColorEnum;
}

export function generateMockEmployeeControl(): EmployeeControl {
  return {
    Id: '49511789',
    $type: 'TotalRewardsEmployeeControlDto',
    Title: { Default: 'DefaultTitle', Override: '' },
    ControlType: TotalRewardsControlEnum.Employee,
    Layout: { Width: 12 },
    SummaryTextColor: TotalRewardsColorEnum.Undefined
  };
}

import { BaseControl } from './base-control';
import { TotalRewardsControlEnum } from './total-rewards-control-enum';
import { TotalRewardsColorEnum } from '../models/settings';

export interface EffectiveDateControl extends BaseControl {
  SummaryTextColor: TotalRewardsColorEnum;
}

export function generateMockEffectiveDateControl(): EffectiveDateControl {
  return {
    Id: '4951178199',
    $type: 'TotalRewardsEmployeeControlDto',
    Title: { Default: 'DefaultTitle', Override: '' },
    ControlType: TotalRewardsControlEnum.EffectiveDate,
    Layout: { Width: 12 },
    SummaryTextColor: TotalRewardsColorEnum.Undefined
  };
}

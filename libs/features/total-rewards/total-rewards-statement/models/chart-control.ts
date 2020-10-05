import { BaseControl } from './base-control';
import { TotalRewardsControlEnum } from './total-rewards-control-enum';

export interface ChartControl extends BaseControl {
  DataFields: [];
}

export function generateMockChartControl(): ChartControl {
  return {
    Id: '49511789',
    $type: 'TotalRewardsChartControlDto',
    Title: { Default: 'DefaultTitle', Override: '' },
    ControlType: TotalRewardsControlEnum.Chart,
    Layout: { Width: 12 },
    DataFields: null
  };
}

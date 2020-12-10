import { BaseControl } from './base-control';
import { TotalRewardsControlEnum } from './total-rewards-control-enum';

export interface ChartControl extends BaseControl {
  DataFields: [];
  Height: string; // css units, eg 350px, 100%, 10rem, etc
  ShowTitle: boolean;
  ShowChartSeriesLabels: boolean;
}

export function generateMockChartControl(): ChartControl {
  return {
    Id: '49511789',
    $type: 'TotalRewardsChartControlDto',
    Title: { Default: 'DefaultTitle', Override: '' },
    ControlType: TotalRewardsControlEnum.Chart,
    Layout: { Width: 12 },
    DataFields: null,
    Height: '250px',
    ShowTitle: true,
    ShowChartSeriesLabels: true
  };
}

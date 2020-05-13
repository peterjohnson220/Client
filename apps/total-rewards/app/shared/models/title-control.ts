import { BaseControl } from './base-control';
import { Layout, TotalRewardsControlEnum } from './';
import { LabelWithOverride } from './label-with-override';

export class TitleControl implements BaseControl {
  $type: string;
  Id: string;
  Title: LabelWithOverride;
  ControlType: TotalRewardsControlEnum;
  Layout: Layout;
}

export function generateMockTitleControl(): TitleControl {
  return {
    Id: '34654',
    $type: 'TotalRewardsTitleControlDto',
    Title: {
      Default: 'Your Total Rewards Statement',
      Override: null
    },
    ControlType: 5, // avoid circular dependency
    Layout: {
      Width: 12
    }
  };
}

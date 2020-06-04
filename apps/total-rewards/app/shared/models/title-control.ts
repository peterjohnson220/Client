import { BaseControl } from './base-control';
import { Layout } from './';
import { TotalRewardsControlEnum } from '../models/total-rewards-control-enum';
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
    ControlType: TotalRewardsControlEnum.Title,
    Layout: {
      Width: 12
    }
  };
}

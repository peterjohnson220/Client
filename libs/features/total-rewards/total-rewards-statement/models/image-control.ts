import { BaseControl } from './base-control';
import { TotalRewardsControlEnum } from './total-rewards-control-enum';

export interface ImageControl extends BaseControl {
  FileName: string;
  FileUrl: string;
  HorizontalAlignment: string;
}

export function generateMockImageControl(): ImageControl {
  return {
    Id: '129',
    $type: 'TotalRewardsImageControlDto',
    Title: {Default: 'Image', Override: ''},
    ControlType: TotalRewardsControlEnum.Image,
    Layout: { Width: 12 },
    FileName: '',
    FileUrl: '',
    HorizontalAlignment: ''
  };
}

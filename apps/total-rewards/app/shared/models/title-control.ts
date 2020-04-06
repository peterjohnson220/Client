import {BaseControl} from './base-control';
import {TotalRewardsControlEnum, Layout} from './';
import {LabelWithOverride} from './label-with-override';

export class TitleControl implements BaseControl {
  $type: string;
  Id: string;
  Title: LabelWithOverride;
  ControlType: TotalRewardsControlEnum;
  Layout: Layout;
}

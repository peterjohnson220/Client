import {BaseControl} from './base-control';
import {TotalRewardsControlEnum, Layout} from './';

export class TitleControl implements BaseControl {
  $type: string;
  Id: string;
  Title: string;
  ControlType: TotalRewardsControlEnum;
  Layout: Layout;
}

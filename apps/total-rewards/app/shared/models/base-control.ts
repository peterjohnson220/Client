import { Layout } from './layout';
import { TotalRewardsControlEnum } from './total-rewards-control-enum';

export interface BaseControl {
  Id: string;
  Title: string;
  ControlType: TotalRewardsControlEnum;
  Layout: Layout;
}

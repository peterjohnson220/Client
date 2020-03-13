import { Layout } from './layout';
import { TotalRewardsControlEnum } from './total-rewards-control-enum';

export interface BaseControl {
  Title: string;
  ControlType: TotalRewardsControlEnum;
  Layout: Layout;
}

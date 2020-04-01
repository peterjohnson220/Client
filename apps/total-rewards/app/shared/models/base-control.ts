import { Layout } from './layout';
import { TotalRewardsControlEnum } from './total-rewards-control-enum';

export interface BaseControl {
  $type: string; // this is used for serialization purposes: https://www.newtonsoft.com/json/help/html/SerializeTypeNameHandling.htm
  Id: string;
  Title: string;
  ControlType: TotalRewardsControlEnum;
  Layout: Layout;
}

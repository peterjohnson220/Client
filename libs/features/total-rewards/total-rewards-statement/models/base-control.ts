import { Layout } from './layout';
import { TotalRewardsControlEnum } from './total-rewards-control-enum';
import {LabelWithOverride} from './label-with-override';

export interface BaseControl {
  $type: string; // this is used for serialization purposes: https://www.newtonsoft.com/json/help/html/SerializeTypeNameHandling.htm
  Id: string;
  Title: LabelWithOverride;
  ControlType: TotalRewardsControlEnum;
  Layout: Layout;
}

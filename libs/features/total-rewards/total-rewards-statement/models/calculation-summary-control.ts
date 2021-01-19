import { BaseControl } from './base-control';
import { TotalRewardsColorEnum } from './settings';

export interface CalculationSummaryControl extends BaseControl {
  SummaryTextColor: TotalRewardsColorEnum;
  IsTabularView: boolean;
  IncreaseMarginTop: boolean;
  IsItalicized: boolean;
}

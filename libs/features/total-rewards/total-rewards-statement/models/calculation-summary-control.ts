import { BaseControl } from './base-control';
import { TotalRewardsColorEnum } from '../models/settings';

export interface CalculationSummaryControl extends BaseControl {
  SummaryTextColor: TotalRewardsColorEnum;
}

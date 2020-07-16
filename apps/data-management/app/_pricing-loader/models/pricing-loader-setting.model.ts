import { LoaderSetting } from 'libs/models/data-loads';

export interface PricingLoaderSetting extends LoaderSetting {
  DisplayName: string;
  GroupName: string;
  NumericValue: number;
  DefaultValue?: number;
  Min?: number;
  Max?: number;
  Decimals?: number;
  GroupColumnSize?: number;
}

export enum MRPFieldConfig {
  Min = 1,
  Max = 99,
  DefaultValue = 50,
  Decimals = 2
}

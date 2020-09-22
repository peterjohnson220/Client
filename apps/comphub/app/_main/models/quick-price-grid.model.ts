import { SortDescriptor } from '@progress/kendo-data-query';

export interface QuickPriceGridContext {
  JobTitleShort: string;
  CompanyPayMarketId?: number;
  Skip: number;
  Take: number;
  Sort?: SortDescriptor;
  WithoutData?: boolean;
}

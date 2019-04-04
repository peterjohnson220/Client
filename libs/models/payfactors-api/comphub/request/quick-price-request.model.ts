import { PagingOptions } from '../../search/request';

export interface QuickPriceRequest {
  JobTitleShort: string;
  CompanyPaymarketId?: number;
  PagingOptions: PagingOptions;
  Sort?: SortOption;
  CountryCode: string;
}

export interface SortOption {
  Field: string;
  Dir: string;
}

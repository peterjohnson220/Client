import { PagingOptions } from '../../search/request';

export interface QuickPriceRequest {
  JobTitleShort: string;
  CompanyPaymarketId?: number;
  PagingOptions: PagingOptions;
  Sort?: SortOption;
  CountryCode: string;
  WithoutData?: boolean;
}

export interface SortOption {
  Field: string;
  Dir: string;
}

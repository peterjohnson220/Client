import { PagingOptions } from '../../search/request';

export interface QuickPriceRequest extends QuickPriceBaseRequest {
  JobTitleShort: string;
  PagingOptions: PagingOptions;
  Sort?: SortOption;
}

export interface QuickPriceJobDataRequest extends QuickPriceBaseRequest {
  JobId: number;
}

export interface SortOption {
  Field: string;
  Dir: string;
}

export interface QuickPriceBaseRequest {
  CompanyPaymarketId?: number;
  CountryCode: string;
}

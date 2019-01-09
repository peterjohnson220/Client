import { BaseProjectSearchRequest, FilterOptions, PagingOptions } from '../../search/request';

export interface BaseJobSearchRequest extends BaseProjectSearchRequest {
  PayMarketId: number;
}
export interface JobSearchRequest extends BaseJobSearchRequest {
  PagingOptions: PagingOptions;
  FilterOptions: FilterOptions;
}

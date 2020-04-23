import { BaseSearchRequest, FilterOptions, PagingOptions } from '../../search/request';

export interface JobSearchRequestStructuresRangeGroup extends BaseSearchRequest {
  CountryCode?: string;
  PayMarketId: number;
  PagingOptions: PagingOptions;
  FilterOptions: FilterOptions;
  StructureRangeGroupId: number;
}

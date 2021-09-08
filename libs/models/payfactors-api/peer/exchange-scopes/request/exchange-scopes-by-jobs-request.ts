import { PagingOptions } from '../../../search/request';

export interface ExchangeScopesByJobsRequest {
  ExchangeJobIds: number[];
  PagingOptions: PagingOptions;
  ScopeNameFilter: string;
}

import { PagingOptions } from '../../../search/request';

export interface ExchangeScopesByExchangeRequest {
  ExchangeId: number;
  IncludeCompanyScopes: boolean;
  IncludeStandardScopes: boolean;
  PagingOptions: PagingOptions;
  ScopeNameFilter: string;
  DefaultScopeId: number;
}

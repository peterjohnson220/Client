
import { generateMockExchangeDataSearchFilterContext } from '../exchange-data-search-filter-context.model';
import {BaseExchangeDataSearchRequest} from '../../payfactors-api/peer/exchange-data-search/request';

export interface ExchangeScopeDetails {
  ExchangeId: number;
  ExchangeScopeId: number;
  ExchangeScopeName: string;
  ExchangeScopeDescription: string;
  IsDefault?: boolean;
}

export interface UpsertExchangeExplorerScopeRequest {
  ExchangeScopeDetails: ExchangeScopeDetails;
  ExchangeDataSearchRequest: BaseExchangeDataSearchRequest;
}

export function generateMockExchangeScopeDetails(): ExchangeScopeDetails {
  return {
    ExchangeId: 1,
    ExchangeScopeId: 1,
    ExchangeScopeName: 'MockScope',
    ExchangeScopeDescription: 'Mock Exchange Scope Description',
  };
}

export function generateMockUpsertExchangeExplorerScopeRequest(): UpsertExchangeExplorerScopeRequest {
  return {
    ExchangeScopeDetails: generateMockExchangeScopeDetails(),
    ExchangeDataSearchRequest: {
      FilterContext: generateMockExchangeDataSearchFilterContext(),
      Filters: [],
      SearchFields: []
    }
  };
}


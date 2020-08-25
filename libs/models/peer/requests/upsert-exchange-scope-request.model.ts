
import { generateMockExchangeDataSearchFilterContext } from '../exchange-data-search-filter-context.model';
import {BaseExchangeDataSearchRequest} from '../../payfactors-api/peer/exchange-data-search/request';

export interface ExchangeScopeDetails {
  ExchangeId: number;
  ExchangeScopeGuid: string;
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
    ExchangeScopeGuid: 'MockGUID',
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


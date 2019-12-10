import { ExchangeDataSearchFilterContext, generateMockExchangeDataSearchFilterContext } from 'libs/models/peer';
import { ExchangeExplorerScopeResponseContext,
         generateMockExchangeExplorerScopeResponseContext } from 'libs/models/payfactors-api/peer/exchange-data-filter/response';

export interface ExchangeExplorerScopeResponse {
  FilterContext: ExchangeDataSearchFilterContext;
  ScopeContext: ExchangeExplorerScopeResponseContext;
}

export function generateMockExchangeExplorerScopeResponse(): ExchangeExplorerScopeResponse {
  return {
    FilterContext: generateMockExchangeDataSearchFilterContext(),
    ScopeContext: generateMockExchangeExplorerScopeResponseContext()
  };
}

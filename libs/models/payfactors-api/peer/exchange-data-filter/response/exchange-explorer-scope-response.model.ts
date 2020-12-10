import { ExchangeDataSearchFilterContext, generateMockExchangeDataSearchFilterContext } from 'libs/models/peer';
import { ExchangeExplorerScopeResponseContext,
         generateMockExchangeExplorerScopeResponseContext } from './exchange-explorer-scope-response-context.model';

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

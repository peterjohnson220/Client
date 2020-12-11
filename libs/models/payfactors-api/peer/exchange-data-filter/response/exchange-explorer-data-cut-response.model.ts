import { ExchangeExplorerContextInfo, generateMockExchangeExplorerContextInfo } from 'libs/models/peer';
import { ExchangeExplorerScopeResponseContext, generateMockExchangeExplorerScopeResponseContext } from './exchange-explorer-scope-response-context.model';

export interface ExchangeExplorerDataCutResponse {
  ExchangeExplorerContextInfo: ExchangeExplorerContextInfo;
  ScopeContext: ExchangeExplorerScopeResponseContext;
}

export function generateMockExchangeExplorerDataCutResponse(): ExchangeExplorerDataCutResponse {
  return {
    ExchangeExplorerContextInfo: generateMockExchangeExplorerContextInfo(),
    ScopeContext: generateMockExchangeExplorerScopeResponseContext()
  };
}
